import { useState, useEffect, useRef } from 'react';

const generateUniqueId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const toTimestamp = (v) => {
  if (!v) return 0;
  if (typeof v === 'number') return v;
  const t = Date.parse(v);
  return Number.isNaN(t) ? 0 : t;
};

export const useDatabase = (songs, setSongs, setLists, setSetLists) => {
  const [recoveryNotification, setRecoveryNotification] = useState(null);
  const [runtimeErrors, setRuntimeErrors] = useState([]);
  const isInitialLoad = useRef(true);

  // Fetch and merge data from backend on load
  useEffect(() => {
    if (navigator.onLine) {
      const wasSongsEmpty = !localStorage.getItem('ronz_songs') || 
                             localStorage.getItem('ronz_songs') === '[]';
      const wasSetlistsEmpty = !localStorage.getItem('ronz_setlists') || 
                                localStorage.getItem('ronz_setlists') === '[]';
      
      let recoveredSongs = 0;
      let recoveredSetlists = 0;
      
      Promise.all([
        fetch('/api/songs').then(res => {
          if (!res.ok) throw new Error(`Songs fetch failed: ${res.status}`);
          return res.json();
        }),
        fetch('/api/setlists').then(res => {
          if (!res.ok) throw new Error(`Setlists fetch failed: ${res.status}`);
          return res.json();
        })
      ])
        .then(([songsData, setlistsData]) => {
          // Merge songs
          if (Array.isArray(songsData)) {
            setSongs(prev => {
              const merged = [...prev];
              const beforeCount = merged.length;
              
              songsData.forEach(remote => {
                const localIdx = merged.findIndex(s => s.id === remote.id);
                if (localIdx > -1) {
                  const remoteTs = toTimestamp(remote.updatedAt);
                  const localTs = toTimestamp(merged[localIdx].updatedAt);
                  merged[localIdx] = (remoteTs > localTs) ? remote : merged[localIdx];
                } else {
                  merged.push(remote);
                }
              });
              
              if (wasSongsEmpty && beforeCount === 0) {
                recoveredSongs = merged.length;
              }
              
              return merged;
            });
          }
          
          // Merge setlists
          if (Array.isArray(setlistsData)) {
            setSetLists(prev => {
              const merged = [...prev];
              const beforeCount = merged.length;
              
              setlistsData.forEach(remote => {
                const localIdx = merged.findIndex(s => s.id === remote.id);
                if (localIdx > -1) {
                  const remoteTs = toTimestamp(remote.updatedAt);
                  const localTs = toTimestamp(merged[localIdx].updatedAt);
                  merged[localIdx] = (remoteTs > localTs) ? remote : merged[localIdx];
                } else {
                  merged.push(remote);
                }
              });
              
              if (wasSetlistsEmpty && beforeCount === 0) {
                recoveredSetlists = merged.length;
              }

              const totalRecovered = recoveredSongs + recoveredSetlists;
              if (totalRecovered > 0) {
                const parts = [];
                if (recoveredSongs > 0) parts.push(`${recoveredSongs} lagu`);
                if (recoveredSetlists > 0) parts.push(`${recoveredSetlists} setlist`);
                
                setRecoveryNotification({
                  type: 'success',
                  count: totalRecovered,
                  message: `Dipulihkan: ${parts.join(' & ')} dari cloud backup`
                });
                setTimeout(() => setRecoveryNotification(null), 5000);
              }
              
              return merged;
            });
          }
        })
        .finally(() => {
          isInitialLoad.current = false;
        })
        .catch(err => {
          console.error('[FETCH] Failed to fetch from backend:', err);
          const wasAnyEmpty = wasSongsEmpty || wasSetlistsEmpty;
          if (wasAnyEmpty) {
            setRecoveryNotification({
              type: 'error',
              count: 0,
              message: 'Gagal terhubung ke cloud. Data akan disinkronkan saat online.'
            });
            setTimeout(() => setRecoveryNotification(null), 5000);
          }
        });
    } else {
      const wasSongsEmpty = !localStorage.getItem('ronz_songs') || 
                             localStorage.getItem('ronz_songs') === '[]';
      const wasSetlistsEmpty = !localStorage.getItem('ronz_setlists') || 
                                localStorage.getItem('ronz_setlists') === '[]';
      const wasAnyEmpty = wasSongsEmpty || wasSetlistsEmpty;
      
      if (wasAnyEmpty) {
        setRecoveryNotification({
          type: 'warning',
          count: 0,
          message: 'Offline: Data akan dipulihkan saat terhubung ke internet.'
        });
        setTimeout(() => setRecoveryNotification(null), 5000);
      }
    }
  }, []);

  // Collect runtime errors
  useEffect(() => {
    const handleError = (event) => {
      const message = event?.message || event?.reason?.message || 'Unknown error';
      const detail = event?.error?.stack || event?.reason?.stack || '';
      setRuntimeErrors(prev => {
        const next = [{ id: generateUniqueId(), message, detail }, ...prev];
        return next.slice(0, 4);
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, []);

  const dismissError = (id) => {
    setRuntimeErrors(prev => prev.filter(err => err.id !== id));
  };

  const handleExportDatabase = () => {
    const data = {
      version: '3.0',
      exportDate: new Date().toISOString(),
      songs,
      setlists: setLists
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ronz-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportDatabase = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result || '{}');
        const importedSongs = Array.isArray(data.songs) ? data.songs : [];
        const importedSetlists = Array.isArray(data.setlists) ? data.setlists : [];

        setSongs(importedSongs);
        setSetLists(importedSetlists);

        alert(`Database restored. Imported ${importedSongs.length} songs and ${importedSetlists.length} setlists.`);
      } catch (err) {
        alert(`Failed to import database: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  return {
    recoveryNotification,
    setRecoveryNotification,
    runtimeErrors,
    setRuntimeErrors,
    isInitialLoad,
    dismissError,
    handleExportDatabase,
    handleImportDatabase
  };
};

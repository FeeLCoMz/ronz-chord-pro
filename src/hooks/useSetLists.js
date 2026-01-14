import { useState, useEffect, useRef } from 'react';

const generateUniqueId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const sanitizeSetLists = (list = []) => {
  if (!Array.isArray(list)) return [];
  return list
    .filter(Boolean)
    .filter(sl => {
      const name = sl.name?.trim();
      if (!name) return false;
      return !name.toLowerCase().includes('untitled');
    })
    .map(sl => ({
      ...sl,
      name: sl.name.trim(),
      songs: Array.isArray(sl.songs) ? sl.songs.filter(Boolean) : [],
      songKeys: typeof sl.songKeys === 'object' && sl.songKeys !== null ? sl.songKeys : {},
      completedSongs: typeof sl.completedSongs === 'object' && sl.completedSongs !== null ? sl.completedSongs : {}
    }));
};

export const useSetLists = (songs) => {
  const getInitialSetLists = () => {
    try {
      const data = localStorage.getItem('ronz_setlists');
      if (data) {
        const parsed = sanitizeSetLists(JSON.parse(data));
        if (parsed.length > 0) return parsed;
      }
    } catch { }
    return [];
  };

  const [setLists, setSetLists] = useState(getInitialSetLists);
  const [currentSetList, setCurrentSetList] = useState(null);
  const [showSetListForm, setShowSetListForm] = useState(false);
  const [editingSetList, setEditingSetList] = useState(null);
  const [showSetlistView, setShowSetlistView] = useState(true);
  const isInitialLoad = useRef(true);

  // Save to localStorage
  useEffect(() => {
    try {
      const sanitized = sanitizeSetLists(setLists);
      localStorage.setItem('ronz_setlists', JSON.stringify(sanitized));
    } catch { }
  }, [setLists]);

  // Pastikan state setlist selalu bersih setelah mount
  useEffect(() => {
    setSetLists(prev => sanitizeSetLists(prev));
  }, []);

  // Sync setLists to backend (debounced)
  useEffect(() => {
    if (!navigator.onLine || setLists.length === 0) return;

    const syncTimeout = setTimeout(async () => {
      for (const setList of setLists) {
        try {
          const checkRes = await fetch(`/api/setlists/${setList.id}`);
          if (checkRes.status === 200) {
            const updateRes = await fetch(`/api/setlists/${setList.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(setList)
            });
            if (!updateRes.ok) {
              console.warn(`Failed to update setlist ${setList.id}: ${updateRes.status}`);
            }
          } else if (checkRes.status === 404) {
            const createRes = await fetch('/api/setlists', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(setList)
            });
            if (!createRes.ok) {
              console.warn(`Failed to create setlist ${setList.id}: ${createRes.status}`);
            }
          } else {
            const createRes = await fetch('/api/setlists', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(setList)
            });
            if (!createRes.ok) {
              console.warn(`Failed to sync setlist ${setList.id}: ${createRes.status}`);
            }
          }
        } catch (err) {
          console.warn(`Failed to sync setlist ${setList.id}:`, err.message);
        }
      }
    }, 500);

    return () => clearTimeout(syncTimeout);
  }, [setLists]);

  const handleCreateSetList = async (name) => {
    const now = Date.now();
    const newSetList = {
      id: generateUniqueId(),
      name,
      songs: [],
      songKeys: {},
      completedSongs: {},
      createdAt: new Date().toISOString(),
      updatedAt: now
    };
    setSetLists(prevSetLists => [...prevSetLists, newSetList]);
    setCurrentSetList(newSetList.id);
    
    try {
      await fetch('/api/setlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSetList)
      });
    } catch (err) {
      console.error('Error creating setlist:', err);
    }
    
    setShowSetListForm(false);
    setEditingSetList(null);
  };

  const handleUpdateSetList = async (id, name) => {
    let updatedSetList = null;
    setSetLists(prevSetLists => {
      return prevSetLists.map(sl => {
        if (sl.id === id) {
          const next = { ...sl, name, updatedAt: Date.now() };
          updatedSetList = next;
          return next;
        }
        return sl;
      });
    });
    if (updatedSetList) {
      try {
        await fetch(`/api/setlists/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedSetList)
        });
      } catch (err) {
        console.error('Error updating setlist:', err);
      }
    }
    setShowSetListForm(false);
    setEditingSetList(null);
  };

  const handleDeleteSetList = async (id) => {
    if (!confirm('Hapus setlist ini?')) return;
    setSetLists(prevSetLists => prevSetLists.filter(sl => sl.id !== id));
    setCurrentSetList(null);

    try {
      await fetch(`/api/setlists/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Error deleting setlist:', err);
    }
  };

  const handleDuplicateSetList = async (id) => {
    const originalSetList = setLists.find(sl => sl.id === id);
    if (!originalSetList) return;

    const now = Date.now();
    const duplicatedSetList = {
      id: generateUniqueId(),
      name: `${originalSetList.name} (Copy)`,
      songs: [...originalSetList.songs],
      songKeys: { ...(originalSetList.songKeys || {}) },
      completedSongs: {},
      createdAt: new Date().toISOString(),
      updatedAt: now
    };

    setSetLists(prevSetLists => [...prevSetLists, duplicatedSetList]);

    try {
      await fetch('/api/setlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duplicatedSetList)
      });
    } catch (err) {
      console.error('Error duplicating setlist:', err);
    }
  };

  const handleAddSongToSetList = async (setListId, songId) => {
    let updatedSetList = null;
    setSetLists(prevSetLists => {
      return prevSetLists.map(setList => {
        if (setList.id === setListId && !setList.songs.includes(songId)) {
          const next = { 
            ...setList, 
            songs: [...setList.songs, songId], 
            songKeys: setList.songKeys || {}, 
            updatedAt: Date.now() 
          };
          updatedSetList = next;
          return next;
        }
        return setList;
      });
    });
    if (updatedSetList) {
      try {
        await fetch(`/api/setlists/${setListId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedSetList)
        });
      } catch (err) {
        console.error('Error adding song to setlist:', err);
      }
    }
  };

  const handleRemoveSongFromSetList = async (setListId, songId) => {
    let updatedSetList = null;
    setSetLists(prevSetLists => {
      return prevSetLists.map(setList => {
        if (setList.id === setListId) {
          const next = { 
            ...setList, 
            songs: setList.songs.filter(id => id !== songId), 
            songKeys: setList.songKeys || {}, 
            completedSongs: setList.completedSongs || {},
            updatedAt: Date.now() 
          };
          if (next.songKeys && next.songKeys[songId]) {
            const { [songId]: _, ...rest } = next.songKeys;
            next.songKeys = rest;
          }
          if (next.completedSongs && next.completedSongs[songId]) {
            const { [songId]: _, ...rest } = next.completedSongs;
            next.completedSongs = rest;
          }
          updatedSetList = next;
          return next;
        }
        return setList;
      });
    });
    
    if (updatedSetList) {
      try {
        await fetch(`/api/setlists/${setListId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedSetList)
        });
      } catch (err) {
        console.error('Error removing song from setlist:', err);
      }
    }
  };

  const handleSetListSongKey = async (setListId, songId, key) => {
    let updatedSetList = null;
    setSetLists(prevSetLists => {
      return prevSetLists.map(setList => {
        if (setList.id === setListId) {
          const next = { 
            ...setList, 
            songKeys: { ...(setList.songKeys || {}) }, 
            updatedAt: Date.now() 
          };
          if (key && key.trim()) {
            next.songKeys[songId] = key.trim();
          } else if (next.songKeys[songId]) {
            const { [songId]: _, ...rest } = next.songKeys;
            next.songKeys = rest;
          }
          updatedSetList = next;
          return next;
        }
        return setList;
      });
    });
    if (updatedSetList) {
      try {
        await fetch(`/api/setlists/${setListId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedSetList)
        });
      } catch (err) {
        console.error('Error updating song key:', err);
      }
    }
  };

  const handleToggleCompletedSong = async (setListId, songId) => {
    let updatedSetList = null;
    setSetLists(prevSetLists => {
      return prevSetLists.map(setList => {
        if (setList.id === setListId) {
          const next = { 
            ...setList, 
            completedSongs: { ...(setList.completedSongs || {}) }, 
            updatedAt: Date.now() 
          };
          if (next.completedSongs[songId]) {
            delete next.completedSongs[songId];
          } else {
            next.completedSongs[songId] = Date.now();
          }
          updatedSetList = next;
          return next;
        }
        return setList;
      });
    });
    if (updatedSetList) {
      try {
        await fetch(`/api/setlists/${setListId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedSetList)
        });
      } catch (err) {
        console.error('Error updating completed status:', err);
      }
    }
  };

  const getSetListSongs = () => {
    if (!currentSetList) return [];
    const setList = setLists.find(sl => sl.id === currentSetList);
    if (!setList) return [];
    return setList.songs.map(id => songs.find(s => s.id === id)).filter(Boolean);
  };

  const getCurrentSongIndexInSetList = (selectedSong) => {
    if (!currentSetList || !selectedSong) return -1;
    const setListSongs = getSetListSongs();
    return setListSongs.findIndex(s => s.id === selectedSong.id);
  };

  return {
    setLists,
    setSetLists,
    currentSetList,
    setCurrentSetList,
    showSetListForm,
    setShowSetListForm,
    editingSetList,
    setEditingSetList,
    showSetlistView,
    setShowSetlistView,
    handleCreateSetList,
    handleUpdateSetList,
    handleDeleteSetList,
    handleDuplicateSetList,
    handleAddSongToSetList,
    handleRemoveSongFromSetList,
    handleSetListSongKey,
    handleToggleCompletedSong,
    getSetListSongs,
    getCurrentSongIndexInSetList
  };
};

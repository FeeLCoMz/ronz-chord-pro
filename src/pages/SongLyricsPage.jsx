import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import ChordDisplay from '../components/ChordDisplay';
import TransposeBar from '../components/TransposeBar';
import AutoScrollBar from '../components/AutoScrollBar';
import YouTubeViewer from '../components/YouTubeViewer';
import TimeMarkers from '../components/TimeMarkers';
import SetlistSongNavigator from '../components/SetlistSongNavigator';
import { getAuthHeader } from '../utils/auth.js';

export default function SongLyricsPage({ song: songProp }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  
  // State for fetched song data
  const [fetchedSong, setFetchedSong] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get metadata from location state (setlist context)
  const setlistSongData = location.state?.setlistSong || {};
  const setlistData = location.state?.setlist || {};
  const setlistId = location.state?.setlistId;
  
  // Use fetched song if available, otherwise fallback to prop or state
  const song = fetchedSong || songProp || location.state?.song;
  const artist = setlistSongData.artist || song?.artist || '';
  const key = setlistSongData.key || song?.key || '';
  const tempo = setlistSongData.tempo || song?.tempo || '';
  const genre = setlistSongData.genre || song?.genre || '';
  const capo = setlistSongData.capo || song?.capo || '';
  const youtubeId = song?.youtubeId || song?.youtube_url || '';
  const timeMarkers = song?.time_markers || [];

  // Transpose state
  const [transpose, setTranspose] = useState(0);
  const [zoom, setZoom] = useState(1);
  const highlightChords = false;
  
  // In-place editing state
  const [isEditingLyrics, setIsEditingLyrics] = useState(false);
  const [editedLyrics, setEditedLyrics] = useState('');
  const [savingLyrics, setSavingLyrics] = useState(false);
  const [editError, setEditError] = useState(null);

  // Fetch song data from API when ID changes (to ensure fresh data after edits)
  useEffect(() => {
    if (!id) return;
    
    // Determine if we should fetch fresh data
    // - Fetch when coming from edit (fromEdit flag)
    // - Fetch when no songProp provided (direct URL access)
    // - Don't fetch if coming from setlist context (has setlistId in state)
    const fromSetlist = location.state?.setlistId;
    const fromEdit = location.state?.fromEdit;
    const shouldFetch = fromEdit || (!songProp && !fromSetlist);
    
    if (shouldFetch) {
      // Clear previous fetched data to avoid showing stale data
      setFetchedSong(null);
      setLoading(true);
      setError(null);
      
      fetch(`/api/songs/${id}`, {
        headers: getAuthHeader()
      })
        .then(res => {
          if (!res.ok) throw new Error('Gagal memuat lagu');
          return res.json();
        })
        .then(data => {
          setFetchedSong(data);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    } else if (songProp) {
      // Use songProp if available and not coming from edit
      setFetchedSong(songProp);
    }
  }, [id, location.pathname, location.state?.fromEdit]); // Re-fetch when ID, path, or edit flag changes


  // Auto-calculate transpose if setlist has different key
  useEffect(() => {
    if (setlistSongData.key && song?.key && setlistSongData.key !== song.key) {
      const keyMap = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
      const originalIdx = keyMap.indexOf(song.key);
      const targetIdx = keyMap.indexOf(setlistSongData.key);
      if (originalIdx >= 0 && targetIdx >= 0) {
        let steps = targetIdx - originalIdx;
        if (steps < 0) steps += 12;
        setTranspose(steps);
      }
    }
  }, [setlistSongData.key, song?.key]);

  // Show loading state
  if (loading) {
    return (
      <div className="page-container">
        <div className="not-found-container">
          <div className="not-found-icon">⏳</div>
          <h2 className="not-found-title">Memuat Lagu...</h2>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="page-container">
        <div className="not-found-container">
          <div className="not-found-icon">⚠️</div>
          <h2 className="not-found-title">Error</h2>
          <p className="not-found-message">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="btn-submit"
          >
            ← Kembali
          </button>
        </div>
      </div>
    );
  }

  if (!song) {
    return (
      <div className="page-container">
        <div className="not-found-container">
          <div className="not-found-icon">🎵</div>
          <h2 className="not-found-title">Lagu Tidak Ditemukan</h2>
          <p className="not-found-message">
            Lagu yang Anda cari tidak tersedia
          </p>
          <button
            onClick={() => navigate(-1)}
            className="btn-submit"
          >
            ← Kembali
          </button>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    if (setlistId) {
      navigate(`/setlists/${setlistId}`);
    } else {
      navigate('/songs');
    }
  };

  const handleEdit = () => {
    navigate(`/songs/edit/${song.id}`);
  };
  
  const handleEditLyrics = () => {
    setEditedLyrics(song.lyrics || '');
    setIsEditingLyrics(true);
    setEditError(null);
  };
  
  const handleCancelEditLyrics = () => {
    setIsEditingLyrics(false);
    setEditedLyrics('');
    setEditError(null);
  };
  
  const handleSaveLyrics = async () => {
    if (!song.id) return;
    
    setSavingLyrics(true);
    setEditError(null);
    
    try {
      const res = await fetch(`/api/songs/${song.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({
          ...song,
          lyrics: editedLyrics
        })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Gagal menyimpan lirik');
      }
      
      // API returns only { id }, so fetch fresh data
      const fetchRes = await fetch(`/api/songs/${song.id}`, {
        headers: getAuthHeader()
      });
      
      if (!fetchRes.ok) {
        throw new Error('Gagal memuat data terbaru');
      }
      
      const updatedSong = await fetchRes.json();
      setFetchedSong(updatedSong);
      setIsEditingLyrics(false);
      setEditedLyrics('');
    } catch (err) {
      setEditError(err.message);
    } finally {
      setSavingLyrics(false);
    }
  };
  
  // Keyboard shortcut for saving lyrics (Ctrl+S / Cmd+S)
  useEffect(() => {
    if (!isEditingLyrics) return;
    
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSaveLyrics();
      }
      if (e.key === 'Escape') {
        handleCancelEditLyrics();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditingLyrics, editedLyrics, song?.id]);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="song-detail-header">
        <button
          onClick={handleBack}
          className="song-detail-back"
          aria-label="Kembali"
        >
          ←
        </button>
        <div className="song-detail-info">
          <h1 className="song-detail-title">
            {song.title}
          </h1>
          {artist && (
            <div className="song-detail-artist">
              {artist}
            </div>
          )}
        </div>
        <button
          onClick={handleEdit}
          className="song-detail-edit"
        >
          ✏️ Edit
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="content-grid">
        {/* Left Column: Song Info & Controls */}
        <div className="form-section">
          {/* Song Details Card */}
          <div className="song-section-card">
            <h3 className="song-section-title">
              📋 Detail Lagu
            </h3>
            <div className="form-section" style={{ gap: '10px' }}>
              {artist && (
                <div className="song-info-row">
                  <span className="song-info-label">👤 Artist:</span>
                  <span className="song-info-value">{artist}</span>
                </div>
              )}
              {key && (
                <div className="song-info-row">
                  <span className="song-info-label">🎹 Key:</span>
                  <span className="song-info-value">{key}</span>
                </div>
              )}
              {tempo && (
                <div className="song-info-row">
                  <span className="song-info-label">⏱️ Tempo:</span>
                  <span className="song-info-value">{tempo} BPM</span>
                </div>
              )}
              {genre && (
                <div className="song-info-row">
                  <span className="song-info-label">🎸 Genre:</span>
                  <span className="song-info-value">{genre}</span>
                </div>
              )}
              {capo && (
                <div className="song-info-row">
                  <span className="song-info-label">📌 Capo:</span>
                  <span className="song-info-value">Fret {capo}</span>
                </div>
              )}
              {!artist && !key && !tempo && !genre && !capo && (
                <div className="not-found-message" style={{ marginBottom: 0 }}>
                  Tidak ada detail metadata
                </div>
              )}
            </div>
          </div>

          {/* Playback Controls Card */}
          <div className="song-section-card">
            <h3 className="song-section-title">
              🎚️ Kontrol Playback
            </h3>
            <div className="form-section">
              <TransposeBar
                transpose={transpose}
                setTranspose={setTranspose}
              />
              <AutoScrollBar tempo={tempo || 120} />
            </div>
          </div>
        </div>

        {/* Right Column: YouTube & Time Markers */}
        <div className="form-section">
          <YouTubeViewer videoId={youtubeId || ''} />
          
          <TimeMarkers
            timeMarkers={timeMarkers}
            readonly={true}
          />
        </div>
      </div>

      {/* Lyrics Section */}
      <div className="song-section-card">
        <div className="lyrics-header">
          <h3 className="song-section-title">
            🎤 Lirik & Chord
          </h3>
          <div className="lyrics-controls">
            {!isEditingLyrics ? (
              <button
                type="button"
                onClick={handleEditLyrics}
                className="btn btn-secondary lyrics-edit-btn"
              >
                ✏️ Edit Lirik
              </button>
            ) : (
              <div className="lyrics-edit-actions">
                <button
                  type="button"
                  onClick={handleSaveLyrics}
                  disabled={savingLyrics}
                  className="btn btn-primary lyrics-edit-btn"
                >
                  {savingLyrics ? '⏳ Menyimpan...' : '✓ Simpan'}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEditLyrics}
                  disabled={savingLyrics}
                  className="btn btn-secondary lyrics-edit-btn"
                >
                  ✕ Batal
                </button>
              </div>
            )}
            <div className="zoom-controls">
            <button
              onClick={() => setZoom(Math.max(0.7, zoom - 0.1))}
              className="btn-base zoom-btn"
              title="Perkecil"
            >
              −
            </button>
            <span className="zoom-display">{(zoom * 100).toFixed(0)}%</span>
            <button
              onClick={() => setZoom(Math.min(1.5, zoom + 0.1))}
              className="btn-base zoom-btn"
              title="Perbesar"
            >
              +
            </button>
            <button
              onClick={() => setZoom(1)}
              className="btn-base zoom-btn"
              title="Reset"
            >
              ⟲
            </button>
          </div>
          </div>
        </div>
        
        {editError && (
          <div className="error-message">
            {editError}
          </div>
        )}
        
        {isEditingLyrics && (
          <div className="info-text lyrics-editor-tips">
            💡 Tips: Tekan <kbd>Ctrl+S</kbd> untuk simpan, <kbd>Esc</kbd> untuk batal
          </div>
        )}
        
        {isEditingLyrics ? (
          <textarea
            value={editedLyrics}
            onChange={(e) => setEditedLyrics(e.target.value)}
            className="lyrics-editor-textarea"
            autoFocus
            placeholder="Masukkan lirik dan chord...
Contoh:
[C]Amazing grace how [F]sweet the [C]sound"
          />
        ) : (
          <ChordDisplay
            song={song}
            transpose={transpose}
            highlightChords={highlightChords}
            zoom={zoom}
          />
        )}
      </div>

      {/* Setlist Navigation (if in setlist context) */}
      {setlistId && setlistData.songs && (
        <SetlistSongNavigator
          setlistId={setlistId}
          currentSongId={song.id}
          songs={setlistData.songs}
        />
      )}
    </div>
  );
}

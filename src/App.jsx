import React, { useState, useEffect } from 'react';
import './App.css';
import ChordDisplay from './components/ChordDisplay.jsx';
import SongList from './components/SongList.jsx';
import AutoScrollBar from './components/AutoScrollBar.jsx';
import YouTubeViewer from './components/YouTubeViewer.jsx';
import SongNotes from './components/SongNotes.jsx';
import TimeMarkers from './components/TimeMarkers.jsx';
import TransposeBar from './components/TransposeBar.jsx';

function App() {
  const [tab, setTab] = useState('songs');
  const [songs, setSongs] = useState([]);
  const [setlists, setSetlists] = useState([]);
  const [search, setSearch] = useState('');
  const [loadingSongs, setLoadingSongs] = useState(true);
  const [loadingSetlists, setLoadingSetlists] = useState(false);
  const [errorSongs, setErrorSongs] = useState(null);
  const [errorSetlists, setErrorSetlists] = useState(null);
  const [selectedSong, setSelectedSong] = useState(null);
  const [activeSetlist, setActiveSetlist] = useState(null);
  const [activeSetlistSongIdx, setActiveSetlistSongIdx] = useState(0);
  const [transpose, setTranspose] = useState(0);
  const [highlightChords, setHighlightChords] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('ronz_theme') || 'dark';
    }
    return 'dark';
  });
  // State untuk setlist yang sedang dilihat di main content (tanpa fullscreen)
  const [viewingSetlist, setViewingSetlist] = useState(null);

  useEffect(() => {
    document.body.classList.remove('dark-mode', 'light-mode');
    document.body.classList.add(theme === 'dark' ? 'dark-mode' : 'light-mode');
    localStorage.setItem('ronz_theme', theme);
  }, [theme]);

  useEffect(() => {
    setLoadingSongs(true);
    fetch('/api/songs')
      .then(res => { if (!res.ok) throw new Error('Gagal mengambil data lagu'); return res.json(); })
      .then(data => { setSongs(Array.isArray(data) ? data : []); setLoadingSongs(false); })
      .catch(err => { setErrorSongs(err.message || 'Gagal mengambil data'); setLoadingSongs(false); });
  }, []);

  useEffect(() => {
    if (tab === 'setlists') {
      setLoadingSetlists(true);
      fetch('/api/setlists')
        .then(res => { if (!res.ok) throw new Error('Gagal mengambil data setlist'); return res.json(); })
        .then(data => { setSetlists(Array.isArray(data) ? data : []); setLoadingSetlists(false); })
        .catch(err => { setErrorSetlists(err.message || 'Gagal mengambil data setlist'); setLoadingSetlists(false); });
    }
  }, [tab]);

  const filteredSongs = songs.filter(song =>
    (song.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (song.artist || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {!selectedSong && !activeSetlist && (
        <>
          <header className="app-header">
            <h1 className="app-title">🎸 RoNz Chord Pro</h1>
            <div className="app-subtitle">Aplikasi Chord & Lirik - Desain Baru</div>
            <button
              className={theme === 'dark' ? 'theme-switch-btn dark' : 'theme-switch-btn light'}
              onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
              title="Ganti mode gelap/terang"
            >
              {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
            </button>
            <div className="tab-nav">
              <button onClick={() => setTab('songs')} className={tab === 'songs' ? 'tab-btn active' : 'tab-btn'}>Lagu</button>
              <button onClick={() => setTab('setlists')} className={tab === 'setlists' ? 'tab-btn active' : 'tab-btn'}>Setlist</button>
            </div>
          </header>
          <main className="main-content">
            {tab === 'songs' && (
              <>
                <div className="section-title">Lagu</div>
                <input
                  type="text"
                  placeholder="Cari judul atau artist..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="search-input"
                />
                {loadingSongs && <div className="info-text">Memuat daftar lagu...</div>}
                {errorSongs && <div className="error-text">{errorSongs}</div>}
                <SongList
                  songs={filteredSongs}
                  onSongClick={setSelectedSong}
                  emptyText="Tidak ada lagu ditemukan."
                />
              </>
            )}
            {tab === 'setlists' && (
              <>
                <div className="section-title">Setlist</div>
                {viewingSetlist ? (
                  <>
                    <button className="back-btn" onClick={() => setViewingSetlist(null)}>&larr; Kembali ke daftar setlist</button>
                    <div className="section-title">{viewingSetlist.name}</div>
                    <SongList
                      songs={
                        (viewingSetlist.songs || [])
                          .map(id => songs.find(song => song.id === id))
                          .filter(Boolean)
                      }
                      onSongClick={setSelectedSong}
                      emptyText="Setlist ini belum berisi lagu."
                    />
                  </>
                ) : (
                  <>
                    {loadingSetlists && <div className="info-text">Memuat setlist...</div>}
                    {errorSetlists && <div className="error-text">{errorSetlists}</div>}
                    <ul className="setlist-list">
                      {!loadingSetlists && !errorSetlists && setlists.length === 0 && (
                        <li className="info-text">Belum ada setlist.</li>
                      )}
                      {setlists.map(setlist => (
                        <li key={setlist.id} className="setlist-list-item" style={{cursor:'pointer'}} onClick={() => setViewingSetlist(setlist)}>
                          <span className="setlist-title">{setlist.name}</span>
                          <span className="setlist-count">{(setlist.songs?.length || 0)} lagu</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </>
            )}
          </main>
        </>
      )}
      {selectedSong && (
        <div className="song-detail-fullscreen">
          <button className="back-btn" onClick={() => setSelectedSong(null)}>&larr; Kembali ke daftar</button>
          <TransposeBar
            transpose={transpose}
            setTranspose={setTranspose}
            highlightChords={highlightChords}
            setHighlightChords={setHighlightChords}
          />
          {selectedSong.youtubeId ? (
            <YouTubeViewer
              videoId={selectedSong.youtubeId}
              ref={ytRef => {
                window._ytRef = ytRef;
              }}
              onTimeUpdate={(t, d) => {
                window._ytCurrentTime = t;
              }}
            />
          ) : null}
          <TimeMarkers
            songId={selectedSong.id}
            getCurrentTime={() => window._ytCurrentTime || 0}
            seekTo={t => window._ytRef && window._ytRef.handleSeek && window._ytRef.handleSeek(t)}
          />
          <SongNotes songId={selectedSong.id} />
          {/* YouTubeViewer already rendered above for time marker sync */}
          <AutoScrollBar tempo={selectedSong.tempo ? Number(selectedSong.tempo) : 80} />
          <ChordDisplay song={selectedSong} transpose={transpose} highlightChords={highlightChords} />
        </div>
      )}
      {activeSetlist && (
        <div className="song-detail-fullscreen">
          <button className="back-btn" onClick={() => setActiveSetlist(null)}>&larr; Kembali ke setlist</button>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18, marginBottom: 18 }}>
            <button
              className="aksi-btn"
              disabled={activeSetlistSongIdx <= 0}
              onClick={() => setActiveSetlistSongIdx(idx => Math.max(0, idx - 1))}
            >⟨ Sebelumnya</button>
            <span style={{ fontWeight: 700, fontSize: '1.1em' }}>
              {activeSetlist.songs && activeSetlist.songs.length > 0
                ? `${activeSetlistSongIdx + 1} / ${activeSetlist.songs.length}`
                : '0 / 0'}
            </span>
            <button
              className="aksi-btn"
              disabled={activeSetlistSongIdx >= (activeSetlist.songs?.length || 1) - 1}
              onClick={() => setActiveSetlistSongIdx(idx => Math.min((activeSetlist.songs?.length || 1) - 1, idx + 1))}
            >Berikutnya ⟩</button>
          </div>
          {(() => {
            const song = songs.find(s => s.id === activeSetlist.songs[activeSetlistSongIdx]);
            if (song && song.youtubeId) {
              return (
                <YouTubeViewer
                  videoId={song.youtubeId}
                  ref={ytRef => {
                    window._ytRef = ytRef;
                  }}
                  onTimeUpdate={(t, d) => {
                    window._ytCurrentTime = t;
                  }}
                />
              );
            }
            return null;
          })()}
          <TimeMarkers
            songId={activeSetlist.songs[activeSetlistSongIdx]}
            getCurrentTime={() => window._ytCurrentTime || 0}
            seekTo={t => window._ytRef && window._ytRef.handleSeek && window._ytRef.handleSeek(t)}
          />
          <SongNotes songId={activeSetlist.songs[activeSetlistSongIdx]} />
          {/* YouTubeViewer already rendered above for time marker sync */}
          <TransposeBar
            transpose={transpose}
            setTranspose={setTranspose}
            highlightChords={highlightChords}
            setHighlightChords={setHighlightChords}
          />
          <AutoScrollBar tempo={(() => {
            const song = songs.find(s => s.id === activeSetlist.songs[activeSetlistSongIdx]);
            return song && song.tempo ? Number(song.tempo) : 80;
          })()} />
          <ChordDisplay song={songs.find(s => s.id === activeSetlist.songs[activeSetlistSongIdx])} transpose={transpose} highlightChords={highlightChords} />
        </div>
      )}
    </>
  );
}

export default App;

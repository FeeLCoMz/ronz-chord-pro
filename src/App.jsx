import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import SongList from './components/SongList.jsx';
import SongDetail from './components/SongDetail.jsx';
import EditSong from './components/EditSong.jsx';
import EditIcon from './components/EditIcon.jsx';
import SetlistSection from './components/SetlistSection.jsx';

function App() {
    // State untuk modal create setlist
    const [showCreateSetlist, setShowCreateSetlist] = useState(false);
    const [createSetlistName, setCreateSetlistName] = useState('');
    const [createSetlistError, setCreateSetlistError] = useState('');
  // Semua state harus dideklarasikan sebelum digunakan
  const [addSongError, setAddSongError] = useState('');
  const [tab, setTab] = useState('songs');
  const [showAddSong, setShowAddSong] = useState(false);
  const [showEditSong, setShowEditSong] = useState(false);
  const [editSongId, setEditSongId] = useState(null);
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
  // State untuk modal tambah lagu ke setlist
  const [showAddSongToSetlist, setShowAddSongToSetlist] = useState(false);
  const [addSongSearch, setAddSongSearch] = useState('');
  const [addSongSelectedId, setAddSongSelectedId] = useState(null);
  const addSongInputRef = useRef(null);
  // Filter lagu yang belum ada di setlist
  const availableSongsForSetlist = viewingSetlist
    ? songs.filter(song => !(viewingSetlist.songs || []).includes(song.id))
    : [];
  const filteredAvailableSongs = availableSongsForSetlist.filter(song =>
    (song.title || '').toLowerCase().includes(addSongSearch.toLowerCase()) ||
    (song.artist || '').toLowerCase().includes(addSongSearch.toLowerCase())
  );

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

  // Jika sedang tambah/edit lagu, tampilkan EditSong saja (full screen/modal), sembunyikan elemen lain
  if (showAddSong) {
    return (
      <EditSong
        mode="add"
        onBack={() => setShowAddSong(false)}
        onSongUpdated={() => {
          setShowAddSong(false);
          setLoadingSongs(true);
          fetch('/api/songs')
            .then(res => res.json())
            .then(data => { setSongs(Array.isArray(data) ? data : []); setLoadingSongs(false); });
        }}
      />
    );
  }
  if (showEditSong && editSongId) {
    return (
      <EditSong
        songId={editSongId}
        onBack={() => {
          setShowEditSong(false);
          setEditSongId(null);
        }}
        onSongUpdated={() => {
          setShowEditSong(false);
          setEditSongId(null);
          setSelectedSong(null);
          setLoadingSongs(true);
          fetch('/api/songs')
            .then(res => res.json())
            .then(data => { setSongs(Array.isArray(data) ? data : []); setLoadingSongs(false); });
        }}
      />
    );
  }

  // ...existing code...
  return (
    <>
      {!selectedSong && !activeSetlist && (
        <>
          <header className="app-header">
            <h1 className="app-title">🎸 RoNz Chord Pro</h1>
            <div className="app-subtitle">Manajemen Chord, Lirik, & Setlist Lagu Modern</div>
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
                <div className="info-text" style={{ marginTop: -12, marginBottom: 16, fontSize: '1.05em' }}>
                  Jumlah lagu: {filteredSongs.length}
                </div>
                <button className="tab-btn" style={{ marginBottom: 18 }} onClick={() => setShowAddSong(true)}>+ Tambah Lagu</button>
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
              <SetlistSection
                setlists={setlists}
                viewingSetlist={viewingSetlist}
                setViewingSetlist={setViewingSetlist}
                songs={songs}
                showCreateSetlist={showCreateSetlist}
                setShowCreateSetlist={setShowCreateSetlist}
                createSetlistName={createSetlistName}
                setCreateSetlistName={setCreateSetlistName}
                createSetlistError={createSetlistError}
                setCreateSetlistError={setCreateSetlistError}
                loadingSetlists={loadingSetlists}
                errorSetlists={errorSetlists}
                showAddSongToSetlist={showAddSongToSetlist}
                setShowAddSongToSetlist={setShowAddSongToSetlist}
                addSongError={addSongError}
                setAddSongError={setAddSongError}
                addSongSearch={addSongSearch}
                setAddSongSearch={setAddSongSearch}
                addSongSelectedId={addSongSelectedId}
                setAddSongSelectedId={setAddSongSelectedId}
                addSongInputRef={addSongInputRef}
                filteredAvailableSongs={filteredAvailableSongs}
                setSetlists={setSetlists}
              />
            )}
          </main>
        </>
      )}
      {selectedSong && !showEditSong && (
        <SongDetail
          song={selectedSong}
          onBack={() => setSelectedSong(null)}
          transpose={transpose}
          setTranspose={setTranspose}
          highlightChords={highlightChords}
          setHighlightChords={setHighlightChords}
          onEdit={() => {
            setEditSongId(selectedSong.id);
            setShowEditSong(true);
          }}
        />
      )}
      {activeSetlist && (
        <SongDetail
          song={songs.find(s => s.id === activeSetlist.songs[activeSetlistSongIdx])}
          onBack={() => setActiveSetlist(null)}
          transpose={transpose}
          setTranspose={setTranspose}
          highlightChords={highlightChords}
          setHighlightChords={setHighlightChords}
          showNav={true}
          navIndex={activeSetlistSongIdx}
          navTotal={activeSetlist.songs?.length || 0}
          onPrev={() => setActiveSetlistSongIdx(idx => Math.max(0, idx - 1))}
          onNext={() => setActiveSetlistSongIdx(idx => Math.min((activeSetlist.songs?.length || 1) - 1, idx + 1))}
          onEdit={() => {
            const song = songs.find(s => s.id === activeSetlist.songs[activeSetlistSongIdx]);
            if (song) {
              setEditSongId(song.id);
              setShowEditSong(true);
            }
          }}
        />
      )}
    </>
  );
}

export default App;

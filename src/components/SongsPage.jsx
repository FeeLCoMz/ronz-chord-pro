import React from 'react';

export default function SongsPage(props) {
    // Destructure all props needed from parent (App.jsx)
    const {
        songs,
        setLists,
        currentSetList,
        setCurrentSetList,
        sortBy,
        setSortBy,
        sortOrder,
        setSortOrder,
        searchQuery,
        setSearchQuery,
        viewMode,
        setViewMode,
        selectedSong,
        setSelectedSong,
        handleEditSong,
        handleDeleteSong,
        handleAddSongToSetList,
        handleRemoveSongFromSetList,
        handleToggleCompletedSong,
        setShowSongForm,
        setShowBulkAddSongs,
        setShowBatchProcessing,
        setEditingSong,
        setSetLists,
        setSetListForSongsPage,
        setShowSetListSongsPage,
        showSetListSongsPage,
        handleShareSetList,
        handleShareSetListLink,
        getPendingSongsInSetList,
        displaySongs,
        SongListItem,
        activeNav,
        setActiveNav,
        handleToggleViewMode,
        performanceMode,
        showYouTube,
        // Additional destructured props for all referenced variables
        setEditingSetList,
        setShowSetListForm,
        handleDuplicateSetList,
        handleDeleteSetList,
        setListForSongsPage,
        setShowSetListPopup,
        setSelectedSetListsForAdd,
        handleTranspose,
        transpose,
        setTranspose,
        setDarkMode,
        darkMode,
        setMetronomeActive,
        metronomeActive,
        setMetronomeBpm,
        metronomeBpm,
        metronomeTick,
        setAutoScrollActive,
        autoScrollActive,
        setScrollSpeed,
        scrollSpeed,
        setShowYouTube,
        setLyricsMode,
        lyricsMode,
        togglePerformanceMode,
        performanceFontSize,
        setPerformanceFontSize,
        performanceTheme,
        setPerformanceTheme,
        keyboardMode,
        highlightChords,
        setHighlightChords,
        showSetlistView,
        setShowSetlistView,
        getSetListSongs,
        getCurrentSongIndexInSetList,
        navigateToPrevSongInSetList,
        navigateToNextSongInSetList,
        setViewerSeekTo,
        viewerSeekTo,
        youtubeSync,
        setYoutubeSync,
        setCurrentVideoTime,
        setVideoDuration,
        scrollRef,
        lyricsSectionRef,
        perfMainRef,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
        ChordDisplay,
        AutoScroll,
        YouTubeViewer,
        SetListSongsPage,
        // ...rest for any other props
        ...rest
    } = props;

    // ...existing code below, replace all variable references with props if needed...

    // Handler for saving checked setlists to the song
    const handleSaveAddToSetlists = () => {
        if (!selectedSong || !selectedSetListsForAdd || !selectedSetListsForAdd.length) return;
        selectedSetListsForAdd.forEach(slId => handleAddSongToSetList(slId, selectedSong.id));
        setShowSetListPopup(false);
    };

    return (
        <div className="container">
            {/* Setlist Popup for Add-to-Setlist */}
            {showSetListPopup && selectedSong && (
                <div className="modal-overlay" style={{ zIndex: 1000 }}>
                    <div className="modal-content" style={{ maxWidth: 400, margin: '4rem auto', padding: 24, background: 'var(--card)', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }}>
                        <h3 style={{ marginTop: 0, marginBottom: 16 }}>Tambah ke Setlist</h3>
                        <div style={{ maxHeight: 300, overflowY: 'auto', marginBottom: 16 }}>
                            {setLists.length === 0 ? (
                                <div style={{ color: 'var(--text-muted)' }}>Belum ada setlist.</div>
                            ) : (
                                setLists.map(sl => (
                                    <label key={sl.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={selectedSetListsForAdd.includes(sl.id)}
                                            onChange={e => {
                                                if (e.target.checked) {
                                                    setSelectedSetListsForAdd(prev => [...prev, sl.id]);
                                                } else {
                                                    setSelectedSetListsForAdd(prev => prev.filter(id => id !== sl.id));
                                                }
                                            }}
                                        />
                                        <span>{sl.name}</span>
                                    </label>
                                ))
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                            <button className="btn" onClick={() => setShowSetListPopup(false)}>Batal</button>
                            <button className="btn btn-primary" onClick={handleSaveAddToSetlists} disabled={!selectedSetListsForAdd.length}>Tambah ke Setlist</button>
                        </div>
                    </div>
                </div>
            )}
                {/* Main Content Area */}
                {/* ...existing JSX code, using props as needed... */}
                <div className="view-header">
                    <div>
                        <h2>📋 Lagu</h2>
                        {currentSetList && (() => {
                            const setList = setLists.find(sl => sl.id === currentSetList);
                            if (!setList) return null;
                            // Pending songs: string di setList.songs yang bukan id lagu
                            const songIds = songs.map(s => s.id);
                            const pendingSongs = Array.isArray(setList.songs)
                                ? setList.songs.filter(item => typeof item === 'string' && !songIds.includes(item))
                                : [];
                            return (
                                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    Setlist: {setList.name}
                                    <button
                                        onClick={() => setCurrentSetList(null)}
                                        style={{ background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', fontSize: '0.8rem' }}
                                    >
                                        ✕ Lihat Semua
                                    </button>
                                    <button
                                        onClick={handleShareSetList}
                                        style={{ background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', fontSize: '0.8rem' }}
                                        title="Bagikan daftar lagu"
                                    >
                                        📤 Bagikan
                                    </button>
                                    <button
                                        onClick={handleShareSetListLink}
                                        style={{ background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', fontSize: '0.8rem' }}
                                        title="Bagikan link setlist"
                                    >
                                        🔗 Link
                                    </button>
                                    {pendingSongs.length > 0 && (
                                        <button
                                            onClick={handleRemoveAllPendingSongs}
                                            style={{ background: '#ff922b', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', marginLeft: '0.5rem' }}
                                            title="Hapus semua pending songs dari setlist ini"
                                        >
                                            🗑️ Hapus Semua Pending Songs
                                        </button>
                                    )}
                                </p>
                            );
                        })()}
                    </div>
                    <button onClick={() => setShowSongForm(true)} className="btn btn-sm btn-primary" title="Tambah Lagu">
                        ➕
                    </button>
                    {currentSetList && (
                        <>
                            <button
                                onClick={() => setShowBulkAddSongs(true)}
                                className="btn btn-sm btn-primary"
                                title="Tambah Lagu ke Setlist dari Daftar"
                            >
                                📝
                            </button>
                            <button
                                onClick={() => setShowBatchProcessing(true)}
                                className="btn btn-sm btn-primary"
                                title="Update metadata untuk multiple lagu sekaligus"
                            >
                                🔄
                            </button>
                        </>
                    )}
                </div>
                <div className="filters-bar">
                    <div className="search-box" style={{ flex: 1, position: 'relative' }}>
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari lagu..."
                            aria-label="Cari lagu"
                        />
                        {searchQuery && (
                            <button
                                className="btn-icon-sm"
                                onClick={() => setSearchQuery('')}
                                style={{
                                    position: 'absolute',
                                    right: '0.5rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    padding: '0.25rem 0.5rem',
                                    fontSize: '0.85rem',
                                    opacity: 0.7
                                }}
                                title="Hapus pencarian"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                    <select
                        className="setlist-select"
                        value={currentSetList || ''}
                        onChange={(e) => setCurrentSetList(e.target.value || null)}
                        title="Pilih setlist untuk filter lagu"
                    >
                        <option value="">📋 Semua Lagu</option>
                        {setLists.map(setList => (
                            <option key={setList.id} value={setList.id}>
                                🎵 {setList.name} ({setList.songs?.length || 0})
                            </option>
                        ))}
                    </select>
                    <select
                        className="setlist-select"
                        value={sortBy}
                        onChange={e => {
                            setSortBy(e.target.value);
                            // Reset sortOrder ke default saat ganti sortBy
                            if (['title-asc', 'artist-asc', 'newest', 'style', 'tempo', 'updated'].includes(e.target.value)) {
                                setSortOrder('asc');
                            }
                        }}
                    >
                        <option value="title-asc">📋 Judul</option>
                        <option value="artist-asc">🎤 Artis</option>
                        <option value="newest">🕒 Terbaru</option>
                        <option value="style">🎼 Style</option>
                        <option value="tempo">⏱️ Tempo</option>
                        <option value="updated">📝 Diupdate</option>
                    </select>
                    {/* Toggle Asc/Desc */}
                    <button
                        style={{ marginLeft: 4 }}
                        onClick={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')}
                        title={sortOrder === 'asc' ? 'Urutkan Z-A/Desc' : 'Urutkan A-Z/Asc'}
                    >
                        {sortOrder === 'asc' ? '⬆️' : '⬇️'}
                    </button>

                    <button
                        className="btn btn-icon"
                        onClick={handleToggleViewMode}
                        title={`Gaya tampilan: ${viewMode === 'default' ? 'Default' : viewMode === 'compact' ? 'Compact' : 'Detailed'}`}
                    >
                        {viewMode === 'compact' ? '📇' : viewMode === 'detailed' ? '📋' : '🎴'}
                    </button>
                </div>
                <div className={`songs-cards-grid view-mode-${viewMode}`}>
                    {displaySongs.length === 0 ? (
                        <div className="empty-state">
                            {songs.length === 0 ? 'Tidak ada lagu. Klik ➕ untuk tambah.' : 'Tidak ada hasil pencarian.'}
                        </div>
                    ) : (
                        displaySongs.map(song => (
                            <div key={song.id} style={{ position: 'relative' }}>
                                <SongListItem
                                    song={song}
                                    isActive={selectedSong?.id === song.id}
                                    viewMode={viewMode}
                                    onSelect={() => handleSelectSong(song)}
                                    onEdit={() => handleEditSong(song)}
                                    onDelete={() => handleDeleteSong(song.id)}
                                    setLists={setLists}
                                    currentSetList={currentSetList}
                                    isCompleted={currentSetList ? (setLists.find(sl => sl.id === currentSetList)?.completedSongs?.[song.id]) : false}
                                    onToggleCompleted={currentSetList ? () => handleToggleCompletedSong(currentSetList, song.id) : null}
                                    overrideKey={(currentSetList ? (setLists.find(sl => sl.id === currentSetList)?.songKeys?.[song.id]) : null) || null}
                                    onSetListKeyChange={(key) => {
                                        if (!currentSetList) return;
                                        const setListId = currentSetList;
                                        let updatedSetList = null;
                                        setSetLists(prevSetLists => {
                                            return prevSetLists.map(setList => {
                                                if (setList.id === setListId) {
                                                    const next = { ...setList, songKeys: { ...(setList.songKeys || {}) }, updatedAt: Date.now() };
                                                    if (key && key.trim()) {
                                                        next.songKeys[song.id] = key.trim();
                                                    } else if (next.songKeys[song.id]) {
                                                        const { [song.id]: _, ...rest } = next.songKeys;
                                                        next.songKeys = rest;
                                                    }
                                                    updatedSetList = next;
                                                    return next;
                                                }
                                                return setList;
                                            });
                                        });
                                        if (updatedSetList) {
                                            fetch(`/api/setlists/${setListId}`, {
                                                method: 'PUT',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ name: updatedSetList.name, songs: updatedSetList.songs, songKeys: updatedSetList.songKeys, updatedAt: updatedSetList.updatedAt })
                                            }).catch(err => console.error('Gagal menyimpan key setlist:', err));
                                        }
                                    }}
                                    onAddToSetLists={slIds => slIds.forEach(slId => handleAddSongToSetList(slId, song.id))}
                                    onRemoveFromSetList={handleRemoveSongFromSetList}
                                />
                                {/* Tombol untuk halaman khusus lirik & chord */}
                                {typeof onShowLyricsChordsPage === 'function' && (
                                    <button
                                        style={{ position: 'absolute', top: 8, right: 8, zIndex: 2 }}
                                        className="btn btn-xs btn-primary"
                                        title="Lihat Lirik & Chord Full"
                                        onClick={() => onShowLyricsChordsPage(song)}
                                    >
                                        🎼 Lirik & Chord
                                    </button>
                                )}
                            </div>
                        ))
                    )}

                    {/* Pending Songs Section */}
                    {currentSetList && getPendingSongsInSetList().length > 0 && (
                        <>
                            <div style={{ gridColumn: '1 / -1', padding: '1rem 0', borderTop: '2px solid var(--border)', marginTop: '1rem' }}>
                                <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1rem', color: 'var(--text-secondary)' }}>
                                    ⏳ Lagu Pending (Menunggu Dibuat)
                                </h3>
                            </div>
                            {getPendingSongsInSetList().map(songName => (
                                <div
                                    key={`pending-${songName}`}
                                    style={{
                                        padding: '1rem',
                                        border: '2px dashed var(--primary)',
                                        borderRadius: '0.5rem',
                                        backgroundColor: 'var(--card-hover)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '0.75rem'
                                    }}
                                >
                                    <div>
                                        <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                                            ⏳ {songName}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                            Belum ada di database
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => {
                                                setShowSongForm(true);
                                                // Split jika format 'Artis - Judul Lagu'
                                                let title = songName;
                                                let artist = '';
                                                if (songName.includes(' - ')) {
                                                    const parts = songName.split(' - ');
                                                    if (parts.length > 1) {
                                                        title = parts[0].trim();
                                                        artist = parts.slice(1).join(' - ').trim();
                                                    }
                                                }
                                                const newSong = {
                                                    title,
                                                    artist,
                                                    key: 'C',
                                                    lyrics: '',
                                                    youtubeId: '',
                                                    tempo: '',
                                                    style: '',
                                                    timestamps: []
                                                };
                                                setEditingSong(newSong);
                                            }}
                                            className="btn btn-sm btn-primary"
                                            title="Buat lagu baru dengan nama ini"
                                            style={{ flex: 1 }}
                                        >
                                            ➕ Buat Sekarang
                                        </button>
                                        <button
                                            onClick={() => {
                                                // Remove pending song from setlist
                                                if (!currentSetList) return;
                                                let updatedSetList = null;
                                                setSetLists(prevSetLists => {
                                                    return prevSetLists.map(setList => {
                                                        if (setList.id === currentSetList) {
                                                            const next = {
                                                                ...setList,
                                                                songs: setList.songs.filter(s => s !== songName),
                                                                updatedAt: Date.now()
                                                            };
                                                            updatedSetList = next;
                                                            return next;
                                                        }
                                                        return setList;
                                                    });
                                                });
                                                if (updatedSetList) {
                                                    fetch(`/api/setlists/${currentSetList}`, {
                                                        method: 'PUT',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({
                                                            name: updatedSetList.name,
                                                            songs: updatedSetList.songs,
                                                            songKeys: updatedSetList.songKeys,
                                                            completedSongs: updatedSetList.completedSongs,
                                                            updatedAt: updatedSetList.updatedAt
                                                        })
                                                    }).catch(err => console.error('Gagal hapus pending song:', err));
                                                }
                                            }}
                                            className="btn btn-sm"
                                            title="Hapus dari setlist"
                                            style={{ flex: 1 }}
                                        >
                                            ✕ Hapus
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
                {activeNav === 'setlists' && !showSetListSongsPage && (
                    <div className="main-content setlists-view">
                        <div className="view-header">
                            <h2>🎵 Setlist</h2>
                            <button onClick={() => { setEditingSetList(null); setShowSetListForm(true); }} className="btn btn-sm btn-primary">
                                ➕ Buat Setlist
                            </button>
                        </div>

                        <div className="setlists-cards-grid">
                            {setLists.length === 0 ? (
                                <div className="empty-state">
                                    Tidak ada setlist. Klik ➕ untuk membuat.
                                </div>
                            ) : (
                                setLists.map(setList => (
                                    <div
                                        key={setList.id}
                                        className={`setlist-card ${currentSetList === setList.id ? 'active' : ''}`}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => {
                                            setCurrentSetList(setList.id);
                                            setSetListForSongsPage(setList);
                                            setShowSetListSongsPage(true);
                                        }}
                                    >
                                        <div className="setlist-card-header">
                                            <h3>📋 {setList.name}</h3>
                                            <div className="setlist-card-actions" onClick={e => e.stopPropagation()}>
                                                <button
                                                    className="btn btn-xs"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditingSetList(setList);
                                                        setShowSetListForm(true);
                                                    }}
                                                    title="Edit Setlist"
                                                >
                                                    ✎
                                                </button>
                                                <button
                                                    className="btn btn-xs"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDuplicateSetList(setList.id);
                                                    }}
                                                    title="Duplikat Setlist"
                                                >
                                                    📋
                                                </button>
                                                <button
                                                    className="btn btn-xs btn-danger"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteSetList(setList.id);
                                                    }}
                                                    title="Hapus Setlist"
                                                >
                                                    🗑
                                                </button>
                                            </div>
                                        </div>
                                        <div className="setlist-card-body">
                                            {(() => {
                                                // Always treat songs as array
                                                let songArr = setList.songs;
                                                if (typeof songArr === 'string') {
                                                    try { songArr = JSON.parse(songArr); } catch { songArr = []; }
                                                }
                                                if (!Array.isArray(songArr)) songArr = [];
                                                // Only count completed songs that are in the setlist
                                                const completed = Object.keys(setList.completedSongs || {}).filter(id => songArr.includes(id));
                                                return (
                                                    <p className="song-count">
                                                        {songArr.length} lagu
                                                        {' • '}
                                                        <span style={{ color: 'var(--success)', fontWeight: '600' }}>
                                                            ✓ {completed.length}
                                                        </span>
                                                        {' selesai'}
                                                    </p>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {activeNav === 'setlists' && showSetListSongsPage && (
                    <SetListSongsPage
                        setList={setListForSongsPage}
                        songs={songs}
                        onBack={() => setShowSetListSongsPage(false)}
                        onSongClick={songId => {
                            const song = songs.find(s => s.id === songId);
                            if (song) {
                                setSelectedSong(song);
                                setShowSetListSongsPage(false);
                            }
                        }}
                    />
                )}

                <main className="main">
                    <>
                        {selectedSong && !performanceMode && (
                            <div className="controls controls-compact">
                                {/* Transpose Group */}
                                <button onClick={() => handleTranspose(-1)} className="btn btn-xs" title="Transpose turun (♭)">♭</button>
                                <span className="transpose-value" style={{ minWidth: 32, textAlign: 'center' }} title="Nilai transpose">{transpose > 0 ? `+${transpose}` : transpose}</span>
                                <button onClick={() => handleTranspose(1)} className="btn btn-xs" title="Transpose naik (♯)">♯</button>
                                <button onClick={() => setTranspose(0)} className="btn btn-xs" title="Reset transpose">⟳</button>
                                {/* Metronome Controls */}
                                <span className="divider" />
                                {/* Dark/Light Mode Toggle */}
                                <button
                                    onClick={() => setDarkMode(d => !d)}
                                    className={`btn btn-xs ${darkMode ? 'btn-primary' : ''}`}
                                    title={darkMode ? 'Mode Terang' : 'Mode Gelap'}
                                    style={{ marginLeft: 4 }}
                                >
                                    {darkMode ? '🌙 Gelap' : '☀️ Terang'}
                                </button>
                                {/* ...existing code... */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <button
                                        onClick={() => setMetronomeActive(a => !a)}
                                        className={`btn btn-xs ${metronomeActive ? 'btn-primary' : ''}`}
                                        title={metronomeActive ? 'Stop Metronome' : 'Start Metronome'}
                                    >
                                        {metronomeActive ? '⏹' : '🕒'}
                                    </button>
                                    <input
                                        type="range"
                                        min="40"
                                        max="220"
                                        step="1"
                                        value={metronomeBpm}
                                        onChange={e => setMetronomeBpm(Number(e.target.value))}
                                        style={{ width: 60 }}
                                        title="Tempo (BPM)"
                                        disabled={!metronomeActive}
                                    />
                                    <span style={{ minWidth: 36, textAlign: 'center', fontWeight: 600 }} title="Tempo (BPM)">{metronomeBpm} BPM</span>
                                    <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: 6, marginLeft: 4, background: metronomeActive ? (metronomeTick ? '#f87171' : '#fbbf24') : '#ddd', transition: 'background 0.1s' }} />
                                </div>
                                {/* Auto Scroll Group */}
                                <button
                                    onClick={() => setAutoScrollActive(!autoScrollActive)}
                                    className={`btn btn-xs ${autoScrollActive ? 'btn-primary' : ''}`}
                                    title={autoScrollActive ? 'Matikan Auto Scroll' : 'Aktifkan Auto Scroll'}
                                >
                                    {autoScrollActive ? '⏸' : '▶'}
                                </button>
                                {autoScrollActive && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <button onClick={() => setScrollSpeed(Math.max(0.5, scrollSpeed - 0.5))} className="btn btn-xs" title="Kurangi kecepatan scroll">−</button>
                                        <input
                                            type="range"
                                            min="0.5"
                                            max="5"
                                            step="0.1"
                                            value={scrollSpeed}
                                            onChange={e => setScrollSpeed(Number(e.target.value))}
                                            style={{ width: 70, verticalAlign: 'middle' }}
                                            title="Geser untuk atur kecepatan scroll"
                                        />
                                        <span className="speed-value" style={{ minWidth: 32, textAlign: 'center', fontWeight: 600 }} title="Kecepatan scroll">{scrollSpeed.toFixed(1)}x</span>
                                        <button onClick={() => setScrollSpeed(Math.min(5, scrollSpeed + 0.5))} className="btn btn-xs" title="Tambah kecepatan scroll">+</button>
                                    </div>
                                )}
                                <span className="divider" />
                                {/* YouTube Toggle */}
                                <button
                                    onClick={() => setShowYouTube(!showYouTube)}
                                    className={`btn btn-xs ${showYouTube ? 'btn-primary' : ''}`}
                                    title={showYouTube ? 'Sembunyikan YouTube' : 'Tampilkan YouTube'}
                                >
                                    📺
                                </button>
                                {/* Print Button */}
                                <button
                                    onClick={() => window.print()}
                                    className="btn btn-xs"
                                    title="Cetak/Print (PDF)"
                                >
                                    🖨️
                                </button>
                                {/* Lyrics Mode Toggle */}
                                <button
                                    onClick={() => setLyricsMode(!lyricsMode)}
                                    className={`btn btn-xs ${lyricsMode ? 'btn-primary' : ''}`}
                                    title={lyricsMode ? 'Tampilkan Chord' : 'Mode Lirik Saja'}
                                >
                                    📝
                                </button>
                                {/* Performance Mode Toggle */}
                                <button
                                    onClick={togglePerformanceMode}
                                    className={`btn btn-xs ${performanceMode ? 'btn-primary' : ''}`}
                                    title={performanceMode ? 'Exit Performance Mode' : 'Enter Performance Mode'}
                                >
                                    🎭
                                </button>
                            </div>
                        )}
                        {!performanceMode && showYouTube && selectedSong?.youtubeId && (
                            <div className="youtube-section">
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                                    <label style={{ fontWeight: 500, cursor: 'pointer', userSelect: 'none' }}>
                                        <input
                                            type="checkbox"
                                            checked={youtubeSync}
                                            onChange={e => setYoutubeSync(e.target.checked)}
                                            style={{ marginRight: 6 }}
                                        />
                                        Sinkronisasi Auto-Scroll dengan YouTube
                                    </label>
                                </div>
                                <YouTubeViewer
                                    videoId={selectedSong.youtubeId}
                                    onTimeUpdate={(t, d) => { setCurrentVideoTime(t); setVideoDuration(d); }}
                                    seekToTime={viewerSeekTo}
                                />
                            </div>
                        )}
                        {/* Main content area with touch handlers for performance mode */}
                        <div
                            className="lyrics-section"
                            ref={el => {
                                scrollRef.current = el;
                                lyricsSectionRef.current = el;
                                if (performanceMode) perfMainRef.current = el;
                            }}
                            onTouchStart={performanceMode ? handleTouchStart : undefined}
                            onTouchMove={performanceMode ? handleTouchMove : undefined}
                            onTouchEnd={performanceMode ? handleTouchEnd : undefined}
                        >
                            {selectedSong ? (
                                <>
                                    {/* Tombol tambah ke setlist */}
                                    {!performanceMode && (
                                        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', justifyContent: 'flex-end' }}>
                                            <button
                                                onClick={() => {
                                                    // Tampilkan popup setlist
                                                    setShowSetListPopup(true);
                                                    setSelectedSetListsForAdd(
                                                        setLists.filter(sl => sl.songs.includes(selectedSong.id)).map(sl => sl.id)
                                                    );
                                                }}
                                                className="btn btn-sm btn-success"
                                                title="Tambah lagu ini ke setlist"
                                            >
                                                ➕ Tambah ke Setlist
                                            </button>
                                            <button
                                                onClick={() => handleEditSong(selectedSong)}
                                                className="btn btn-sm btn-primary"
                                                title="Edit lagu ini"
                                            >
                                                ✏️ Edit
                                            </button>
                                        </div>
                                    )}
                                    {!performanceMode && (Array.isArray(selectedSong.timestamps) && selectedSong.timestamps.length > 0) && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', gap: '0.5rem' }}>
                                            <strong style={{ color: 'var(--text)' }}>⏱️ Struktur Lagu</strong>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                                                {selectedSong.timestamps.map((ts, idx) => (
                                                    <button
                                                        key={idx}
                                                        className="btn btn-xs"
                                                        title={`Loncat ke ${ts.label}: ${Math.floor(ts.time / 60)}:${(ts.time % 60).toString().padStart(2, '0')}`}
                                                        onClick={() => {
                                                            if (selectedSong?.youtubeId) {
                                                                setShowYouTube(true);
                                                                setViewerSeekTo(Math.max(0, Number(ts.time) || 0));
                                                                setTimeout(() => setViewerSeekTo(null), 0);
                                                            }
                                                        }}
                                                    >
                                                        {ts.label} ({Math.floor(ts.time / 60)}:{(ts.time % 60).toString().padStart(2, '0')})
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                                        <label style={{ fontWeight: 500, cursor: 'pointer', userSelect: 'none' }}>
                                            <input
                                                type="checkbox"
                                                checked={highlightChords}
                                                onChange={e => setHighlightChords(e.target.checked)}
                                                style={{ marginRight: 6 }}
                                            />
                                            Highlight Chords
                                        </label>
                                    </div>
                                    <ChordDisplay
                                        song={selectedSong}
                                        transpose={transpose}
                                        performanceMode={performanceMode}
                                        performanceFontSize={performanceFontSize}
                                        performanceTheme={performanceTheme}
                                        lyricsMode={lyricsMode}
                                        keyboardMode={keyboardMode}
                                        // ...existing code...
                                        highlightChords={highlightChords}
                                    />
                                </>
                            ) : (
                                <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                                    <h3>Pilih lagu dari daftar untuk melihat chord dan lirik</h3>
                                </div>
                            )}
                        </div>
                        <AutoScroll
                            isActive={autoScrollActive}
                            speed={scrollSpeed}
                            scrollRef={scrollRef}
                        />

                        {/* Performance Mode Setlist Sidebar */}
                        {performanceMode && currentSetList && showSetlistView && (
                            <div className="performance-setlist-sidebar">
                                <div className="setlist-header">
                                    <div className="setlist-title">📋 Setlist</div>
                                    <button
                                        onClick={() => setShowSetlistView(false)}
                                        className="btn-toggle-setlist"
                                        title="Tutup setlist"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <div className="setlist-songs">
                                    {getSetListSongs().map((song, idx) => {
                                        const isActive = song.id === selectedSong?.id;
                                        const isCompleted = currentSetList && setLists.find(sl => sl.id === currentSetList)?.completedSongs?.[song.id];
                                        return (
                                            <div
                                                key={song.id}
                                                className={`setlist-song-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                                                onClick={() => setSelectedSong(song)}
                                            >
                                                <div className="song-number">{idx + 1}</div>
                                                <div className="song-info">
                                                    <div className="song-title-small">{song.title}</div>
                                                    <div className="song-artist-small">{song.artist}</div>
                                                </div>
                                                {isCompleted && <div className="completed-check">✓</div>}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Performance Mode Footer Controls */}
                        {performanceMode && selectedSong && (
                            <div className="performance-footer">
                                <button
                                    onClick={() => {
                                        if (document.fullscreenElement) {
                                            exitFullscreen();
                                        } else if (perfMainRef.current) {
                                            enterFullscreen(perfMainRef.current);
                                        }
                                    }}
                                    className="perf-btn"
                                    title="Toggle Fullscreen (F11)"
                                    style={{ fontSize: 18, marginRight: 8 }}
                                >
                                    {document.fullscreenElement ? '🗗' : '🗖'}
                                </button>
                                <div className="performance-info">
                                    <div className="performance-song-title">{selectedSong.title}</div>
                                    <div>{selectedSong.artist}</div>
                                    {/* Metronome Controls (Performance Mode) */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginRight: 12 }}>
                                        <button
                                            onClick={() => setMetronomeActive(a => !a)}
                                            className={`perf-btn ${metronomeActive ? 'perf-btn-success' : ''}`}
                                            title={metronomeActive ? 'Stop Metronome' : 'Start Metronome'}
                                        >
                                            {metronomeActive ? '⏹' : '🕒'}
                                        </button>
                                        <input
                                            type="range"
                                            min="40"
                                            max="220"
                                            step="1"
                                            value={metronomeBpm}
                                            onChange={e => setMetronomeBpm(Number(e.target.value))}
                                            style={{ width: 70 }}
                                            title="Tempo (BPM)"
                                            disabled={!metronomeActive}
                                        />
                                        <span style={{ minWidth: 36, textAlign: 'center', fontWeight: 600 }} title="Tempo (BPM)">{metronomeBpm} BPM</span>
                                        <span style={{ display: 'inline-block', width: 14, height: 14, borderRadius: 7, marginLeft: 4, background: metronomeActive ? (metronomeTick ? '#f87171' : '#fbbf24') : '#ddd', transition: 'background 0.1s' }} />
                                    </div>
                                    {/* ...existing code... */}
                                    {currentSetList && (
                                        <div>
                                            Song {getCurrentSongIndexInSetList() + 1} of {getSetListSongs().length}
                                        </div>
                                    )}
                                </div>

                                <div className="performance-controls">
                                    {currentSetList && (
                                        <>
                                            <button onClick={navigateToPrevSongInSetList} className="perf-btn">
                                                ⏮ Prev
                                            </button>
                                            <button onClick={navigateToNextSongInSetList} className="perf-btn">
                                                Next ⏭
                                            </button>
                                            <span style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.2)' }} />
                                        </>
                                    )}

                                    <button onClick={() => handleTranspose(-1)} className="perf-btn">
                                        ♭
                                    </button>
                                    <span style={{ color: '#fbbf24', fontWeight: '600', minWidth: '40px', textAlign: 'center' }}>
                                        {transpose > 0 ? `+${transpose}` : transpose}
                                    </span>
                                    <button onClick={() => handleTranspose(1)} className="perf-btn">
                                        ♯
                                    </button>
                                    <button onClick={() => setTranspose(0)} className="perf-btn">
                                        ⟳
                                    </button>

                                    <span style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.2)' }} />

                                    <button
                                        onClick={() => setAutoScrollActive(!autoScrollActive)}
                                        className={`perf-btn ${autoScrollActive ? 'perf-btn-success' : ''}`}
                                    >
                                        {autoScrollActive ? '⏸ Pause' : '▶ Scroll'}
                                    </button>
                                    {autoScrollActive && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <button onClick={() => setScrollSpeed(Math.max(0.5, scrollSpeed - 0.5))} className="perf-btn">−</button>
                                            <input
                                                type="range"
                                                min="0.5"
                                                max="5"
                                                step="0.1"
                                                value={scrollSpeed}
                                                onChange={e => setScrollSpeed(Number(e.target.value))}
                                                style={{ width: 90, verticalAlign: 'middle' }}
                                                title="Geser untuk atur kecepatan scroll"
                                            />
                                            <span style={{ color: '#60a5fa', fontWeight: '600', minWidth: '45px', textAlign: 'center' }}>
                                                {scrollSpeed.toFixed(1)}x
                                            </span>
                                            <button onClick={() => setScrollSpeed(Math.min(5, scrollSpeed + 0.5))} className="perf-btn">+</button>
                                        </div>
                                    )}

                                    <span style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.2)' }} />

                                    {currentSetList && (
                                        <button
                                            onClick={() => setShowSetlistView(!showSetlistView)}
                                            className={`perf-btn ${showSetlistView ? 'perf-btn-success' : ''}`}
                                            title={showSetlistView ? 'Tutup setlist' : 'Buka setlist'}
                                        >
                                            📋
                                        </button>
                                    )}

                                    <button
                                        onClick={() => {
                                            const themes = ['dark-stage', 'bright', 'amber', 'high-contrast'];
                                            const currentIdx = themes.indexOf(performanceTheme);
                                            setPerformanceTheme(themes[(currentIdx + 1) % themes.length]);
                                        }}
                                        className="perf-btn"
                                        title="Ganti theme"
                                    >
                                        🎨
                                    </button>

                                    <button onClick={() => {
                                        const newSize = Math.max(50, performanceFontSize - 10);
                                        setPerformanceFontSize(newSize);
                                    }} className="perf-btn">
                                        A−
                                    </button>
                                    <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', fontWeight: 'bold', minWidth: '45px', textAlign: 'center' }}>
                                        {performanceFontSize}%
                                    </span>
                                    <button onClick={() => {
                                        const newSize = Math.min(150, performanceFontSize + 10);
                                        setPerformanceFontSize(newSize);
                                    }} className="perf-btn">
                                        A+
                                    </button>

                                    <span style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.2)' }} />

                                    <button onClick={togglePerformanceMode} className="perf-btn perf-btn-danger perf-btn-large">
                                        ✕ Exit
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                </main>

            </div>
        </div>
    );
}
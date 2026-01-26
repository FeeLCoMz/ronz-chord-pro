import React, { useState, useRef } from 'react';

import SongList from './SongList.jsx';

function SetlistSection({
  setlists,
  viewingSetlist,
  setViewingSetlist,
  songs,
  showCreateSetlist,
  setShowCreateSetlist,
  createSetlistName,
  setCreateSetlistName,
  createSetlistError,
  setCreateSetlistError,
  loadingSetlists,
  errorSetlists,
  showAddSongToSetlist,
  setShowAddSongToSetlist,
  addSongError,
  setAddSongError,
  addSongSearch,
  setAddSongSearch,
  addSongSelectedId,
  setAddSongSelectedId,
  addSongInputRef,
  filteredAvailableSongs,
  setSetlists
}) {
  return (
    <>
      <div className="section-title">Setlist</div>
      {viewingSetlist ? (
        <>
          <button className="back-btn" onClick={() => setViewingSetlist(null)}>&larr; Kembali ke daftar setlist</button>
          <div className="section-title">{viewingSetlist.name}</div>
          <button
            className="tab-btn"
            style={{ marginBottom: 18 }}
            onClick={() => setShowAddSongToSetlist(true)}
          >
            + Tambah Lagu ke Setlist
          </button>
          <div className="info-text" style={{ marginTop: -12, marginBottom: 16, fontSize: '1.05em' }}>
            Jumlah lagu: {
              (viewingSetlist.songs || [])
                .map(id => songs.find(song => song.id === id))
                .filter(Boolean).length
            }
          </div>
          <SongList
            songs={
              (viewingSetlist.songs || [])
                .map(id => songs.find(song => song.id === id))
                .filter(Boolean)
            }
            onSongClick={song => {
              const idx = (viewingSetlist.songs || []).findIndex(id => id === song.id);
              setActiveSetlist(viewingSetlist);
              setActiveSetlistSongIdx(idx >= 0 ? idx : 0);
            }}
            emptyText="Setlist ini belum berisi lagu."
            enableSearch={true}
            showNumber={true}
            setlistSongKeys={
              (viewingSetlist.songs || []).map((id, idx) => {
                const songObj = songs.find(song => song.id === id);
                if (!songObj) return null;
                if (viewingSetlist.songKeys && Array.isArray(viewingSetlist.songKeys)) {
                  const keyOverride = viewingSetlist.songKeys[idx];
                  if (keyOverride && typeof keyOverride === 'string' && keyOverride !== songObj.key) {
                    return { id, key: keyOverride };
                  }
                }
                return { id, key: null };
              })
            }
          />
          {/* Modal Tambah Lagu ke Setlist */}
          {showAddSongToSetlist && (
            <div className="modal-overlay" style={{ position: 'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.35)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center' }} onClick={() => setShowAddSongToSetlist(false)}>
              <div className="modal-content" style={{ background:'#222', color:'#fff', borderRadius:10, padding:28, minWidth:320, maxWidth:400, boxShadow:'0 4px 32px #0008', position:'relative' }} onClick={e => e.stopPropagation()}>
                {addSongError && (
                  <div style={{ color:'#ff6b6b', marginBottom:10, fontSize:'0.98em' }}>{addSongError}</div>
                )}
                <h3 style={{marginTop:0, marginBottom:16}}>Tambah Lagu ke Setlist</h3>
                <input
                  ref={addSongInputRef}
                  type="text"
                  placeholder="Cari judul atau artist..."
                  value={addSongSearch}
                  onChange={e => { setAddSongSearch(e.target.value); setAddSongSelectedId(null); setAddSongError(''); }}
                  className="search-input"
                  style={{ width:'100%', marginBottom:12 }}
                  autoFocus
                />
                <div style={{ maxHeight:180, overflowY:'auto', marginBottom:16 }}>
                  {filteredAvailableSongs.length === 0 && (
                    <div className="info-text">Tidak ada lagu tersedia.</div>
                  )}
                  <ul style={{listStyle:'none', padding:0, margin:0}}>
                    {filteredAvailableSongs.map(song => (
                      <li
                        key={song.id}
                        style={{ padding:'8px 0', borderBottom:'1px solid #333', cursor:'pointer', background: addSongSelectedId === song.id ? '#444' : 'transparent' }}
                        onClick={() => { setAddSongSelectedId(song.id); setAddSongError(''); }}
                      >
                        <div style={{ fontWeight:700 }}>{song.title}</div>
                        <div style={{ fontSize:'0.97em', color:'#aaa' }}>{song.artist}</div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div style={{ display:'flex', justifyContent:'flex-end', gap:10 }}>
                  <button className="tab-btn" onClick={() => { setShowAddSongToSetlist(false); setAddSongError(''); }}>Batal</button>
                  <button
                    className="tab-btn"
                    style={{ background:'#4f8cff', color:'#fff', fontWeight:600, opacity: addSongSelectedId ? 1 : 0.5, pointerEvents: addSongSelectedId ? 'auto' : 'none' }}
                    onClick={async () => {
                      setAddSongError('');
                      if (!addSongSelectedId || !viewingSetlist) return;
                      if ((viewingSetlist.songs || []).includes(addSongSelectedId)) {
                        setAddSongError('Lagu sudah ada di setlist.');
                        return;
                      }
                      const newSongs = [...(viewingSetlist.songs || []), addSongSelectedId];
                      try {
                        const res = await fetch(`/api/setlists/${viewingSetlist.id}`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ songs: newSongs })
                        });
                        if (!res.ok) throw new Error('Gagal menambah lagu ke setlist');
                        // Refresh setlist di state
                        const updatedSetlist = { ...viewingSetlist, songs: newSongs };
                        setViewingSetlist(updatedSetlist);
                        setSetlists(prev => prev.map(s => s.id === updatedSetlist.id ? updatedSetlist : s));
                        setShowAddSongToSetlist(false);
                        setAddSongSearch('');
                        setAddSongSelectedId(null);
                        setAddSongError('');
                      } catch (err) {
                        setAddSongError(err.message || 'Gagal menambah lagu ke setlist');
                      }
                    }}
                  >Tambah</button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <button
            className="tab-btn"
            style={{ marginBottom: 18 }}
            onClick={() => setShowCreateSetlist(true)}
          >
            + Buat Setlist Baru
          </button>
          {/* Modal Buat Setlist Baru */}
          {showCreateSetlist && (
            <div className="modal-overlay" style={{ position: 'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.35)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center' }} onClick={() => setShowCreateSetlist(false)}>
              <div className="modal-content" style={{ background:'#222', color:'#fff', borderRadius:10, padding:28, minWidth:320, maxWidth:400, boxShadow:'0 4px 32px #0008', position:'relative' }} onClick={e => e.stopPropagation()}>
                <h3 style={{marginTop:0, marginBottom:16}}>Buat Setlist Baru</h3>
                <input
                  type="text"
                  placeholder="Nama setlist..."
                  value={createSetlistName}
                  onChange={e => { setCreateSetlistName(e.target.value); setCreateSetlistError(''); }}
                  className="search-input"
                  style={{ width:'100%', marginBottom:12 }}
                  autoFocus
                />
                {createSetlistError && (
                  <div style={{ color:'#ff6b6b', marginBottom:10, fontSize:'0.98em' }}>{createSetlistError}</div>
                )}
                <div style={{ display:'flex', justifyContent:'flex-end', gap:10 }}>
                  <button className="tab-btn" onClick={() => setShowCreateSetlist(false)}>Batal</button>
                  <button
                    className="tab-btn"
                    style={{ background:'#4f8cff', color:'#fff', fontWeight:600, opacity: createSetlistName.trim() ? 1 : 0.5, pointerEvents: createSetlistName.trim() ? 'auto' : 'none' }}
                    onClick={async () => {
                      setCreateSetlistError('');
                      if (!createSetlistName.trim()) {
                        setCreateSetlistError('Nama setlist wajib diisi.');
                        return;
                      }
                      try {
                        const res = await fetch('/api/setlists', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ name: createSetlistName.trim() })
                        });
                        if (!res.ok) throw new Error('Gagal membuat setlist');
                        const data = await res.json();
                        setSetlists(prev => [...prev, data]);
                        setShowCreateSetlist(false);
                        setCreateSetlistName('');
                        setCreateSetlistError('');
                      } catch (err) {
                        setCreateSetlistError(err.message || 'Gagal membuat setlist');
                      }
                    }}
                  >Buat</button>
                </div>
              </div>
            </div>
          )}
          {loadingSetlists && <div className="info-text">Memuat setlist...</div>}
          {errorSetlists && <div className="error-text">{errorSetlists}</div>}
          <ul className="setlist-list">
            {!loadingSetlists && !errorSetlists && setlists.length === 0 && (
              <li className="info-text">Belum ada setlist.</li>
            )}
            {setlists.map(setlist => (
              <li key={setlist.id} className="setlist-list-item" style={{ cursor: 'pointer' }} onClick={() => setViewingSetlist(setlist)}>
                <span className="setlist-title">{setlist.name}</span>
                <span className="setlist-count">{(setlist.songs?.length || 0)} lagu</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}

export default SetlistSection;

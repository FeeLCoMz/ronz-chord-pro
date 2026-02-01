
import React from 'react';
import SongList from '../components/SongList.jsx';
import PlusIcon from '../components/PlusIcon.jsx';

export default function SongListPage({ songs, loading, error, search, setSearch, onSongClick }) {
  return (
    <>
      <div className="section-title">Lagu</div>
      <div className="info-text">
        {songs.length} Lagu
      </div>
      <button className="btn-base tab-btn add-song-btn" onClick={() => onSongClick('add')} title="Tambah Lagu" aria-label="Tambah Lagu">
        <PlusIcon size={22} />
      </button>
      {loading && <div className="info-text">Memuat daftar lagu...</div>}
      {error && <div className="error-text">{error}</div>}
      <SongList
        songs={songs}
        onSongClick={onSongClick}
        emptyText="Tidak ada lagu ditemukan."
        enableSearch={true}
        searchQuery={search}
      />
    </>
  );
}

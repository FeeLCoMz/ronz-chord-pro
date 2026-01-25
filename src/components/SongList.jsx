
import React, { useState } from 'react';


function SongList({ songs, onSongClick, emptyText = 'Tidak ada lagu ditemukan.', enableSearch = false }) {
  const [search, setSearch] = useState('');
  const filteredSongs = enableSearch
    ? (songs || []).filter(song =>
        (song.title || '').toLowerCase().includes(search.toLowerCase()) ||
        (song.artist || '').toLowerCase().includes(search.toLowerCase())
      )
    : songs;

  if (!filteredSongs || filteredSongs.length === 0) {
    return (
      <>
        {enableSearch && (
          <input
            type="text"
            placeholder="Cari judul atau artist..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-input"
            style={{ marginBottom: 18 }}
          />
        )}
        <ul className="song-list"><li className="info-text">{emptyText}</li></ul>
      </>
    );
  }
  return (
    <>
      {enableSearch && (
        <input
          type="text"
          placeholder="Cari judul atau artist..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
          style={{ marginBottom: 18 }}
        />
      )}
      <ul className="song-list">
        {filteredSongs.map(song => (
          <li
            key={song.id}
            className="song-list-item"
            onClick={() => onSongClick && onSongClick(song)}
            style={{ cursor: 'pointer' }}
          >
            <span className="song-title">{song.title}</span>
            <span className="song-artist">{song.artist}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

export default SongList;

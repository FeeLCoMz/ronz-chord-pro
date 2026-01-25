import React from 'react';

function SongList({ songs, onSongClick, emptyText = 'Tidak ada lagu ditemukan.' }) {
  if (!songs || songs.length === 0) {
    return <ul className="song-list"><li className="info-text">{emptyText}</li></ul>;
  }
  return (
    <ul className="song-list">
      {songs.map(song => (
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
  );
}

export default SongList;

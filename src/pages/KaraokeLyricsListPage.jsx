import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function KaraokeLyricsListPage({ songs }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const filtered = songs.filter(song =>
    song.title?.toLowerCase().includes(query.toLowerCase()) ||
    song.artist?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🎤 Daftar Lirik Lagu Karaoke</h1>
        <p>{filtered.length} dari {songs.length} lagu</p>
        <input
          type="text"
          placeholder="Cari judul atau artis..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="search-input-main"
          style={{ width: 320, marginTop: 12 }}
        />
      </div>
      <div className="karaoke-list-container">
        {filtered.length === 0 ? (
          <div className="empty-state">Tidak ada lagu ditemukan</div>
        ) : (
          <ul className="karaoke-lyrics-list">
            {filtered.map(song => (
              <li
                key={song.id}
                className="karaoke-lyrics-list-item"
                onClick={() => navigate(`/karaoke/${song.id}`)}
                style={{ cursor: 'pointer', padding: '16px', borderBottom: '1px solid #eee' }}
              >
                <b>{song.title}</b> <span style={{ color: '#888' }}>({song.artist})</span>
                {song.genre && <span style={{ marginLeft: 12, color: '#aaa' }}>{song.genre}</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

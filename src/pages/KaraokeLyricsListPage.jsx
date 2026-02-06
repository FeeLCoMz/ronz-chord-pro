import React, { useState, useEffect } from 'react';
import { addSong, fetchSongs } from '../apiClient.js';
import { useNavigate } from 'react-router-dom';

// Modal sederhana untuk tambah lagu
function AddLyricsModal({ open, onClose, onAdd }) {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [lyrics, setLyrics] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (!title.trim() || !artist.trim() || !lyrics.trim()) return;
    onAdd({ title, artist, lyrics });
    setTitle(''); setArtist(''); setLyrics('');
    onClose();
  };

  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Tambah Lirik Lagu</h2>
        <form onSubmit={handleSubmit}>
          <input className="modal-input" placeholder="Judul Lagu" value={title} onChange={e => setTitle(e.target.value)} required />
          <input className="modal-input" placeholder="Artist" value={artist} onChange={e => setArtist(e.target.value)} required />
          <textarea className="modal-input" placeholder="Lirik Lagu" value={lyrics} onChange={e => setLyrics(e.target.value)} rows={6} required />
          <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
            <button type="submit" className="btn btn-primary">Simpan</button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Batal</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function KaraokeLyricsListPage({ songs }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [localSongs, setLocalSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchSongs()
      .then(data => { if (mounted) setLocalSongs(data); })
      .catch(err => { if (mounted) setError(err.message || 'Gagal memuat lagu'); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const filtered = localSongs.filter(song =>
    song.title?.toLowerCase().includes(query.toLowerCase()) ||
    song.artist?.toLowerCase().includes(query.toLowerCase())
  );

  const handleAddSong = async ({ title, artist, lyrics }) => {
    try {
      const res = await addSong({ title, artist, lyrics });
      setLocalSongs(prev => [
        ...prev,
        { id: res.id, title, artist, lyrics }
      ]);
    } catch (err) {
      alert('Gagal menambah lagu: ' + (err.message || err));
    }
  };

  return (
    <div className="page-container">
      <AddLyricsModal open={showAdd} onClose={() => setShowAdd(false)} onAdd={handleAddSong} />
      <div className="page-header">
        <h1>🎤 Daftar Lirik Lagu Karaoke</h1>
        {loading ? (
          <p>Memuat lagu...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          <p>{filtered.length} dari {localSongs.length} lagu</p>
        )}
        <input
          type="text"
          placeholder="Cari judul atau artis..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="search-input-main"
          style={{ width: 320, marginTop: 12 }}
          disabled={loading}
        />
        <button className="btn btn-primary" style={{ marginLeft: 16, marginTop: 12 }} onClick={() => setShowAdd(true)} disabled={loading}>
          + Tambah Lirik Lagu
        </button>
      </div>
      <div className="karaoke-list-container">
        {loading ? (
          <div className="empty-state">Memuat...</div>
        ) : error ? (
          <div className="empty-state" style={{ color: 'red' }}>{error}</div>
        ) : filtered.length === 0 ? (
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

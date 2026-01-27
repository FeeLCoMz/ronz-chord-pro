import React from 'react';
import ChordDisplay from '../components/ChordDisplay.jsx';
import YouTubeViewer from '../components/YouTubeViewer.jsx';
import TransposeBar from '../components/TransposeBar.jsx';
import AutoScrollBar from '../components/AutoScrollBar.jsx';
import { useNavigate } from 'react-router-dom';

export default function SongLyricsPage({ song }) {
  const navigate = useNavigate();
  const [transpose, setTranspose] = React.useState(0);
  const [highlightChords, setHighlightChords] = React.useState(false);
  // Untuk autoscroll, gunakan tempo default dari song.tempo jika ada
  if (!song) return <div className="main-content error-text">Lagu tidak ditemukan</div>;
  return (
    <div className="song-detail-container">
      <div className="song-detail-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button className="back-btn" onClick={() => navigate(-1)}>&larr; Kembali</button>
        <div className="song-detail-title">{song.title}</div>
        <button
          className="tab-btn setlist-edit-btn"
          style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 15, padding: '4px 10px' }}
          title="Edit Lagu"
          onClick={() => navigate(`/songs/${song.id}/edit`)}
        >
          <EditIcon size={16} />
          <span>Edit</span>
        </button>
      </div>
      <div className="song-detail-info">
        {song.artist && <span><b>Artis:</b> {song.artist}</span>}
        {song.album && <span><b>Album:</b> {song.album}</span>}
      </div>
      {song.youtubeId && (
        <div className="song-detail-youtube">
          <YouTubeViewer
            videoId={song.youtubeId}
            ref={ytRef => { window._ytRef = ytRef; }}
            onTimeUpdate={(t, d) => { window._ytCurrentTime = t; }}
          />
        </div>
      )}
      <div className="song-detail-controls">
        <TransposeBar
          transpose={transpose}
          setTranspose={setTranspose}
          highlightChords={highlightChords}
          setHighlightChords={setHighlightChords}
        />
        <AutoScrollBar tempo={song.tempo ? Number(song.tempo) : 80} />
      </div>
      <div className="song-detail-chord">
        <ChordDisplay song={song} transpose={transpose} highlightChords={highlightChords} />
      </div>
    </div>
  );
}

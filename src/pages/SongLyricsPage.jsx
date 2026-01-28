import React from 'react';
import EditIcon from '../components/EditIcon.jsx';
import ChordDisplay from '../components/ChordDisplay.jsx';
import YouTubeViewer from '../components/YouTubeViewer.jsx';
import TransposeBar from '../components/TransposeBar.jsx';
import AutoScrollBar from '../components/AutoScrollBar.jsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { parseChordPro } from '../utils/chordUtils.js';

export default function SongLyricsPage({ song, activeSetlist }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [transpose, setTranspose] = React.useState(0);
  const [highlightChords, setHighlightChords] = React.useState(false);
  // Parse metadata dari lirik jika ada
  let lyricMeta = {};
  if (song && song.lyrics) {
    try {
      lyricMeta = parseChordPro(song.lyrics).metadata || {};
    } catch {}
  }
  if (!song) return <div className="main-content error-text">Lagu tidak ditemukan</div>;
  // Gabungkan metadata dari song dan dari lirik
  const infoRows = [
    { label: 'Album', value: song.album },
    { label: 'Key', value: lyricMeta.key || song.key },
    { label: 'Tempo', value: lyricMeta.tempo || song.tempo },
    { label: 'Style', value: song.style },
    { label: 'Capo', value: lyricMeta.capo },
    { label: 'Time Signature', value: lyricMeta.time_signature || song.time_signature },
    { label: 'Original Key', value: lyricMeta.original_key },
  ].filter(row => row.value);
  // Metadata lain di lirik (selain yang sudah di atas)
  const extraMeta = Object.entries(lyricMeta)
    .filter(([k]) => !['key','tempo','capo','time','original_key'].includes(k))
    .map(([k,v]) => ({ label: k.replace(/_/g,' ').replace(/\b\w/g, l => l.toUpperCase()), value: v }));
  // Navigasi antar lagu jika activeSetlist tersedia
  let navPrev = null, navNext = null;
  if (activeSetlist && activeSetlist.songs && song && song.id) {
    const idx = activeSetlist.songs.findIndex(id => String(id) === String(song.id));
    if (idx > 0) navPrev = activeSetlist.songs[idx - 1];
    if (idx < activeSetlist.songs.length - 1) navNext = activeSetlist.songs[idx + 1];
  }
  return (
    <div className="song-detail-container">
      {/* Header: Back, Title, Edit */}
      <div className="song-detail-header">
           <button className="back-btn" onClick={() => {
             if (activeSetlist) {
               navigate(`/setlists/${activeSetlist.id}/songs`);
             } else {
               navigate(location.state?.from || '/');
             }
           }}>
             &larr; Kembali
           </button>        
        {activeSetlist && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 8, justifyContent: 'center' }}>
            <button
              className="tab-btn icon-btn"
              disabled={!navPrev}
              title="Lagu Sebelumnya"
              onClick={() => navPrev && navigate(`/songs/${navPrev}`)}
            >
              &#8592;
            </button>
            <button
              className="tab-btn icon-btn"
              disabled={!navNext}
              title="Lagu Berikutnya"
              onClick={() => navNext && navigate(`/songs/${navNext}`)}
            >
              &#8594;
            </button>
          </div>
        )}

        <div style={{flex: 1}}>
          <div className="song-detail-title">{song.title}</div>
          {song.artist && (
            <div className="song-artist" style={{textAlign: 'center', marginTop: 2}}>{song.artist}</div>
          )}
        </div>
        <button
          className="tab-btn setlist-edit-btn icon-btn"
          title="Edit Lagu"
          onClick={() => navigate(`/songs/${song.id}/edit`)}
        >
          <EditIcon size={16} />
        </button>
      </div>


      {/* Info lagu dan metadata */}
      <div className="song-detail-info" style={{ marginBottom: 18, flexDirection: 'column', alignItems: 'flex-start', display: 'flex', gap: 4 }}>
        {infoRows.map(row => (
          <span key={row.label}><b>{row.label}:</b> {row.value}</span>
        ))}

        {song.instruments && song.instruments.length > 0 && (
          <span><b>Instrumen:</b> {Array.isArray(song.instruments) ? song.instruments.join(', ') : song.instruments}</span>
        )}
        {extraMeta.length > 0 && (
          <div style={{ marginTop: 6, fontSize: '0.97em', color: '#64748b' }}>
            {extraMeta.map(row => (
              <div key={row.label}><b>{row.label}:</b> {row.value}</div>
            ))}
          </div>
        )}
      </div>

      {/* YouTube viewer */}
      {song.youtubeId && (
        <div className="song-detail-youtube" style={{ marginBottom: 18 }}>
          <YouTubeViewer
            videoId={song.youtubeId}
            songId={song.id}
            ref={ytRef => { window._ytRef = ytRef; }}
            onTimeUpdate={(t, d) => { window._ytCurrentTime = t; }}
          />
        </div>
      )}

      {/* Kontrol lagu: transpose & autoscroll */}
      <div className="song-detail-controls">
        <div className="song-control-group">
          <label className="song-control-label">Transpose</label>
          <TransposeBar
            transpose={transpose}
            setTranspose={setTranspose}
            highlightChords={highlightChords}
            setHighlightChords={setHighlightChords}
          />
        </div>
        <div className="song-control-group">
          <label className="song-control-label">Auto Scroll</label>
          <AutoScrollBar tempo={song.tempo ? Number(song.tempo) : 80} />
        </div>
      </div>

      {/* Chord/lyrics */}
      <div className="song-detail-chord">
        <ChordDisplay song={song} transpose={transpose} highlightChords={highlightChords} />
      </div>
    </div>
  );
}

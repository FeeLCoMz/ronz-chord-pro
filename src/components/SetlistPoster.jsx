
import React from 'react';
import '../styles/setlist-poster.css';


export default function SetlistPoster({ setlist, setlistSongs, posterRef }) {  
  const SONGS_PER_COLUMN = 10;
  const posterKicker = 'LIVE PERFORMANCE SETLIST';
  const posterTitle = setlist?.bandName || 'Band';
  const posterSubtitle = setlist?.name || 'Setlist';
  
  const totalSongs = (setlistSongs || []).length;
  const useTwoColumns = totalSongs > SONGS_PER_COLUMN;

  let firstCol = setlistSongs || [];
  let secondCol = [];
  if (useTwoColumns) {
    const colCount = Math.ceil(totalSongs / 2);
    firstCol = (setlistSongs || []).slice(0, colCount);
    secondCol = (setlistSongs || []).slice(colCount);
  }

  return (
    <div className="setlist-poster-preview-wrapper">
      <div className="setlist-poster" ref={posterRef}>
        <div className="setlist-poster-header">
          <div className="setlist-poster-kicker">{posterKicker}</div>
          <div className="setlist-poster-title">{posterTitle}</div>
          <div className="setlist-poster-subtitle">{posterSubtitle}</div>
          <div className="setlist-poster-divider" />
        </div>
            {/* Tanggal & Venue */}
            {setlist?.date && (
              <div style={{ fontSize: '1.1rem', color: '#fbbf24', fontWeight: 700, marginBottom: 4 }}>
                {new Date(setlist.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                {setlist?.venue && (
                  <span style={{ color: '#a5b4fc', fontWeight: 600, marginLeft: 8 }}>
                    | {setlist.venue}
                  </span>
                )}
              </div>
            )}
            {/* Tagline / Deskripsi Singkat */}
            {setlist?.tagline && (
              <div style={{ fontSize: '1.05rem', color: '#fbbf24', fontWeight: 600, marginBottom: 6, fontStyle: 'italic' }}>
                {setlist.tagline}
              </div>
            )}
            {!setlist?.tagline && setlist?.notes && (
              <div style={{ fontSize: '1.05rem', color: '#fbbf24', fontWeight: 600, marginBottom: 6, fontStyle: 'italic' }}>
                {setlist.notes}
              </div>
            )}
        <div className={`setlist-poster-list${useTwoColumns ? ' two-columns' : ''}`}
          style={useTwoColumns ? { display: 'flex', flexDirection: 'row', columnGap: 24 } : {}}>
          {useTwoColumns ? (
            <>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {firstCol.map((song, idx) => (
                  <div className="setlist-poster-item" key={`${song.id}-col1-${idx}`}>
                    <div className="setlist-poster-index">{idx + 1}</div>
                    <div className="setlist-poster-info">
                      <div className="setlist-poster-song">{song.title}</div>
                      <div className="setlist-poster-artist">{song.artist || '—'}</div>
                    </div>
                    <div className="setlist-poster-extra">
                      {song.key && <span className="setlist-poster-tag">{song.key}</span>}
                      {song.tempo && (
                        <span className="setlist-poster-tag" style={{ marginLeft: song.key ? 6 : 0 }}>{song.tempo} BPM</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {secondCol.map((song, idx) => (
                  <div className="setlist-poster-item" key={`${song.id}-col2-${idx}`}>
                    <div className="setlist-poster-index">{idx + firstCol.length + 1}</div>
                    <div className="setlist-poster-info">
                      <div className="setlist-poster-song">{song.title}</div>
                      <div className="setlist-poster-artist">{song.artist || '—'}</div>
                    </div>
                    <div className="setlist-poster-extra">
                      {song.key && <span className="setlist-poster-tag">{song.key}</span>}
                      {song.tempo && (
                        <span className="setlist-poster-tag" style={{ marginLeft: song.key ? 6 : 0 }}>{song.tempo} BPM</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            (setlistSongs || []).map((song, idx) => (
              <div className="setlist-poster-item" key={`${song.id}-${idx}`}>
                <div className="setlist-poster-index">{idx + 1}</div>
                <div className="setlist-poster-info">
                  <div className="setlist-poster-song">{song.title}</div>
                  <div className="setlist-poster-artist">{song.artist || '—'}</div>
                </div>
                <div className="setlist-poster-extra">
                  {song.key && <span className="setlist-poster-tag">{song.key}</span>}
                  {song.tempo && (
                    <span className="setlist-poster-tag" style={{ marginLeft: song.key ? 6 : 0 }}>{song.tempo} BPM</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        <div className="setlist-poster-footer">
          <div className="setlist-poster-brand">Ruang Performer</div>
        </div>
      </div>
    </div>
  );
}

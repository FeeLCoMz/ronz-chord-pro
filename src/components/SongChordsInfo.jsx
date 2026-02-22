import React from "react";
import TransposeKeyControl from "./TransposeKeyControl.jsx";
import ExpandButton from "./ExpandButton.jsx";

/**
 * SongChordsInfo
 * Komponen info lagu (key, tempo, genre, aransemen, patch, dsb)
 */
// originalKey: key from database (song)
// targetKey: key from setlist (if any)
export default function SongChordsInfo({
  originalKey, // from song DB
  targetKey,   // from setlist (can be undefined)
  transpose,
  setTranspose,
  timeSignature,
  tempo,
  scrollSpeed,
  setScrollSpeed,
  isMetronomeActive,
  setIsMetronomeActive,
  genre,
  arrangementStyle,
  keyboardPatch,
  showSongInfo,
  setShowSongInfo,
  title,
  artist,
  contributor,
  performanceMode
}) {
  return (
    <div className="song-panel">
      <div className="song-info-compact-header">
        <ExpandButton
          isExpanded={showSongInfo}
          setIsExpanded={setShowSongInfo}
          icon="📋"
          label="Info Lagu"
          ariaLabel={showSongInfo ? 'Sembunyikan info lagu' : 'Tampilkan info lagu'}
        />
      </div>
      {showSongInfo && (
        <div className="song-info-compact-grid">
          {/* Judul, artis, kontributor */}
          {title && (
            <div className="song-info-item song-info-title">
              <span className="song-info-label">Judul</span>
              <span className="song-info-value song-info-title-value">{title}</span>
            </div>
          )}
          {artist && (
            <div className="song-info-item song-info-artist">
              <span className="song-info-label">Artis</span>
              <span className="song-info-value song-info-artist-value">{artist}</span>
            </div>
          )}
          {!performanceMode && contributor && (
            <div className="song-info-item song-info-contributor">
              <span className="song-info-label">Kontributor</span>
              <span className="song-info-value song-info-contributor-value">{contributor}</span>
            </div>
          )}
          {(originalKey || targetKey) && (
            <div className="song-info-item song-info-priority song-info-key">
              <span className="song-info-label">🎹 Key</span>
              <TransposeKeyControl
                originalKey={originalKey}
                targetKey={targetKey}
                transpose={transpose}
                onTransposeChange={setTranspose}
              />
            </div>
           )}
          {timeSignature && (
            <div className="song-info-item">
              <span className="song-info-label">🎼 Time</span>
              <span className="song-info-value">{timeSignature}</span>
            </div>
          )}
          {tempo && (
            <div className="song-info-item song-info-tempo">
              <span className="song-info-label">⏱️ Tempo</span>
              <div className="song-info-tempo-controls">
                <button
                  onClick={() => setScrollSpeed(Math.max(40, scrollSpeed - 5))}
                  className="btn btn-secondary"
                  title="Tempo down"
                  aria-label="Tempo down"
                >
                  −
                </button>
                <div className="song-info-tempo-display">
                  <span className="song-info-value">{scrollSpeed}</span>
                  <span className="song-info-tempo-unit">BPM</span>
                </div>
                <button
                  onClick={() => setScrollSpeed(Math.min(240, scrollSpeed + 5))}
                  className="btn btn-secondary"
                  title="Tempo up"
                  aria-label="Tempo up"
                >
                  +
                </button>
                <button
                  onClick={() => setIsMetronomeActive(!isMetronomeActive)}
                  className={`btn btn-secondary ${isMetronomeActive ? "active" : ""}`}
                  title={isMetronomeActive ? "Stop metronome" : "Start metronome"}
                  aria-label={isMetronomeActive ? "Stop metronome" : "Start metronome"}
                >
                  {isMetronomeActive ? "⏹️" : "▶️"}
                </button>
              </div>
              <span className="song-info-tempo-term">
                {/* getTempoTerm harus dipanggil di parent */}
              </span>
              {isMetronomeActive && <div className="song-info-tempo-status">♪ Playing...</div>}
            </div>
          )}
          {genre && (
            <div className="song-info-item">
              <span className="song-info-label">🎸 Genre</span>
              <span className="song-info-value">{genre}</span>
            </div>
          )}
          {arrangementStyle && (
            <div className="song-info-item song-info-block song-info-block-arrangement">
              <span className="song-info-label">🎷 Aransemen</span>
              <span className="song-info-value">{arrangementStyle}</span>
            </div>
          )}
          {keyboardPatch && (
            <div className="song-info-item song-info-block song-info-block-keyboard">
              <span className="song-info-label">🎹 Keyboard Patch</span>
              <span className="song-info-value">{keyboardPatch}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

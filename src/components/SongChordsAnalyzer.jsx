import React from "react";
import { transposeChord } from "../utils/chordUtils.js";
import ExpandButton from "./ExpandButton.jsx";

/**
 * SongChordsAnalyzer
 * Komponen analisis chord (total, unique, daftar chord)
 */
export default function SongChordsAnalyzer({
  showChordAnalyzer,
  setShowChordAnalyzer,
  chordStats,
  transpose
}) {
  return (
    <div className="song-panel">
      <div className="song-lyrics-analyzer-header">
        <ExpandButton
          isExpanded={showChordAnalyzer}
          setIsExpanded={setShowChordAnalyzer}
          icon="🎵"
          label="Analisis Chord"
          ariaLabel={showChordAnalyzer ? "Sembunyikan analisis chord" : "Tampilkan analisis chord"}
        />
      </div>
      {showChordAnalyzer && (
        <>
          <div className="song-lyrics-analyzer-grid">
            <div className="song-lyrics-analyzer-stat">
              <div className="song-lyrics-analyzer-stat-label">Total Chord</div>
              <div className="song-lyrics-analyzer-stat-value">{chordStats.count}</div>
            </div>
            <div className="song-lyrics-analyzer-stat">
              <div className="song-lyrics-analyzer-stat-label">Unique Chord</div>
              <div className="song-lyrics-analyzer-stat-value">{chordStats.chords.length}</div>
            </div>
          </div>
          <div className="song-lyrics-analyzer-chords">
            <label className="song-lyrics-analyzer-chords-label">Chord yang Digunakan:</label>
            <div className="song-lyrics-analyzer-chords-list">
              {chordStats.chords.length > 0 ? (
                chordStats.chords.map((chord) => (
                  <span key={chord} className="song-lyrics-analyzer-chord-tag">
                    {transpose !== 0 ? transposeChord(chord, transpose) : chord}
                  </span>
                ))
              ) : (
                <span className="song-lyrics-analyzer-chord-tag song-lyrics-analyzer-chord-empty">Tidak ada chord ditemukan</span>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

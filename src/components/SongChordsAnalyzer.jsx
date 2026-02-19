import React from "react";
import { transposeChord } from "../utils/chordUtils.js";

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
    <div className="song-lyrics-analyzer">
      <div className="song-lyrics-analyzer-header">
        <h3 className="song-lyrics-analyzer-title">🎵 Analisis Chord</h3>
        <button
          onClick={() => setShowChordAnalyzer(!showChordAnalyzer)}
          className="btn btn-secondary btn-xsmall"
        >
          {showChordAnalyzer ? "▼" : "▶"}
        </button>
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

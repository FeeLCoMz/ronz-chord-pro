import React from "react";

/**
 * SongChordsExportMenu
 * Komponen export menu untuk lirik/chord (text, PDF)
 */
export default function SongChordsExportMenu({
  showExportMenu,
  setShowExportMenu,
  handleExportText,
  handleExportPDF
}) {
  if (!showExportMenu) return null;
  return (
    <div className="song-lyrics-export-menu">
      <div className="song-lyrics-export-item" onClick={handleExportText}>
        📄 Export ke Text
      </div>
      <div className="song-lyrics-export-item" onClick={handleExportPDF}>
        📑 Print / PDF
      </div>
    </div>
  );
}

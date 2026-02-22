import React from "react";
import AutoScrollBar from "./AutoScrollBar.jsx";
import SongChordsExportMenu from "./SongChordsExportMenu.jsx";

/**
 * SongChordsLyricsToolbar
 * Toolbar untuk kontrol lirik/chord: autoscroll, fullscreen, zoom, edit, export.
 * Props:
 *   - isEditingLyrics
 *   - performanceMode
 *   - canEdit
 *   - tempo
 *   - autoScrollActive
 *   - scrollSpeed
 *   - setAutoScrollActive
 *   - setScrollSpeed
 *   - lyricsDisplayRef
 *   - currentBeat
 *   - setCurrentBeat
 *   - zoom
 *   - setZoom
 *   - handleEditLyrics
 *   - savingLyrics
 *   - handleSaveLyrics
 *   - handleCancelEditLyrics
 *   - showExportMenu
 *   - setShowExportMenu
 *   - handleExportText
 *   - handleExportPDF
 */
export default function SongChordsLyricsToolbar({
  isEditingLyrics,
  performanceMode,
  canEdit,
  tempo,
  autoScrollActive,
  scrollSpeed,
  setAutoScrollActive,
  setScrollSpeed,
  lyricsDisplayRef,
  currentBeat,
  setCurrentBeat,
  zoom,
  setZoom,
  handleEditLyrics,
  savingLyrics,
  handleSaveLyrics,
  handleCancelEditLyrics,
  showExportMenu,
  setShowExportMenu,
  handleExportText,
  handleExportPDF,
}) {
  return (
    <div className="song-lyrics-toolbar">
      {/* 1. Auto Scroll - PRIORITY (LEFT) */}
      {!isEditingLyrics && (
        <AutoScrollBar
          tempo={parseInt(tempo) || 120}
          active={autoScrollActive}
          speed={scrollSpeed}
          onToggle={() => setAutoScrollActive(!autoScrollActive)}
          onSpeedChange={setScrollSpeed}
          lyricsDisplayRef={lyricsDisplayRef}
          currentBeat={currentBeat}
          setCurrentBeat={setCurrentBeat}
        />
      )}
      {/* Fullscreen Button */}
      <button
        className="btn btn-secondary"
        title="Tampilkan lirik layar penuh"
        onClick={() => {
          const el = document.querySelector(".song-lyrics-display");
          if (el && el.requestFullscreen) {
            el.requestFullscreen();
          } else if (el && el.webkitRequestFullscreen) {
            el.webkitRequestFullscreen();
          } else if (el && el.msRequestFullscreen) {
            el.msRequestFullscreen();
          }
        }}
      >
        🖥️ Fullscreen
      </button>

      {/* 2. Zoom Controls */}
      <div className="song-lyrics-zoom-controls">
        <button
          onClick={() => setZoom(Math.max(0.7, zoom - 0.1))}
          className="btn btn-secondary"
          title="Perkecil"
        >
          −
        </button>
        <span className="song-lyrics-zoom-display">{(zoom * 100).toFixed(0)}%</span>
        <button
          onClick={() => setZoom(Math.min(1.5, zoom + 0.1))}
          className="btn btn-secondary"
          title="Perbesar"
        >
          +
        </button>
        <button onClick={() => setZoom(1)} className="btn btn-secondary" title="Reset">
          ⟲
        </button>
      </div>

      {/* 3. Edit Lirik */}
      {!isEditingLyrics ? (
        <>
          {/* Sembunyikan tombol edit lirik & export saat performanceMode aktif */}
          {!performanceMode && canEdit && (
            <button
              type="button"
              onClick={handleEditLyrics}
              className="btn btn-primary"
              style={{ fontSize: "0.9em" }}
            >
              ✏️ Edit Lirik
            </button>
          )}
          {/* 4. Export Menu (RIGHT) */}
          {!performanceMode && (
            <div className="song-lyrics-export-menu-container">
              <button
                type="button"
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="btn btn-secondary"
              >
                📥 Export
              </button>
              <SongChordsExportMenu
                showExportMenu={showExportMenu}
                setShowExportMenu={setShowExportMenu}
                handleExportText={handleExportText}
                handleExportPDF={handleExportPDF}
              />
            </div>
          )}
        </>
      ) : (
        <div className="song-lyrics-edit-actions">
          <button
            type="button"
            onClick={handleSaveLyrics}
            disabled={savingLyrics}
            className="btn"
          >
            {savingLyrics ? "⏳ Menyimpan..." : "✓ Simpan"}
          </button>
          <button
            type="button"
            onClick={handleCancelEditLyrics}
            disabled={savingLyrics}
            className="btn btn-secondary"
          >
            ✕ Batal
          </button>
        </div>
      )}
    </div>
  );
}

import React, { useState } from "react";
import SongChordsLyricsToolbar from '../components/SongChordsLyricsToolbar.jsx';
import SongChordsLyricsDisplay from '../components/SongChordsLyricsDisplay.jsx';
import ExpandButton from './ExpandButton.jsx';
import SongLyricsError from './SongLyricsError.jsx';
import SongLyricsTips from './SongLyricsTips.jsx';
import SongLyricsTextarea from './SongLyricsTextarea.jsx';

/**
 * SongLyricsMainSection
 * Komponen utama untuk menampilkan lirik, chord, dan toolbar
 */
export default function SongLyricsMainSection({
  isEditingLyrics,
  lyricsDisplayRef,
  editedLyrics,
  setEditedLyrics,
  editError,
  handleEditLyrics,
  savingLyrics,
  handleSaveLyrics,
  handleCancelEditLyrics,
  showExportMenu,
  setShowExportMenu,
  handleExportText,
  handleExportPDF,
  tempo,
  autoScrollActive,
  scrollSpeed,
  setAutoScrollActive,
  setScrollSpeed,
  currentBeat,
  setCurrentBeat,
  zoom,
  setZoom,
  performanceMode,
  canEdit,
  song,
  transpose,
  showSheetMusic,
  setShowSheetMusic,
  youtubeRef
}) {
  // Expand/collapse state for lyrics panel
  const [lyricsPanelExpanded, setLyricsPanelExpanded] = useState(true);

  return (
    <div className="song-panel song-lyrics-main">
      <div className="song-lyrics-main-header">
        <ExpandButton
          isExpanded={lyricsPanelExpanded}
          setIsExpanded={setLyricsPanelExpanded}
          icon="🎤"
          label="Lirik & Chord"
          ariaLabel={lyricsPanelExpanded ? 'Sembunyikan lirik & chord' : 'Tampilkan lirik & chord'}
        />
        {lyricsPanelExpanded && (
          <SongChordsLyricsToolbar
            isEditingLyrics={isEditingLyrics}
            performanceMode={performanceMode}
            canEdit={canEdit}
            tempo={tempo}
            autoScrollActive={autoScrollActive}
            scrollSpeed={scrollSpeed}
            setAutoScrollActive={setAutoScrollActive}
            setScrollSpeed={setScrollSpeed}
            lyricsDisplayRef={lyricsDisplayRef}
            currentBeat={currentBeat}
            setCurrentBeat={setCurrentBeat}
            zoom={zoom}
            setZoom={setZoom}
            handleEditLyrics={handleEditLyrics}
            savingLyrics={savingLyrics}
            handleSaveLyrics={handleSaveLyrics}
            handleCancelEditLyrics={handleCancelEditLyrics}
            showExportMenu={showExportMenu}
            setShowExportMenu={setShowExportMenu}
            handleExportText={handleExportText}
            handleExportPDF={handleExportPDF}
          />
        )}
      </div>

      {lyricsPanelExpanded && (
        <>
          <SongLyricsError error={editError} />
          <SongLyricsTips isEditing={isEditingLyrics} />
          {isEditingLyrics ? (
            <SongLyricsTextarea
              lyricsDisplayRef={lyricsDisplayRef}
              editedLyrics={editedLyrics}
              setEditedLyrics={setEditedLyrics}
            />
          ) : (
            <SongChordsLyricsDisplay
              isEditingLyrics={isEditingLyrics}
              lyricsDisplayRef={lyricsDisplayRef}
              song={song}
              transpose={transpose}
              zoom={zoom}
              autoScrollActive={autoScrollActive}
              scrollSpeed={scrollSpeed}
              setAutoScrollActive={setAutoScrollActive}
              setScrollSpeed={setScrollSpeed}
              currentBeat={currentBeat}
              setCurrentBeat={setCurrentBeat}
              showSheetMusic={showSheetMusic}
              setShowSheetMusic={setShowSheetMusic}
              youtubeRef={youtubeRef}
            />
          )}
        </>
      )}
    </div>
  );
}

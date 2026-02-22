import React from 'react';

export default function SetlistSongNavigator({ navPrev, navNext, songNumber, totalSongs, onPrev, onNext }) {
  return (
    <div className="setlist-song-navigator">
      <button
        className={`btn setlist-nav-btn${!navPrev ? ' disabled' : ''}`}
        disabled={!navPrev}
        title="Previous song"
        onClick={onPrev}
      >
        ← Previous
      </button>
      
      {songNumber && totalSongs && (
        <div className="setlist-song-info">
          <span className="setlist-song-info-label">Song</span>
          <span className="setlist-song-info-number">{songNumber}</span>
          <span className="setlist-song-info-label">of</span>
          <span className="setlist-song-info-total">{totalSongs}</span>
        </div>
      )}
      
      <button
        className={`btn setlist-nav-btn${!navNext ? ' disabled' : ''}`}
        disabled={!navNext}
        title="Next song"
        onClick={onNext}
      >
        Next →
      </button>
    </div>
  );
}

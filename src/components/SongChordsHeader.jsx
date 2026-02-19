import React from "react";

/**
 * SongChordsHeader
 * Komponen header untuk halaman SongChordsPage.
 * Menampilkan judul, artis, kontributor, dan tombol aksi.
 */
export default function SongChordsHeader({
  song,
  artist,
  performanceMode,
  canEdit,
  onEdit,
  onShare,
  shareMessage,
  onBack
}) {
  return (
    <div className="song-lyrics-header">
      <button
        onClick={onBack}
        className="btn btn-secondary"
        aria-label="Kembali"
        title="Kembali"
      >
        ←
      </button>
      <div className="song-lyrics-info">
        <h1 className="song-lyrics-title">{song.title}</h1>
        {artist && <p className="song-lyrics-artist">{artist}</p>}
        {!performanceMode && song.contributor && (
          <p className="song-lyrics-owner">
            Kontributor: <span className="song-lyrics-owner-name">{song.contributor}</span>
          </p>
        )}
      </div>
      <div className="song-lyrics-header-actions">
        {!performanceMode && canEdit && (
          <button onClick={onEdit} className="btn btn-secondary" title="Edit lagu">
            ✏️ Edit
          </button>
        )}
        {!performanceMode && (
          <button onClick={onShare} className="btn btn-secondary" title="Bagikan lagu">
            🔗 Bagikan
          </button>
        )}
      </div>
      {shareMessage && (
        <div className="info-text info-text-margin">{shareMessage}</div>
      )}
    </div>
  );
}

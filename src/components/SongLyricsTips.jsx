import React from "react";

export default function SongLyricsTips({ isEditing }) {
  if (!isEditing) return null;
  return (
    <div className="song-lyrics-tips">
      💡 Tips: Tekan <kbd>Ctrl+S</kbd> untuk simpan, <kbd>Esc</kbd> untuk batal
    </div>
  );
}

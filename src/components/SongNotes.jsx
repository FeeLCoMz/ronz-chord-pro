import React, { useState, useEffect } from 'react';
import './SongNotes.css';

// Simple local notes per song (by id)
export default function SongNotes({ songId }) {
  const [note, setNote] = useState('');
  useEffect(() => {
    if (songId) {
      setNote(localStorage.getItem('ronz_note_' + songId) || '');
    }
  }, [songId]);

  const handleChange = e => {
    setNote(e.target.value);
    if (songId) {
      localStorage.setItem('ronz_note_' + songId, e.target.value);
    }
  };

  return (
    <div className="song-notes-box">
      <label className="song-notes-label">Catatan Lagu:</label>
      <textarea
        className="song-notes-input"
        value={note}
        onChange={handleChange}
        placeholder="Tulis cue, intro, ending, atau catatan penting lain di sini..."
        rows={2}
        spellCheck={false}
      />
    </div>
  );
}

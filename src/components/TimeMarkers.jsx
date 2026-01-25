import React, { useState, useEffect, useRef } from 'react';
import './TimeMarkers.css';

// Helper to format seconds as mm:ss
function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function TimeMarkers({ songId, getCurrentTime, seekTo }) {
  const [markers, setMarkers] = useState([]);
  const [input, setInput] = useState('');
  const [editingIdx, setEditingIdx] = useState(null);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef();

  // Load markers from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`timeMarkers_${songId}`);
    setMarkers(saved ? JSON.parse(saved) : []);
  }, [songId]);

  // Save markers to localStorage
  useEffect(() => {
    localStorage.setItem(`timeMarkers_${songId}` , JSON.stringify(markers));
  }, [markers, songId]);

  // Add marker at current time
  const handleAdd = () => {
    if (!input.trim() || !getCurrentTime) return;
    const time = getCurrentTime();
    setMarkers([...markers, { label: input.trim(), time }].sort((a, b) => a.time - b.time));
    setInput('');
    inputRef.current?.focus();
  };

  // Remove marker
  const handleRemove = idx => {
    setMarkers(markers.filter((_, i) => i !== idx));
  };

  // Edit marker
  const handleEdit = idx => {
    setEditingIdx(idx);
    setEditValue(markers[idx].label);
  };
  const handleEditSave = idx => {
    setMarkers(markers.map((m, i) => i === idx ? { ...m, label: editValue } : m));
    setEditingIdx(null);
  };

  // Jump to marker
  const handleJump = t => {
    if (seekTo) seekTo(t);
  };

  return (
    <div className="time-markers-container">
      <div className="time-markers-header">Penanda Waktu</div>
      <div className="time-markers-list">
        {markers.length === 0 && <div className="time-markers-empty">Belum ada penanda.</div>}
        {markers.map((m, idx) => (
          <div className="time-marker-item" key={idx}>
            <span className="time-marker-time" onClick={() => handleJump(m.time)} title="Lompat ke waktu">{formatTime(m.time)}</span>
            {editingIdx === idx ? (
              <>
                <input
                  className="time-marker-edit-input"
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleEditSave(idx)}
                  autoFocus
                />
                <button className="time-marker-save-btn" onClick={() => handleEditSave(idx)}>Simpan</button>
              </>
            ) : (
              <>
                <span className="time-marker-label">{m.label}</span>
                <button className="time-marker-edit-btn" onClick={() => handleEdit(idx)} title="Edit">✎</button>
              </>
            )}
            <button className="time-marker-remove-btn" onClick={() => handleRemove(idx)} title="Hapus">🗑</button>
          </div>
        ))}
      </div>
      <div className="time-markers-add">
        <input
          className="time-marker-input"
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Tulis label penanda..."
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
        />
        <button className="time-marker-add-btn" onClick={handleAdd} disabled={!input.trim() || !getCurrentTime}>+ Tambah (waktu saat ini)</button>
      </div>
    </div>
  );
}

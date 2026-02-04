import React, { useState } from 'react';
import ExpandButton from './ExpandButton';

export default function TimeMarkers({
  timeMarkers = [],
  onSeek,
  currentTime = 0,
  duration = 0,
  readonly = false,
  onUpdate
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editTime, setEditTime] = useState('');
  const [editLabel, setEditLabel] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newLabel, setNewLabel] = useState('');

  const formatTime = (seconds) => {
    const sec = Math.max(0, Math.floor(seconds || 0));
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const parseTime = (timeStr) => {
    const parts = timeStr.split(':').map(p => parseInt(p) || 0);
    if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    }
    return parseInt(timeStr) || 0;
  };

  const handlePlay = (timestamp) => {
    if (onSeek && typeof onSeek === 'function') {
      onSeek(timestamp);
    }
  };

  const handleEdit = (marker) => {
    setEditingId(marker.id || marker.time);
    setEditTime(formatTime(marker.time));
    setEditLabel(marker.label || '');
  };

  const handleSaveEdit = () => {
    if (!onUpdate || readonly) return;
    const updatedMarkers = timeMarkers.map(m => {
      const markerId = m.id || m.time;
      if (markerId === editingId) {
        return {
          ...m,
          time: parseTime(editTime),
          label: editLabel
        };
      }
      return m;
    });
    onUpdate(updatedMarkers);
    setEditingId(null);
    setEditTime('');
    setEditLabel('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTime('');
    setEditLabel('');
  };

  const handleDelete = (marker) => {
    if (!onUpdate || readonly) return;
    const markerId = marker.id || marker.time;
    const updatedMarkers = timeMarkers.filter(m => (m.id || m.time) !== markerId);
    onUpdate(updatedMarkers);
  };

  const handleAddNew = () => {
    if (!onUpdate || readonly || !newTime) return;
    const newMarker = {
      time: parseTime(newTime),
      label: newLabel || `Marker ${formatTime(parseTime(newTime))}`
    };
    const updatedMarkers = [...timeMarkers, newMarker].sort((a, b) => a.time - b.time);
    onUpdate(updatedMarkers);
    setNewTime('');
    setNewLabel('');
  };

  const sortedMarkers = [...timeMarkers].sort((a, b) => a.time - b.time);

  return (
    <div className="time-markers">
      {/* Header */}
      <ExpandButton
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        icon="⏲️"
        label="Time Markers"
        badge={sortedMarkers.length > 0 ? sortedMarkers.length : null}
        rightContent={duration > 0 ? (
          <span className="time-markers-time">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        ) : null}
      />

      {/* Expanded Content */}
      {isExpanded && (
        <div className="time-markers-content">
          {/* Marker List */}
          {sortedMarkers.length > 0 ? (
            <div className="time-markers-list">
              {sortedMarkers.map((marker, idx) => {
                const markerId = marker.id || marker.time;
                const isEditing = editingId === markerId;

                if (isEditing) {
                  return (
                    <div
                      key={markerId}
                      className="time-marker-item time-marker-item-editing"
                    >
                      <input
                        type="text"
                        value={editTime}
                        onChange={(e) => setEditTime(e.target.value)}
                        placeholder="mm:ss"
                        className="time-marker-input"
                      />
                      <input
                        type="text"
                        value={editLabel}
                        onChange={(e) => setEditLabel(e.target.value)}
                        placeholder="Label"
                        className="time-marker-input"
                      />
                      <div className="time-marker-edit-actions">
                        <button
                          type="button"
                          onClick={handleSaveEdit}
                          className="time-marker-save-btn"
                        >
                          ✓ Simpan
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="time-marker-cancel-btn"
                        >
                          ✕ Batal
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={markerId}
                    className="time-marker-item"
                  >
                    <button
                      type="button"
                      onClick={() => handlePlay(marker.time)}
                      className="time-marker-play-btn"
                    >
                      ▶ {formatTime(marker.time)}
                    </button>
                    <div className="time-marker-label">
                      {marker.label || `Marker ${idx + 1}`}
                    </div>
                    {!readonly && (
                      <div className="time-marker-actions">
                        <button
                          type="button"
                          onClick={() => handleEdit(marker)}
                          className="time-marker-edit-btn"
                        >
                          ✏️
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(marker)}
                          className="time-marker-delete-btn"
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="time-marker-empty">
              Belum ada timestamp
            </div>
          )}

          {/* Add New Marker */}
          {!readonly && (
            <div className="time-marker-add">
              <div className="time-marker-add-title">
                ➕ Tambah Timestamp Baru
              </div>
              <input
                type="text"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                placeholder="mm:ss (contoh: 1:30)"
                className="time-marker-input"
              />
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="Label (opsional)"
                className="time-marker-input"
              />
              <button
                type="button"
                onClick={handleAddNew}
                disabled={!newTime}
                className="time-marker-add-btn"
              >
                ➕ Tambah Timestamp
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

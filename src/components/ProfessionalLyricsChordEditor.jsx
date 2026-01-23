import React, { useState, useRef } from 'react';
import YouTubeViewer from './YouTubeViewer';
import ChordDisplay from './ChordDisplay';

/**
 * ProfessionalLyricsChordEditor
 * Editor lirik & chord profesional dengan audio player terintegrasi
 * Fitur: area edit besar, audio player, preview real-time, dan sinkronisasi waktu
 */
const ProfessionalLyricsChordEditor = ({
  initialLyrics = '',
  initialYoutubeId = '',
  onSave,
  onCancel
}) => {
  const [lyrics, setLyrics] = useState(initialLyrics);
  const [youtubeId, setYoutubeId] = useState(initialYoutubeId);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showPreview, setShowPreview] = useState(true);
  const textareaRef = useRef();

  return (
    <div className="pro-lyrics-chord-editor">
      <div className="editor-header">
        <h2>Edit Lirik & Chord (Mode Profesional)</h2>
        <button className="btn" onClick={onCancel}>Batal</button>
        <button className="btn btn-primary" onClick={() => onSave(lyrics, youtubeId)}>Simpan</button>
      </div>
      <div className="editor-main">
        <div className="editor-audio">
          <label>YouTube ID/URL:</label>
          <input
            type="text"
            value={youtubeId}
            onChange={e => setYoutubeId(e.target.value)}
            placeholder="Masukkan ID atau URL YouTube"
            style={{ width: '70%' }}
          />
          {youtubeId && (
            <YouTubeViewer
              videoId={youtubeId}
              minimalControls={false}
              onTimeUpdate={(t, d) => { setCurrentTime(t); setDuration(d); }}
            />
          )}
        </div>
        <div className="editor-body">
          <textarea
            ref={textareaRef}
            className="editor-textarea"
            value={lyrics}
            onChange={e => setLyrics(e.target.value)}
            rows={18}
            style={{ width: '100%', fontFamily: 'monospace', fontSize: '1.1em', marginBottom: 8 }}
            placeholder="Tulis atau paste lirik & chord di sini..."
          />
          <div style={{ marginBottom: 8 }}>
            <button className="btn btn-xs" onClick={() => setShowPreview(p => !p)}>
              {showPreview ? 'Sembunyikan Preview' : 'Tampilkan Preview'}
            </button>
          </div>
          {showPreview && (
            <div className="editor-preview">
              <ChordDisplay lyrics={lyrics} />
            </div>
          )}
        </div>
      </div>
      <div className="editor-footer" style={{ marginTop: 16, color: '#888', fontSize: '0.95em' }}>
        <span>Waktu video: {Math.floor(currentTime)} / {Math.floor(duration)} detik</span>
      </div>
    </div>
  );
};

export default ProfessionalLyricsChordEditor;

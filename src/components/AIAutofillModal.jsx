import React from 'react';

export default function AIAutofillModal({
  aiResult,
  aiConfirmFields,
  setAiConfirmFields,
  onApply,
  onClose
}) {
  if (!aiResult) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onApply();
  };

  return (
    <div
      className="modal-overlay ai-autofill-modal-overlay"
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      aria-label="AI Autofill Modal"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="modal ai-autofill-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="ai-autofill-modal-title">
          🤖 Konfirmasi AI Autofill
        </h3>
        <p className="ai-autofill-modal-desc">
          Pilih field yang ingin diisi otomatis dari hasil AI:
        </p>
        {/* Chord Links */}
        {Array.isArray(aiResult.chordLinks) && aiResult.chordLinks.length > 0 && (
          <div className="ai-autofill-chordlinks">
            <div className="ai-autofill-chordlinks-label">
              📚 Sumber Chord:
            </div>
            <ul className="ai-autofill-chordlinks-list">
              {aiResult.chordLinks.map((cl, idx) => (
                <li key={idx} className="ai-autofill-chordlinks-item">
                  <a
                    href={cl.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ai-autofill-chordlinks-link"
                  >
                    {cl.title || cl.site}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="ai-autofill-fields">
            {/* Artist */}
            {aiResult.artist && (
              <label className="ai-autofill-field">
                <input
                  type="checkbox"
                  checked={aiConfirmFields.artist || false}
                  onChange={e => setAiConfirmFields(f => ({...f, artist: e.target.checked}))}
                  className="ai-autofill-checkbox"
                />
                <span className="ai-autofill-field-label">
                  👤 Artist: <span className="ai-autofill-field-value">{aiResult.artist}</span>
                </span>
              </label>
            )}

            {/* Key */}
            {aiResult.key && (
              <label className="ai-autofill-field">
                <input
                  type="checkbox"
                  checked={aiConfirmFields.key || false}
                  onChange={e => setAiConfirmFields(f => ({...f, key: e.target.checked}))}
                  className="ai-autofill-checkbox"
                />
                <span className="ai-autofill-field-label">
                  🎼 Key: <span className="ai-autofill-field-value">{aiResult.key}</span>
                </span>
              </label>
            )}

            {/* Tempo */}
            {aiResult.tempo && (
              <label className="ai-autofill-field">
                <input
                  type="checkbox"
                  checked={aiConfirmFields.tempo || false}
                  onChange={e => setAiConfirmFields(f => ({...f, tempo: e.target.checked}))}
                  className="ai-autofill-checkbox"
                />
                <span className="ai-autofill-field-label">
                  ⏱️ Tempo: <span className="ai-autofill-field-value">{aiResult.tempo} BPM</span>
                </span>
              </label>
            )}

            {/* Arrangement Style */}
            {aiResult.arrangementStyle && (
              <label className="ai-autofill-field">
                <input
                  type="checkbox"
                  checked={aiConfirmFields.arrangementStyle || false}
                  onChange={e => setAiConfirmFields(f => ({...f, arrangementStyle: e.target.checked}))}
                  className="ai-autofill-checkbox"
                />
                <span className="ai-autofill-field-label">
                  🎹 Gaya Aransemen: <span className="ai-autofill-field-value">{aiResult.arrangementStyle}</span>
                </span>
              </label>
            )}

            {/* Keyboard Patch */}
            {aiResult.keyboardPatch && (
              <label className="ai-autofill-field">
                <input
                  type="checkbox"
                  checked={aiConfirmFields.keyboardPatch || false}
                  onChange={e => setAiConfirmFields(f => ({...f, keyboardPatch: e.target.checked}))}
                  className="ai-autofill-checkbox"
                />
                <span className="ai-autofill-field-label">
                  🎹 Keyboard Patch: <span className="ai-autofill-field-value">{Array.isArray(aiResult.keyboardPatch) ? aiResult.keyboardPatch.join(', ') : aiResult.keyboardPatch}</span>
                </span>
              </label>
            )}
            {aiResult.genre && (
              <label className="ai-autofill-field">
                <input
                  type="checkbox"
                  checked={aiConfirmFields.genre || false}
                  onChange={e => setAiConfirmFields(f => ({...f, genre: e.target.checked}))}
                  className="ai-autofill-checkbox"
                />
                <span className="ai-autofill-field-label">
                  🎸 Genre: <span className="ai-autofill-field-value">{aiResult.genre}</span>
                </span>
              </label>
            )}            
            {aiResult.youtubeId && (
              <label className="ai-autofill-field">
                <input
                  type="checkbox"
                  checked={aiConfirmFields.youtubeId || false}
                  onChange={e => setAiConfirmFields(f => ({...f, youtubeId: e.target.checked}))}
                  className="ai-autofill-checkbox"
                />
                <span className="ai-autofill-field-label">
                  🎬 YouTube ID: <span className="ai-autofill-field-value ai-autofill-youtubeid">{aiResult.youtubeId}</span>
                </span>
              </label>
            )}
            {aiResult.lyrics && (
              <label className="ai-autofill-field ai-autofill-field-lyrics">
                <input
                  type="checkbox"
                  checked={aiConfirmFields.lyrics || false}
                  onChange={e => setAiConfirmFields(f => ({...f, lyrics: e.target.checked}))}
                  className="ai-autofill-checkbox ai-autofill-checkbox-lyrics"
                />
                <span className="ai-autofill-field-label">
                  🎤 Lirik: <span className="ai-autofill-field-value ai-autofill-lyrics-value">
                    {aiResult.lyrics.slice(0, 80)}{aiResult.lyrics.length > 80 ? '...' : ''}
                  </span>
                </span>
              </label>
            )}
            {/* Tambahkan field lain sesuai kebutuhan */}
          </div>
          <div className="ai-autofill-modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn ai-autofill-cancel"
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn btn-primary ai-autofill-apply"
            >
              ✓ Terapkan Pilihan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

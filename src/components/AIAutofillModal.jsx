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
      className="modal-overlay"
      tabIndex={-1}
      onKeyDown={e => { if (e.key === 'Escape') onClose(); }}
      onClick={e => { if (e.target.classList.contains('modal-overlay')) onClose(); }}
    >
      <div
        className="modal-content"
        role="dialog"
        aria-modal="true"
        tabIndex={0}
      >
        <h3 style={{marginTop:0, marginBottom:16}}>Konfirmasi Isi Otomatis</h3>
        <div style={{marginBottom:16, fontSize:'0.98em'}}>Pilih field yang ingin diisi otomatis:</div>
        
        {/* Chord Links */}
        {Array.isArray(aiResult.chordLinks) && aiResult.chordLinks.length > 0 && (
          <div style={{marginBottom:16}}>
            <div style={{fontWeight:600, marginBottom:4}}>Sumber Chord:</div>
            <ul style={{paddingLeft:18, margin:0}}>
              {aiResult.chordLinks.map((cl, idx) => (
                <li key={idx} style={{marginBottom:2}}>
                  <a href={cl.url} target="_blank" rel="noopener noreferrer" style={{color:'#4f8cff', textDecoration:'underline'}}>{cl.title || cl.site}</a>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {aiResult.key && (
            <div style={{marginBottom:8}}>
              <label><input type="checkbox" checked={aiConfirmFields.key} onChange={e => setAiConfirmFields(f => ({...f, key: e.target.checked}))} /> Key: <span style={{fontWeight:600}}>{aiResult.key}</span></label>
            </div>
          )}
          {aiResult.tempo && (
            <div style={{marginBottom:8}}>
              <label><input type="checkbox" checked={aiConfirmFields.tempo} onChange={e => setAiConfirmFields(f => ({...f, tempo: e.target.checked}))} /> Tempo: <span style={{fontWeight:600}}>{aiResult.tempo}</span></label>
            </div>
          )}
          {aiResult.style && (
            <div style={{marginBottom:8}}>
              <label><input type="checkbox" checked={aiConfirmFields.style} onChange={e => setAiConfirmFields(f => ({...f, style: e.target.checked}))} /> Style: <span style={{fontWeight:600}}>{aiResult.style}</span></label>
            </div>
          )}
          {aiResult.youtubeId && (
            <div style={{marginBottom:8}}>
              <label><input type="checkbox" checked={aiConfirmFields.youtubeId} onChange={e => setAiConfirmFields(f => ({...f, youtubeId: e.target.checked}))} /> YouTube ID: <span style={{fontWeight:600}}>{aiResult.youtubeId}</span></label>
            </div>
          )}
          {aiResult.lyrics && (
            <div style={{marginBottom:8}}>
              <label><input type="checkbox" checked={aiConfirmFields.lyrics} onChange={e => setAiConfirmFields(f => ({...f, lyrics: e.target.checked}))} /> Lirik: <span style={{fontWeight:600, fontStyle:'italic'}}>{aiResult.lyrics.slice(0, 60)}{aiResult.lyrics.length > 60 ? '...' : ''}</span></label>
            </div>
          )}
          {Array.isArray(aiResult.instruments) && aiResult.instruments.length > 0 && (
            <div style={{marginBottom:8}}>
              <label><input type="checkbox" checked={aiConfirmFields.instruments} onChange={e => setAiConfirmFields(f => ({...f, instruments: e.target.checked}))} /> Instrumen: <span style={{fontWeight:600}}>{aiResult.instruments.join(', ')}</span></label>
            </div>
          )}
          <div style={{display:'flex', justifyContent:'flex-end', gap:10, marginTop:18}}>
            <button type="button" className="btn-base tab-btn" onClick={onClose}>Batal</button>
            <button type="submit" className="btn-base tab-btn" style={{background:'#4f8cff', color:'#fff', fontWeight:600}}>Isi Field</button>
          </div>
        </form>
      </div>
    </div>
  );
}

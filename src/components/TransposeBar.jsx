import React from 'react';

function TransposeBar({ transpose, setTranspose, highlightChords, setHighlightChords }) {
  return (
    <div className="transpose-bar">
      <button className="btn-base transpose-btn" onClick={() => setTranspose(t => t - 1)}>-</button>
      <span className="transpose-label">{transpose >= 0 ? '+' : ''}{transpose}</span>
      <button className="btn-base transpose-btn" onClick={() => setTranspose(t => t + 1)}>+</button>
      <button
        className={`btn-base highlight-btn${highlightChords ? ' active' : ''}`}
        onClick={() => setHighlightChords(h => !h)}
        title="Highlight chord/bar"
      >{highlightChords ? '🔆 Highlight ON' : '💡 Highlight'}</button>
    </div>
  );
}

export default TransposeBar;

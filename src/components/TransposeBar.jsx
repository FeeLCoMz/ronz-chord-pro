import React from 'react';

function TransposeBar({ transpose, setTranspose, highlightChords, setHighlightChords }) {
  return (
    <div className="transpose-bar">
      <button className="transpose-btn" onClick={() => setTranspose(t => t - 1)}>-</button>
      <span className="transpose-label">Transpose: {transpose >= 0 ? '+' : ''}{transpose}</span>
      <button className="transpose-btn" onClick={() => setTranspose(t => t + 1)}>+</button>
      <button
        className={highlightChords ? 'highlight-btn active' : 'highlight-btn'}
        onClick={() => setHighlightChords(h => !h)}
        title="Highlight chord/bar"
      >{highlightChords ? '🔆 Highlight ON' : '💡 Highlight'}</button>
    </div>
  );
}

export default TransposeBar;

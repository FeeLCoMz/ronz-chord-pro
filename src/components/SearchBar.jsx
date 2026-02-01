import React from 'react';

export default function SearchBar({ value, onChange, onVoiceSearch, placeholder = "Cari judul atau artist..." }) {
  return (
    <div className="song-search-bar">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="search-input"
      />
      {onVoiceSearch && (
        <button
          type="button"
          className="btn-base tab-btn mic-btn"
          title="Cari dengan suara"
          onClick={onVoiceSearch}
        >
          <span role="img" aria-label="Mic">🎤</span>
        </button>
      )}
    </div>
  );
}

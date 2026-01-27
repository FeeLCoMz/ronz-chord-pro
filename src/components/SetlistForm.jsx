import React, { useState, useEffect } from 'react';

export default function SetlistForm({
  mode = 'create',
  initialData = {},
  onSubmit,
  onCancel,
  loading = false,
  error = '',
  title = '',
}) {
  const [name, setName] = useState(initialData.name || '');
  const [desc, setDesc] = useState(initialData.desc || '');
  useEffect(() => {
    setName(initialData.name || '');
    setDesc(initialData.desc || '');
  }, [initialData]);

  const handleSubmit = e => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), desc: desc.trim() });
  };

  return (
    <div className="modal-content" onClick={e => e.stopPropagation()}>
      <h3 className="setlist-modal-title">{title}</h3>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <label>Nama Setlist
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="search-input"
            required
            autoFocus
          />
        </label>
        <label>Deskripsi (opsional)
          <textarea
            value={desc}
            onChange={e => setDesc(e.target.value)}
            className="search-input"
            rows={3}
            style={{ resize: 'vertical' }}
          />
        </label>
        {error && <div className="error-text" style={{ marginTop: 10 }}>{error}</div>}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
          <button type="button" className="tab-btn" onClick={onCancel}>Batal</button>
          <button type="submit" className="tab-btn" style={{ background: '#4f8cff', color: '#fff', fontWeight: 600 }} disabled={loading || !name.trim()}>
            {loading ? (mode === 'edit' ? 'Menyimpan...' : 'Membuat...') : (mode === 'edit' ? 'Simpan Perubahan' : 'Buat Setlist')}
          </button>
        </div>
      </form>
    </div>
  );
}

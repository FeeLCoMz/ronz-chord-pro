import React, { useRef, useState } from 'react';
import * as apiClient from '../apiClient.js';
import { useAuth } from '../contexts/AuthContext.jsx';
// No permission check needed, just check user.role === 'owner'

export default function ToolsPage() {
  const { user } = useAuth();

  if (!user || user.role !== 'owner') {
    return (
      <div className="page-container">
        <div className="page-header"><h1>Tools</h1></div>
        <div className="card">Hanya Owner aplikasi yang dapat mengakses halaman ini.</div>
      </div>
    );
  }

  // State for import/export
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState(null);
  const [importSuccess, setImportSuccess] = useState(null);
  const fileInputRef = useRef();

  // Export handler
  const handleExport = async () => {
    setExporting(true);
    try {
      const data = await apiClient.exportAllData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ruang-performer-backup-${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Export gagal: ' + (e.message || e));
    }
    setExporting(false);
  };

  // Import handler
  const handleImport = async (e) => {
    setImportError(null);
    setImportSuccess(null);
    setImporting(true);
    const file = e.target.files[0];
    if (!file) { setImporting(false); return; }
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      await apiClient.importAllData(json);
      setImportSuccess('Import berhasil!');
    } catch (err) {
      setImportError('Import gagal: ' + (err.message || err));
    }
    setImporting(false);
    fileInputRef.current.value = '';
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Tools Owner</h1>
      </div>
      <div className="card tools-grid">
        <div className="tool-card">
          <h2>Export Data</h2>
          <p>Ekspor seluruh data aplikasi ke file JSON untuk backup atau migrasi.</p>
          <button className="btn btn-secondary" onClick={handleExport} disabled={exporting}>{exporting ? 'Exporting...' : 'Export JSON'}</button>
        </div>
        <div className="tool-card">
          <h2>Import Data</h2>
          <p>Impor data dari file JSON untuk restore atau migrasi data.<br/><b>Seluruh data lama akan dihapus!</b></p>
          <input type="file" accept="application/json" style={{ display: 'none' }} ref={fileInputRef} onChange={handleImport} disabled={importing} />
          <button className="btn btn-secondary" onClick={() => fileInputRef.current && fileInputRef.current.click()} disabled={importing}>{importing ? 'Importing...' : 'Import JSON'}</button>
          {importError && <div style={{ color: 'red', marginTop: 8 }}>{importError}</div>}
          {importSuccess && <div style={{ color: 'green', marginTop: 8 }}>{importSuccess}</div>}
        </div>
        <div className="tool-card">
          <h2>Reset Cache / Refresh Data</h2>
          <p>Bersihkan cache aplikasi atau refresh data dari server.</p>
          <button className="btn btn-secondary" disabled>Reset Cache (coming soon)</button>
        </div>
        <div className="tool-card">
          <h2>User Management</h2>
          <p>Kelola user: reset password, nonaktifkan user, atau ubah role user secara manual.</p>
          <button className="btn btn-secondary" disabled>Kelola User (coming soon)</button>
        </div>
        <div className="tool-card">
          <h2>Audit Log Viewer</h2>
          <p>Lihat log aktivitas penting aplikasi.</p>
          <button className="btn btn-secondary" onClick={() => window.location.href='/audit-logs'}>Lihat Audit Log</button>
        </div>
        <div className="tool-card">
          <h2>System Health / Status</h2>
          <p>Lihat status server, database, dan resource penting lain.</p>
          <button className="btn btn-secondary" disabled>Lihat Status (coming soon)</button>
        </div>
        <div className="tool-card">
          <h2>Maintenance Actions</h2>
          <p>Jalankan perintah maintenance seperti reindex, migrasi, atau perbaikan data.</p>
          <button className="btn btn-secondary" disabled>Maintenance (coming soon)</button>
        </div>
        <div className="tool-card">
          <h2>Pengaturan Aplikasi</h2>
          <p>Ubah setting global aplikasi (branding, notifikasi, dsb).</p>
          <button className="btn btn-secondary" disabled>Pengaturan (coming soon)</button>
        </div>
      </div>
      <style>{`
        .tools-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 24px;
        }
        .tool-card {
          background: var(--card-bg, #fff);
          border: 1px solid var(--border-color, #ddd);
          border-radius: 10px;
          padding: 24px 18px 18px 18px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.03);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .tool-card h2 {
          margin-top: 0;
          font-size: 1.2em;
        }
        .tool-card p {
          flex: 1;
          color: var(--text-secondary, #666);
        }
        .tool-card .btn {
          margin-top: 12px;
        }
      `}</style>
    </div>
  );
}

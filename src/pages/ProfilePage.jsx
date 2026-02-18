import React from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="page-container">
        <div className="card">
          <h2>Profil</h2>
          <p>Anda belum login.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Profil Akun</h1>
      </div>
      <div className="card">
        <div style={{ marginBottom: 16 }}>
          <strong>Nama:</strong> {user.name || '-'}
        </div>
        <div style={{ marginBottom: 16 }}>
          <strong>Email:</strong> {user.email || '-'}
        </div>
        <div style={{ marginBottom: 16 }}>
          <strong>Role:</strong> {user.role || '-'}
        </div>
        {/* Tambahkan pengaturan lain di sini */}
      </div>
    </div>
  );
}

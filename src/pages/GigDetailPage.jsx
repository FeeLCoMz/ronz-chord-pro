import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as apiClient from '../apiClient.js';
import { Link } from 'react-router-dom';
import GigPoster from '../components/GigPoster.jsx';
import { toPng } from 'html-to-image';
import { usePermission } from '../hooks/usePermission.js';

export default function GigDetailPage() {
  const [setlist, setSetlist] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGeneratingPoster, setIsGeneratingPoster] = useState(false);
  const [posterError, setPosterError] = useState('');
  const posterRef = useRef(null);
  // Permission logic
  const bandId = gig?.bandId || null;
  const userBandInfo = gig?.userBandInfo || null; // Pastikan gig API mengembalikan userBandInfo
  const { can } = usePermission(bandId, userBandInfo);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await apiClient.fetchGigById(id);
        setGig(data);
        if (data?.setlistId) {
          // Fetch setlist detail jika ada
          const setlists = await apiClient.fetchSetLists();
          const found = Array.isArray(setlists) ? setlists.find(s => s.id === data.setlistId) : null;
          setSetlist(found || null);
        } else {
          setSetlist(null);
        }
      } catch {
        setGig(null);
        setSetlist(null);
      }
      setLoading(false);
    })();
  }, [id]);

  const handleDownloadPoster = () => {
    if (!posterRef.current || !gig) return;
    setIsGeneratingPoster(true);
    setPosterError('');
    const safeName = (gig.bandName || 'gig').replace(/[\\/:*?"<>|]+/g, '').trim();
    toPng(posterRef.current, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: '#0f172a'
    })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `${safeName || 'gig'}-poster.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch(() => {
        setPosterError('Gagal membuat poster. Coba lagi.');
      })
      .finally(() => {
        setIsGeneratingPoster(false);
      });
  };

  if (loading) return <div className="page-container"><span className="loading-skeleton" style={{width:120,height:32}} /></div>;
  if (!gig) return <div className="page-container"><h2>Gig tidak ditemukan</h2></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🎤 Gig: {gig.bandName || 'Gig'}</h1>
        <button className="btn" onClick={() => navigate(-1)}>← Kembali</button>
        {can && can('gig:edit') && (
          <button
            className="btn btn-primary"
            style={{ marginLeft: 8 }}
            onClick={() => navigate(`/gigs/edit/${gig.id}`)}
          >
            ✏️ Edit Gig
          </button>
        )}
      </div>
      <div className="card">
        <p><b>Tanggal:</b> {new Date(gig.date).toLocaleString('id-ID')}</p>
        <p><b>Venue:</b> {gig.venue || '-'}</p>
        <p><b>Kota:</b> {gig.city || '-'}</p>
        <p><b>Fee/Bayaran:</b> {gig.fee ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(gig.fee) : '-'}</p>
        <p><b>Status:</b> {gig.status || '-'}</p>
        <div style={{ marginBottom: 8 }}>
          <b>Setlist:</b> {gig.setlistName ? (
            <>
              <Link to={gig.setlistId ? `/setlists/${gig.setlistId}` : '#'} style={{ color: 'var(--primary-accent)', textDecoration: 'underline' }}>
                {gig.setlistName}
              </Link>
              {setlist && Array.isArray(setlist.songs) && setlist.songs.length > 0 && (
                <ul style={{ margin: '8px 0 0 16px', padding: 0, fontSize: '0.98em', color: 'var(--text-secondary)' }}>
                  {setlist.songs.map((song, idx) => (
                    <li key={song.id || idx}>
                      {song.title || '[Lagu dihapus]'}
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : '-'}
        </div>
        <p><b>Catatan:</b> {gig.notes || '-'}</p>
      </div>
      {/* Poster Gig dihapus sesuai permintaan */}
    </div>
  );
}

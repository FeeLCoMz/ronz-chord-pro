
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';


import YouTubeViewer from '../components/YouTubeViewer.jsx';
import TimeMarkers from '../components/TimeMarkers.jsx';
import TapTempo from '../components/TapTempo.jsx';
import AIAutofillModal from '../components/AIAutofillModal.jsx';

function SongAddEditPage({ mode = 'add', songId, onSongUpdated }) {
	const location = useLocation();
	const navigate = useNavigate();
	const [title, setTitle] = useState('');
	const [artist, setArtist] = useState('');
	const [key, setKey] = useState('C');
	const [tempo, setTempo] = useState('');
	const [style, setStyle] = useState('');
	const [lyrics, setLyrics] = useState('');
	const [youtubeId, setYoutubeId] = useState('');
	const [instruments, setInstruments] = useState([]);
	const [timestamps, setTimestamps] = useState([]);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [loadingData, setLoadingData] = useState(mode === 'edit');
	const [aiLoading, setAiLoading] = useState(false);
	const [aiResult, setAiResult] = useState(null);
	const [showAiConfirm, setShowAiConfirm] = useState(false);
	const [aiConfirmFields, setAiConfirmFields] = useState({});
	// Ref dan state untuk sinkronisasi YouTubeViewer dan TimeMarkers
	const ytRef = useRef(null);
	const [ytCurrentTime, setYtCurrentTime] = useState(0);
	const [ytDuration, setYtDuration] = useState(0);

	const handleAIAutofill = async () => {
		if (!title.trim()) {
			setError('Isi judul lagu terlebih dahulu.');
			return;
		}
		setAiLoading(true);
		setError('');
		try {
			const res = await fetch('/api/ai/song-search', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ title: title.trim(), artist: artist.trim() })
			});
			if (!res.ok) throw new Error('Gagal mendapatkan info AI');
			const data = await res.json();
			setAiResult(data);
			setAiConfirmFields({
				key: !!data.key,
				tempo: !!data.tempo,
				style: !!data.style,
				youtubeId: !!data.youtubeId,
				lyrics: !!data.lyrics,
				instruments: Array.isArray(data.instruments) && data.instruments.length > 0,
			});
			setShowAiConfirm(true);
		} catch (e) {
			setError(e.message || 'Gagal autofill AI');
		} finally {
			setAiLoading(false);
		}
	};

	const handleApplyAiFields = () => {
		if (!aiResult) return;
		if (aiConfirmFields.key && aiResult.key) setKey(aiResult.key);
		if (aiConfirmFields.tempo && aiResult.tempo) setTempo(aiResult.tempo);
		if (aiConfirmFields.style && aiResult.style) setStyle(aiResult.style);
		if (aiConfirmFields.youtubeId && aiResult.youtubeId) setYoutubeId(aiResult.youtubeId);
		if (aiConfirmFields.lyrics && aiResult.lyrics) setLyrics(aiResult.lyrics);
		if (aiConfirmFields.instruments && Array.isArray(aiResult.instruments)) setInstruments(aiResult.instruments);
		setShowAiConfirm(false);
		setAiResult(null);
	};

	useEffect(() => {
		if (mode === 'edit' && songId) {
			setLoadingData(true);
			fetch(`/api/songs/${songId}`)
				.then(res => {
					if (!res.ok) throw new Error('Gagal mengambil data lagu');
					return res.json();
				})
				.then(data => {
					setTitle(data.title || '');
					setArtist(data.artist || '');
					setKey(data.key || 'C');
					setTempo(data.tempo || '');
					setStyle(data.style || '');
					setLyrics(data.lyrics || '');
					setYoutubeId(data.youtubeId || '');
					setInstruments(Array.isArray(data.instruments) ? data.instruments : []);
					setTimestamps(Array.isArray(data.timestamps) ? data.timestamps : []);
					setLoadingData(false);
				})
				.catch(e => {
					setError(e.message || 'Gagal mengambil data lagu');
					setLoadingData(false);
				});
		} else if (mode === 'add') {
			setTitle('');
			setArtist('');
			setKey('C');
			setTempo('');
			setStyle('');
			setLyrics('');
			setYoutubeId('');
			setTimestamps([]);
			setLoadingData(false);
		}
	}, [songId, mode]);

	const handleSubmit = async e => {
		e.preventDefault();
		if (!title.trim() || !artist.trim()) {
			setError('Judul dan artist wajib diisi.');
			return;
		}
		setLoading(true);
		setError('');
		try {
			let res;
			const payload = { title, artist, key, tempo, style, lyrics, youtubeId, timestamps, instruments };
			if (mode === 'edit') {
				res = await fetch(`/api/songs/${songId}`, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(payload)
				});
				if (!res.ok) throw new Error('Gagal mengupdate lagu');
			} else {
				res = await fetch('/api/songs', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(payload)
				});
				if (!res.ok) throw new Error('Gagal menambah lagu');
			}
			if (onSongUpdated) onSongUpdated(songId);
		} catch (e) {
			setError(e.message || (mode === 'edit' ? 'Gagal mengupdate lagu' : 'Gagal menambah lagu'));
		} finally {
			setLoading(false);
		}
	};

	if (loadingData) return <div className="main-content">Memuat data lagu...</div>;

	return (
		<div className="song-edit-page-container">
			<button
				className="btn-base back-btn"
				onClick={() => {
					if (mode === 'edit' && songId) {
						navigate(`/songs/${songId}`);
					} else {
						navigate('/');
					}
				}}
				style={{ marginBottom: 18 }}
			>&larr; Kembali</button>
			<div className="section-title">{mode === 'edit' ? 'Edit Lagu' : 'Tambah Lagu Baru'}</div>
			<form onSubmit={handleSubmit} className="song-edit-form">
				<button type="button" className="btn-base tab-btn" onClick={handleAIAutofill} disabled={aiLoading || !title.trim()}>
					{aiLoading ? 'Mengisi Otomatis...' : 'Isi Otomatis (AI)'}
				</button>
				<label>Judul Lagu
					<input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
				</label>
				<label>Artist
					<input type="text" value={artist} onChange={e => setArtist(e.target.value)} required />
				</label>
				<label>YouTube ID
					<input
						type="text"
						value={youtubeId}
						onChange={e => {
							const val = e.target.value;
							// Regex to extract YouTube video ID from various URL formats
							const ytMatch = val.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)?)([\w-]{11})/i);
							if (ytMatch) {
								setYoutubeId(ytMatch[1]);
							} else {
								setYoutubeId(val);
							}
						}}
						placeholder="Contoh: dQw4w9WgXcQ atau URL YouTube"
					/>
				</label>
				   <div style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'flex-end' }}>
					   <label style={{ flex: 1 }}>Key
						   <input type="text" value={key} onChange={e => setKey(e.target.value)} style={{ marginBottom: 0 }} />
					   </label>
					   <label style={{ flex: 1 }}>Tempo
						   <input type="number" value={tempo} onChange={e => setTempo(e.target.value)} style={{ marginBottom: 0 }} />
					   </label>
					   <TapTempo onTempo={setTempo} initialTempo={tempo} />
				   </div>
				<label>Style
					<input type="text" value={style} onChange={e => setStyle(e.target.value)} />
				</label>
				<label>Instrumen (pisahkan dengan koma)
					<input
						type="text"
						value={instruments.join(', ')}
						onChange={e => setInstruments(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
						placeholder="Contoh: gitar, piano, drum"
					/>
				</label>
				{/* YouTube Viewer dan TimeMarkers di atas field lirik */}
				{youtubeId && (
					<div style={{ margin: '16px 0' }}>
						<YouTubeViewer
							videoId={youtubeId}
							minimalControls={false}
							ref={ytRef}
							onTimeUpdate={(t, d) => {
								setYtCurrentTime(t);
								if (typeof d === 'number') setYtDuration(d);
							}}
						/>
						<TimeMarkers
							markers={timestamps}
							onMarkersChange={setTimestamps}
							getCurrentTime={() => ytRef.current && typeof ytRef.current.currentTime === 'number' ? ytRef.current.currentTime : ytCurrentTime}
							seekTo={t => {
								if (ytRef.current && typeof ytRef.current.handleSeek === 'function') {
									ytRef.current.handleSeek(t);
								}
							}}
						/>
					</div>
				)}
				<label>Lirik/Chord
					<textarea
						className="lyrics-editor"
						value={lyrics}
						onChange={e => setLyrics(e.target.value)}
						rows={8}
						placeholder="Contoh lirik dan chord..."
					/>
				</label>
				{error && <div className="error-text">{error}</div>}
				<button type="submit" className="btn-base tab-btn" style={{ marginTop: 18 }} disabled={loading}>
					{loading ? 'Menyimpan...' : (mode === 'edit' ? 'Simpan Perubahan' : 'Simpan Lagu')}
				</button>
			</form>

			{/* AI Autofill Modal */}
			<AIAutofillModal
				aiResult={aiResult}
				aiConfirmFields={aiConfirmFields}
				setAiConfirmFields={setAiConfirmFields}
				onApply={handleApplyAiFields}
				onClose={() => { setShowAiConfirm(false); setAiResult(null); }}
			/>
		</div>
	);
}

export default SongAddEditPage;
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, collection, doc, onSnapshot, setDoc, deleteDoc, query 
} from 'firebase/firestore';
import { 
  getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged 
} from 'firebase/auth';
import { 
  Plus, Search, Edit2, Trash2, List, FolderPlus, 
  Play, Pause, ChevronLeft, Save, Download, Upload, 
  Settings, Music, Mic2, X, ChevronRight, Hash, FileDown, FileUp, Printer,
  Youtube, MonitorPlay, ChevronDown, ChevronUp, Cloud, CloudOff, Loader2,
  ExternalLink
} from 'lucide-react';

// --- Konfigurasi Firebase ---
const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'ronz-chord-pro-v3';

// --- Konstanta Musik ---
const CHROMATIC_SCALE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const App = () => {
  // --- State Utama ---
  const [songs, setSongs] = useState([]);
  const [setlists, setSetlists] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- State Navigasi & UI ---
  const [view, setView] = useState('library'); 
  const [activeSong, setActiveSong] = useState(null);
  const [activeSetlist, setActiveSetlist] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddSetlistModal, setShowAddSetlistModal] = useState(false);
  const [songToAddToSetlist, setSongToAddToSetlist] = useState(null);
  const [editingSong, setEditingSong] = useState(null);
  const [statusMsg, setStatusMsg] = useState(null);
  const [showVideo, setShowVideo] = useState(false);

  // --- State Stage (Performance Mode) ---
  const [transpose, setTranspose] = useState(0);
  const [bpm, setBpm] = useState(120);
  const [isMetronomeActive, setIsMetronomeActive] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(0); 
  const [currentBeat, setCurrentBeat] = useState(0);

  const scrollRef = useRef(null);
  const audioCtx = useRef(null);

  // --- Firebase Auth (Rule 3) ---
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Auth Error:", error);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- Firestore Sync (Rule 1 & 2) ---
  useEffect(() => {
    if (!user) return;

    // Sinkronisasi Lagu
    const songsCol = collection(db, 'artifacts', appId, 'users', user.uid, 'songs');
    const unsubscribeSongs = onSnapshot(songsCol, (snapshot) => {
      const songsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSongs(songsData);
    }, (err) => console.error("Firestore Songs Error:", err));

    // Sinkronisasi Setlist
    const setlistsCol = collection(db, 'artifacts', appId, 'users', user.uid, 'setlists');
    const unsubscribeSetlists = onSnapshot(setlistsCol, (snapshot) => {
      const setlistsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSetlists(setlistsData);
      
      // Update activeSetlist if it's currently being viewed
      if (activeSetlist) {
        const updated = setlistsData.find(s => s.id === activeSetlist.id);
        if (updated) setActiveSetlist(updated);
      }
    }, (err) => console.error("Firestore Setlists Error:", err));

    return () => {
      unsubscribeSongs();
      unsubscribeSetlists();
    };
  }, [user, activeSetlist?.id]);

  const showStatus = (msg) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(null), 3000);
  };

  // --- Helper: YouTube ID Extractor ---
  const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const id = (match && match[2].length === 11) ? match[2] : null;
    return id ? `https://www.youtube.com/embed/${id}` : null;
  };

  // --- Transpose Logic ---
  const transposeChord = (text, steps) => {
    if (steps === 0) return text;
    const chordRegex = /[A-G][#b]?(m|maj|7|sus|add|dim|aug)?/g;
    return text.replace(chordRegex, (match) => {
      return match.replace(/[A-G][#b]?/, (root) => {
        let normalizedRoot = root.replace('b', (m) => CHROMATIC_SCALE[(CHROMATIC_SCALE.indexOf(m[0]) - 1 + 12) % 12]);
        let idx = CHROMATIC_SCALE.indexOf(normalizedRoot);
        if (idx === -1) return root;
        return CHROMATIC_SCALE[(idx + steps + 12) % 12];
      });
    });
  };

  // --- CRUD Operations ---
  const saveSong = async (songData) => {
    if (!user) return;
    const songId = songData.id || Date.now().toString();
    const songDoc = doc(db, 'artifacts', appId, 'users', user.uid, 'songs', songId);
    
    try {
      await setDoc(songDoc, {
        ...songData,
        id: songId,
        updatedAt: new Date().toISOString()
      });
      showStatus(songData.id ? "Lagu diperbarui!" : "Lagu baru disimpan!");
      setView('library');
      setEditingSong(null);
    } catch (err) {
      showStatus("Gagal menyimpan ke Cloud");
    }
  };

  const deleteSong = async (id) => {
    if (!user) return;
    if (confirm('Hapus lagu ini secara permanen dari Cloud?')) {
      try {
        const songDoc = doc(db, 'artifacts', appId, 'users', user.uid, 'songs', id);
        await deleteDoc(songDoc);
        showStatus("Lagu dihapus.");
      } catch (err) {
        showStatus("Gagal menghapus");
      }
    }
  };

  const createSetlist = async (name) => {
    if (!user || !name.trim()) return;
    const id = Date.now().toString();
    const slDoc = doc(db, 'artifacts', appId, 'users', user.uid, 'setlists', id);
    try {
      await setDoc(slDoc, { id, name, songIds: [] });
      setShowAddSetlistModal(false);
      showStatus("Setlist dibuat!");
    } catch (err) {
      showStatus("Gagal membuat setlist");
    }
  };

  const addSongToSetlist = async (setlistId, songId) => {
    if (!user) return;
    const targetSetlist = setlists.find(sl => sl.id === setlistId);
    if (targetSetlist && !targetSetlist.songIds.includes(songId)) {
      const slDoc = doc(db, 'artifacts', appId, 'users', user.uid, 'setlists', setlistId);
      try {
        await setDoc(slDoc, { ...targetSetlist, songIds: [...targetSetlist.songIds, songId] });
        setSongToAddToSetlist(null);
        showStatus("Berhasil ditambahkan!");
      } catch (err) {
        showStatus("Gagal update setlist");
      }
    } else {
      showStatus("Lagu sudah ada di setlist");
      setSongToAddToSetlist(null);
    }
  };

  const removeSongFromSetlist = async (setlistId, songId) => {
    if (!user) return;
    const targetSetlist = setlists.find(sl => sl.id === setlistId);
    if (targetSetlist) {
      const slDoc = doc(db, 'artifacts', appId, 'users', user.uid, 'setlists', setlistId);
      try {
        const updatedIds = targetSetlist.songIds.filter(id => id !== songId);
        await setDoc(slDoc, { ...targetSetlist, songIds: updatedIds });
        showStatus("Lagu dilepas dari setlist");
      } catch (err) {
        showStatus("Gagal menghapus lagu");
      }
    }
  };

  const deleteSetlist = async (id) => {
    if (!user) return;
    if (confirm('Hapus setlist ini?')) {
      try {
        const slDoc = doc(db, 'artifacts', appId, 'users', user.uid, 'setlists', id);
        await deleteDoc(slDoc);
        setView('library');
        showStatus("Setlist dihapus");
      } catch (err) {
        showStatus("Gagal menghapus setlist");
      }
    }
  };

  // --- Metronom & Scroll ---
  useEffect(() => {
    let interval;
    if (isMetronomeActive) {
      if (!audioCtx.current) audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
      const beatMs = 60000 / bpm;
      interval = setInterval(() => {
        const osc = audioCtx.current.createOscillator();
        const gain = audioCtx.current.createGain();
        osc.frequency.setValueAtTime(currentBeat % 4 === 0 ? 880 : 440, audioCtx.current.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.current.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(audioCtx.current.destination);
        osc.start();
        osc.stop(audioCtx.current.currentTime + 0.1);
        setCurrentBeat(prev => (prev + 1) % 4);
      }, beatMs);
    }
    return () => clearInterval(interval);
  }, [isMetronomeActive, bpm, currentBeat]);

  useEffect(() => {
    let scrollInterval;
    if (scrollSpeed > 0 && view === 'stage') {
      scrollInterval = setInterval(() => {
        if (scrollRef.current) scrollRef.current.scrollTop += 1;
      }, 100 / scrollSpeed);
    }
    return () => clearInterval(scrollInterval);
  }, [scrollSpeed, view]);

  const filteredSongs = useMemo(() => {
    return songs.filter(s => s.title?.toLowerCase().includes(searchTerm.toLowerCase()) || s.artist?.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [songs, searchTerm]);

  // --- Render Logic Detail Setlist ---
  const setlistSongs = useMemo(() => {
    if (!activeSetlist) return [];
    return activeSetlist.songIds
      .map(id => songs.find(s => s.id === id))
      .filter(Boolean); // Hanya ambil jika lagu ada di master library
  }, [activeSetlist, songs]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-zinc-500">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p className="font-bold tracking-widest text-xs uppercase">Connecting to Cloud...</p>
      </div>
    );
  }

  const Sidebar = () => (
    <div className="w-full lg:w-72 bg-zinc-950 border-r border-zinc-800 flex flex-col h-screen sticky top-0 z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
          <Music className="text-white" size={20} />
        </div>
        <div>
          <h1 className="font-black text-white tracking-tight">RONZ PRO</h1>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1">
            {user ? <Cloud size={10} className="text-emerald-500" /> : <CloudOff size={10} className="text-red-500" />}
            {user ? 'Cloud Sync' : 'Offline'}
          </p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar">
        <button onClick={() => setView('library')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'library' ? 'bg-indigo-600/10 text-indigo-400 font-bold' : 'text-zinc-400 hover:bg-zinc-900'}`}><Music size={18} /> Library</button>
        
        <div className="pt-6 pb-2 px-4 text-[10px] font-black text-zinc-600 uppercase tracking-widest flex justify-between items-center">
          Setlists
          <button onClick={() => setShowAddSetlistModal(true)} className="hover:text-indigo-500 transition-colors"><Plus size={14} /></button>
        </div>
        {setlists.map(sl => (
          <button key={sl.id} onClick={() => { setActiveSetlist(sl); setView('setlist-detail'); }} className={`w-full flex items-center justify-between group px-4 py-3 rounded-xl transition-all ${activeSetlist?.id === sl.id && view === 'setlist-detail' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:bg-zinc-900'}`}>
            <div className="flex items-center gap-3 truncate">
              <List size={16} className={activeSetlist?.id === sl.id ? 'text-indigo-400' : ''} />
              <span className="truncate text-sm">{sl.name}</span>
            </div>
            <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded-full">{sl.songIds?.length || 0}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <button onClick={() => { setEditingSong({ title: '', artist: '', key: 'C', bpm: 120, content: '', youtubeUrl: '' }); setView('editor'); }} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2">
          <Plus size={18} /> Lagu Baru
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-zinc-300 flex flex-col lg:flex-row font-sans selection:bg-indigo-500">
      {view !== 'stage' && <Sidebar />}

      {statusMsg && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[200] bg-indigo-600 text-white px-6 py-2 rounded-full font-bold shadow-2xl animate-in zoom-in-50 duration-200 text-sm">
          {statusMsg}
        </div>
      )}

      {/* --- View: Library --- */}
      {view === 'library' && (
        <main className="flex-1 p-6 lg:p-12 overflow-y-auto h-screen no-scrollbar animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="max-w-5xl mx-auto">
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 className="text-4xl font-black text-white mb-2">Library</h2>
                <p className="text-zinc-500 font-medium">Temukan koleksi lagu Anda di Cloud.</p>
              </div>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input type="text" placeholder="Cari lagu..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-600/50" />
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredSongs.map(song => (
                <div key={song.id} className="bg-zinc-900/40 border border-zinc-800 hover:border-zinc-600 p-6 rounded-[2rem] transition-all group relative flex flex-col justify-between cursor-pointer" onClick={() => { setActiveSong(song); setTranspose(0); setBpm(song.bpm || 120); setView('stage'); setShowVideo(false); }}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-zinc-800 rounded-2xl group-hover:bg-indigo-600 transition-colors">
                      <Music className="text-zinc-400 group-hover:text-white" size={20} />
                    </div>
                    {song.youtubeUrl && <Youtube className="text-red-500/50 group-hover:text-red-500" size={16} />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1 truncate group-hover:text-indigo-400">{song.title}</h3>
                    <p className="text-sm text-zinc-500 font-medium mb-6">{song.artist}</p>
                  </div>
                  <div className="flex gap-2 border-t border-zinc-800 pt-4">
                    <button onClick={(e) => { e.stopPropagation(); setSongToAddToSetlist(song); }} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500" title="Tambah ke Setlist"><FolderPlus size={18} /></button>
                    <button onClick={(e) => { e.stopPropagation(); setEditingSong(song); setView('editor'); }} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500" title="Edit Lagu"><Edit2 size={18} /></button>
                    <button onClick={(e) => { e.stopPropagation(); deleteSong(song.id); }} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-red-500 ml-auto"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {/* --- View: Setlist Detail --- */}
      {view === 'setlist-detail' && activeSetlist && (
        <main className="flex-1 p-6 lg:p-12 overflow-y-auto h-screen no-scrollbar animate-in fade-in duration-300">
          <div className="max-w-4xl mx-auto">
            <header className="mb-10 flex items-center justify-between border-b border-zinc-900 pb-8">
              <div className="flex items-center gap-4">
                <button onClick={() => setView('library')} className="p-3 bg-zinc-900 rounded-2xl text-zinc-400 hover:text-white"><ChevronLeft size={20}/></button>
                <div>
                  <h2 className="text-3xl font-black text-white">{activeSetlist.name}</h2>
                  <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest">{setlistSongs.length} Lagu dalam antrean</p>
                </div>
              </div>
              <button onClick={() => deleteSetlist(activeSetlist.id)} className="p-3 bg-zinc-900 hover:bg-red-600/20 text-zinc-500 hover:text-red-500 rounded-2xl transition-all">
                <Trash2 size={20} />
              </button>
            </header>

            <div className="space-y-3">
              {setlistSongs.length > 0 ? (
                setlistSongs.map((song, idx) => (
                  <div key={song.id} className="group flex items-center gap-4 p-4 bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 rounded-2xl transition-all">
                    <div className="w-10 h-10 bg-zinc-950 flex items-center justify-center rounded-xl text-zinc-600 font-black text-xs group-hover:text-indigo-400">
                      {idx + 1}
                    </div>
                    <div className="flex-1 truncate" onClick={() => { setActiveSong(song); setTranspose(0); setBpm(song.bpm || 120); setView('stage'); }}>
                      <h4 className="font-bold text-white group-hover:text-indigo-400 cursor-pointer">{song.title}</h4>
                      <p className="text-xs text-zinc-500">{song.artist}</p>
                    </div>
                    <div className="flex items-center gap-2">
                       <button onClick={() => { setActiveSong(song); setTranspose(0); setBpm(song.bpm || 120); setView('stage'); }} className="p-3 bg-zinc-950 hover:bg-indigo-600 text-zinc-500 hover:text-white rounded-xl transition-all">
                         <Play size={16} fill="currentColor" />
                       </button>
                       <button onClick={() => removeSongFromSetlist(activeSetlist.id, song.id)} className="p-3 hover:bg-zinc-800 text-zinc-700 hover:text-red-500 rounded-xl transition-all">
                         <X size={16} />
                       </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center border-2 border-dashed border-zinc-900 rounded-[3rem]">
                  <List className="mx-auto text-zinc-800 mb-4" size={48} />
                  <p className="text-zinc-600 font-bold uppercase text-xs tracking-widest mb-4">Setlist Kosong</p>
                  <button onClick={() => setView('library')} className="px-6 py-2 bg-zinc-900 text-zinc-400 rounded-full text-xs font-bold hover:text-white transition-all">Tambah Lagu dari Library</button>
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      {/* --- View: Editor (Tetap sama dengan V3) --- */}
      {view === 'editor' && editingSong && (
        <main className="flex-1 p-6 lg:p-12 overflow-y-auto h-screen no-scrollbar animate-in fade-in duration-300">
          <div className="max-w-3xl mx-auto">
            <header className="mb-10 flex items-center justify-between">
              <h2 className="text-3xl font-black text-white">Editor Lagu</h2>
              <div className="flex gap-2">
                <button onClick={() => setView('library')} className="px-6 py-3 text-zinc-400 font-bold uppercase text-[10px]">Batal</button>
                <button onClick={() => saveSong(editingSong)} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-black uppercase text-[10px] shadow-lg shadow-indigo-600/20">Simpan Ke Cloud</button>
              </div>
            </header>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase px-1">Judul Lagu</label>
                  <input className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white focus:border-indigo-600 outline-none" value={editingSong.title} onChange={(e) => setEditingSong({...editingSong, title: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase px-1">Artis</label>
                  <input className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white focus:border-indigo-600 outline-none" value={editingSong.artist} onChange={(e) => setEditingSong({...editingSong, artist: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase px-1">Key</label>
                  <input className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white text-center outline-none" value={editingSong.key} onChange={(e) => setEditingSong({...editingSong, key: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase px-1">BPM</label>
                  <input type="number" className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white text-center outline-none" value={editingSong.bpm} onChange={(e) => setEditingSong({...editingSong, bpm: parseInt(e.target.value) || 120})} />
                </div>
                <div className="space-y-2 md:col-span-1 col-span-2">
                  <label className="text-[10px] font-black text-red-500 uppercase px-1 flex items-center gap-1"><Youtube size={12}/> Link YouTube</label>
                  <input placeholder="https://youtube.com/watch?v=..." className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white focus:border-red-600 outline-none" value={editingSong.youtubeUrl || ''} onChange={(e) => setEditingSong({...editingSong, youtubeUrl: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase px-1">Lirik & Chord</label>
                <textarea className="w-full h-96 bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 text-white font-mono text-sm leading-relaxed no-scrollbar outline-none focus:border-indigo-600" value={editingSong.content} onChange={(e) => setEditingSong({...editingSong, content: e.target.value})} />
              </div>
            </div>
          </div>
        </main>
      )}

      {/* --- View: Stage (Tetap sama dengan V3) --- */}
      {view === 'stage' && activeSong && (
        <div className="fixed inset-0 bg-black z-[60] flex flex-col animate-in fade-in duration-500">
          <header className="p-4 border-b border-zinc-900 bg-black/80 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => { setView(activeSetlist ? 'setlist-detail' : 'library'); setIsMetronomeActive(false); setScrollSpeed(0); }} className="p-3 bg-zinc-900 rounded-2xl text-zinc-400 hover:text-white"><ChevronLeft size={20} /></button>
              <div className="hidden sm:block">
                <h2 className="font-bold text-white leading-none mb-1">{activeSong.title}</h2>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{activeSong.artist}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {activeSong.youtubeUrl && (
                <button onClick={() => setShowVideo(!showVideo)} className={`p-3 rounded-2xl flex items-center gap-2 font-bold text-xs uppercase transition-all ${showVideo ? 'bg-red-600 text-white' : 'bg-zinc-900 text-red-500 hover:bg-zinc-800'}`}>
                  <Youtube size={18} /> <span className="hidden md:inline">Video</span>
                </button>
              )}
              
              <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-2 gap-4">
                <button onClick={() => setIsMetronomeActive(!isMetronomeActive)} className={`flex items-center gap-3 text-[10px] font-black uppercase transition-all ${isMetronomeActive ? 'text-indigo-400' : 'text-zinc-600'}`}>
                  <div className={`w-2 h-2 bg-current rounded-full ${isMetronomeActive ? 'animate-pulse' : ''}`} /> {bpm} BPM
                </button>
                <div className="flex items-center gap-2">
                  <Play size={12} className={scrollSpeed > 0 ? 'text-indigo-400' : 'text-zinc-600'} />
                  <input type="range" min="0" max="10" step="1" value={scrollSpeed} onChange={(e) => setScrollSpeed(parseInt(e.target.value))} className="w-12 h-1 accent-indigo-500" />
                </div>
              </div>

              <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-2xl px-2 py-1">
                <button onClick={() => setTranspose(prev => prev - 1)} className="p-2 text-zinc-500 hover:text-white"><X size={14} className="rotate-45" /></button>
                <span className="w-8 text-center text-xs font-black text-indigo-400">{transpose > 0 ? `+${transpose}` : transpose}</span>
                <button onClick={() => setTranspose(prev => prev + 1)} className="p-2 text-zinc-500 hover:text-white"><Plus size={14} /></button>
              </div>
            </div>
          </header>

          <main ref={scrollRef} className="flex-1 overflow-y-auto p-8 lg:px-[20%] lg:py-16 no-scrollbar select-none cursor-ns-resize relative">
            {showVideo && activeSong.youtubeUrl && (
              <div className="fixed bottom-6 right-6 w-72 md:w-96 aspect-video bg-zinc-900 border-2 border-zinc-800 rounded-2xl overflow-hidden shadow-2xl z-[70] animate-in slide-in-from-bottom-4 duration-300">
                <div className="bg-zinc-800 px-3 py-1 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-zinc-400">Reference</span>
                  <button onClick={() => setShowVideo(false)} className="text-zinc-400 hover:text-white"><X size={14}/></button>
                </div>
                <iframe className="w-full h-full" src={getYoutubeEmbedUrl(activeSong.youtubeUrl)} title="YouTube player" frameBorder="0" allowFullScreen></iframe>
              </div>
            )}

            <div className="max-w-4xl mx-auto space-y-1">
              {activeSong.content.split('\n').map((line, i) => {
                const isChord = /[A-G]/.test(line) && line.length < 60 && line.includes('  ');
                const isHeading = line.trim().startsWith('[') && line.trim().endsWith(']');
                if (isHeading) return <div key={i} className="text-xs font-black text-amber-500 uppercase tracking-[0.2em] mt-8 mb-4 border-b border-amber-500/20 pb-1">{line.replace(/[\[\]]/g, '')}</div>;
                if (isChord) return <pre key={i} className="font-mono text-xl md:text-2xl font-black text-indigo-400 leading-none h-8 flex items-end">{transposeChord(line, transpose)}</pre>;
                return <pre key={i} className="font-sans text-xl md:text-2xl font-medium text-zinc-300 mb-6 whitespace-pre-wrap">{line || ' '}</pre>;
              })}
              <div className="h-96" />
            </div>
          </main>
        </div>
      )}

      {/* --- Modals --- */}
      {showAddSetlistModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl">
            <h3 className="text-xl font-black text-white mb-6 uppercase tracking-tight">Setlist Baru</h3>
            <input id="new-setlist-name" className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-white outline-none focus:border-indigo-600 mb-6" placeholder="Misal: Latihan Minggu..." autoFocus />
            <div className="flex gap-4">
              <button onClick={() => setShowAddSetlistModal(false)} className="flex-1 py-3 text-zinc-500 font-bold text-xs uppercase">Batal</button>
              <button onClick={() => createSetlist(document.getElementById('new-setlist-name').value)} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase shadow-lg shadow-indigo-600/20">Buat</button>
            </div>
          </div>
        </div>
      )}

      {songToAddToSetlist && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-black text-zinc-500 uppercase tracking-widest">Pilih Setlist</h3>
              <button onClick={() => setSongToAddToSetlist(null)} className="text-zinc-500 hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto no-scrollbar">
              {setlists.map(sl => (
                <button key={sl.id} onClick={() => addSongToSetlist(sl.id, songToAddToSetlist.id)} className="w-full flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-2xl hover:bg-indigo-600 hover:border-indigo-500 transition-all group">
                  <span className="font-bold text-zinc-300 group-hover:text-white truncate">{sl.name}</span>
                  <Plus size={16} className="text-zinc-700 group-hover:text-white" />
                </button>
              ))}
              {setlists.length === 0 && <p className="text-center text-zinc-600 py-4 text-xs font-bold">Belum ada setlist. Buat dulu di sidebar.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
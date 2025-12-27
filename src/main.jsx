import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';
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

// --- Global Config ---
const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'ronz-chord-pro-v3';

const CHROMATIC_SCALE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const App = () => {
  // --- States ---
  const [songs, setSongs] = useState([]);
  const [setlists, setSetlists] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('library'); 
  const [activeSong, setActiveSong] = useState(null);
  const [activeSetlist, setActiveSetlist] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddSetlistModal, setShowAddSetlistModal] = useState(false);
  const [songToAddToSetlist, setSongToAddToSetlist] = useState(null);
  const [editingSong, setEditingSong] = useState(null);
  const [statusMsg, setStatusMsg] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [transpose, setTranspose] = useState(0);
  const [bpm, setBpm] = useState(120);
  const [isMetronomeActive, setIsMetronomeActive] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(0); 
  const [currentBeat, setCurrentBeat] = useState(0);

  const scrollRef = useRef(null);
  const audioCtx = useRef(null);

  // --- Auth (Rule 3) ---
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

    const songsCol = collection(db, 'artifacts', appId, 'users', user.uid, 'songs');
    const unsubscribeSongs = onSnapshot(songsCol, (snapshot) => {
      const songsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSongs(songsData);
    }, (err) => console.error("Songs Error:", err));

    const setlistsCol = collection(db, 'artifacts', appId, 'users', user.uid, 'setlists');
    const unsubscribeSetlists = onSnapshot(setlistsCol, (snapshot) => {
      const setlistsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSetlists(setlistsData);
      if (activeSetlist) {
        const updated = setlistsData.find(s => s.id === activeSetlist.id);
        if (updated) setActiveSetlist(updated);
      }
    }, (err) => console.error("Setlists Error:", err));

    return () => {
      unsubscribeSongs();
      unsubscribeSetlists();
    };
  }, [user, activeSetlist?.id]);

  const showStatus = (msg) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const id = (match && match[2].length === 11) ? match[2] : null;
    return id ? `https://www.youtube.com/embed/${id}` : null;
  };

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

  const saveSong = async (songData) => {
    if (!user) return;
    const songId = songData.id || Date.now().toString();
    const songDoc = doc(db, 'artifacts', appId, 'users', user.uid, 'songs', songId);
    try {
      await setDoc(songDoc, { ...songData, id: songId, updatedAt: new Date().toISOString() });
      showStatus("Lagu disimpan!");
      setView('library');
      setEditingSong(null);
    } catch (err) { showStatus("Gagal menyimpan"); }
  };

  const addSongToSetlist = async (setlistId, songId) => {
    if (!user) return;
    const sl = setlists.find(s => s.id === setlistId);
    if (sl && !sl.songIds.includes(songId)) {
      const slDoc = doc(db, 'artifacts', appId, 'users', user.uid, 'setlists', setlistId);
      await setDoc(slDoc, { ...sl, songIds: [...sl.songIds, songId] });
      setSongToAddToSetlist(null);
      showStatus("Ditambahkan ke setlist!");
    }
  };

  const filteredSongs = useMemo(() => {
    return songs.filter(s => 
      s.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.artist?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [songs, searchTerm]);

  const setlistSongs = useMemo(() => {
    if (!activeSetlist) return [];
    return (activeSetlist.songIds || [])
      .map(id => songs.find(s => s.id === id))
      .filter(Boolean);
  }, [activeSetlist, songs]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-zinc-500">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p className="font-bold tracking-widest text-xs uppercase">Menghubungkan ke Cloud...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-zinc-300 flex flex-col lg:flex-row font-sans selection:bg-indigo-500">
      {/* Sidebar */}
      <div className="w-full lg:w-72 bg-zinc-950 border-r border-zinc-800 flex flex-col h-screen sticky top-0 z-50">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <Music className="text-white" size={20} />
          </div>
          <div>
            <h1 className="font-black text-white tracking-tight">RONZ PRO</h1>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1">
              <Cloud size={10} className="text-emerald-500" /> Cloud Sync
            </p>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar">
          <button onClick={() => setView('library')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'library' ? 'bg-indigo-600/10 text-indigo-400 font-bold' : 'text-zinc-400 hover:bg-zinc-900'}`}><Music size={18} /> Library</button>
          <div className="pt-6 pb-2 px-4 text-[10px] font-black text-zinc-600 uppercase tracking-widest">Setlists</div>
          {setlists.map(sl => (
            <button key={sl.id} onClick={() => { setActiveSetlist(sl); setView('setlist-detail'); }} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeSetlist?.id === sl.id && view === 'setlist-detail' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:bg-zinc-900'}`}>
              <span className="truncate text-sm">{sl.name}</span>
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

      {statusMsg && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[200] bg-indigo-600 text-white px-6 py-2 rounded-full font-bold shadow-2xl text-sm">
          {statusMsg}
        </div>
      )}

      {/* Main View Logic */}
      <div className="flex-1 overflow-y-auto h-screen relative">
        {view === 'library' && (
          <main className="p-6 lg:p-12 animate-in fade-in duration-500">
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 className="text-4xl font-black text-white mb-2">Library</h2>
                <p className="text-zinc-500 font-medium">Koleksi lagu tersimpan di Cloud.</p>
              </div>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input type="text" placeholder="Cari lagu..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none" />
              </div>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredSongs.map(song => (
                <div key={song.id} className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-[2rem] hover:border-indigo-500 transition-all group" onClick={() => { setActiveSong(song); setTranspose(0); setView('stage'); }}>
                  <div className="p-3 bg-zinc-800 w-fit rounded-2xl mb-4 group-hover:bg-indigo-600 transition-colors">
                    <Music className="text-zinc-400 group-hover:text-white" size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1 truncate">{song.title}</h3>
                  <p className="text-sm text-zinc-500 font-medium mb-4">{song.artist}</p>
                  <div className="flex gap-2 border-t border-zinc-800 pt-4" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => setSongToAddToSetlist(song)} className="p-2 text-zinc-500 hover:text-indigo-400"><FolderPlus size={18}/></button>
                    <button onClick={() => { setEditingSong(song); setView('editor'); }} className="p-2 text-zinc-500 hover:text-indigo-400"><Edit2 size={18}/></button>
                  </div>
                </div>
              ))}
            </div>
          </main>
        )}

        {view === 'setlist-detail' && activeSetlist && (
          <main className="p-6 lg:p-12 animate-in fade-in duration-300">
            <header className="mb-10 flex items-center gap-4">
              <button onClick={() => setView('library')} className="p-3 bg-zinc-900 rounded-2xl text-zinc-400"><ChevronLeft size={20}/></button>
              <h2 className="text-3xl font-black text-white">{activeSetlist.name}</h2>
            </header>
            <div className="space-y-3">
              {setlistSongs.map((song, idx) => (
                <div key={song.id} className="flex items-center gap-4 p-4 bg-zinc-900/40 border border-zinc-800 rounded-2xl">
                  <span className="w-8 text-zinc-600 font-black">{idx + 1}</span>
                  <div className="flex-1">
                    <h4 className="font-bold text-white">{song.title}</h4>
                    <p className="text-xs text-zinc-500">{song.artist}</p>
                  </div>
                  <button onClick={() => { setActiveSong(song); setView('stage'); }} className="p-3 bg-indigo-600 text-white rounded-xl"><Play size={16} fill="white"/></button>
                </div>
              ))}
            </div>
          </main>
        )}

        {view === 'editor' && editingSong && (
          <main className="p-6 lg:p-12 animate-in fade-in duration-300">
            <header className="mb-10 flex items-center justify-between">
              <h2 className="text-3xl font-black text-white">Editor Lagu</h2>
              <div className="flex gap-4">
                <button onClick={() => setView('library')} className="text-zinc-500 font-bold uppercase text-xs">Batal</button>
                <button onClick={() => saveSong(editingSong)} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase shadow-lg shadow-indigo-600/20">Simpan</button>
              </div>
            </header>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <input className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white outline-none" placeholder="Judul" value={editingSong.title} onChange={e => setEditingSong({...editingSong, title: e.target.value})} />
                <input className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white outline-none" placeholder="Artis" value={editingSong.artist} onChange={e => setEditingSong({...editingSong, artist: e.target.value})} />
              </div>
              <textarea className="w-full h-96 bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 text-white font-mono text-sm outline-none" placeholder="Isi lirik & chord..." value={editingSong.content} onChange={e => setEditingSong({...editingSong, content: e.target.value})} />
            </div>
          </main>
        )}
      </div>

      {/* Modals */}
      {songToAddToSetlist && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-sm rounded-[2.5rem] p-8">
            <h3 className="text-sm font-black text-zinc-500 uppercase tracking-widest mb-6">Pilih Setlist</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto no-scrollbar">
              {setlists.map(sl => (
                <button key={sl.id} onClick={() => addSongToSetlist(sl.id, songToAddToSetlist.id)} className="w-full flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-2xl hover:bg-indigo-600 hover:border-indigo-500 transition-all group">
                  <span className="font-bold text-zinc-300 group-hover:text-white truncate">{sl.name}</span>
                  <Plus size={16} className="text-zinc-700 group-hover:text-white" />
                </button>
              ))}
              <button onClick={() => setSongToAddToSetlist(null)} className="w-full py-3 text-zinc-600 text-xs font-bold uppercase mt-4">Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Fixed Render logic
const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
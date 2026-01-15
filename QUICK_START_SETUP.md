# 🚀 QUICK START - RoNz Chord Pro

**Waktu Setup:** 5-10 menit (tanpa API keys) | 20 menit (dengan AI features)

---

## ⚡ Langkah 1: Install & Run (5 menit)

### Install Dependencies

```bash
cd ronz-chord-pro
npm install
```

### Start Development Server

```bash
npm run dev
```

**Aplikasi siap di:** `http://localhost:5173`

---

## ✨ Fitur yang Langsung Bisa Dipakai (TANPA Setup API)

Ketika Anda jalankan `npm run dev`, semua fitur ini **LANGSUNG BISA DIGUNAKAN**:

✅ **View & Play Music**

- Lihat daftar lagu
- Buka dan tampilkan chord & lirik
- Transpose chord (Arrow up/down atau tombol +/-)

✅ **Search & Filter**

- Cari lagu berdasarkan judul, artis, atau lirik
- Filter otomatis saat mengetik

✅ **Keyboard Shortcuts**

- Tekan `?` untuk melihat semua shortcuts
- `Ctrl+F` untuk search
- Arrow keys untuk navigasi
- `T` untuk transpose besar

✅ **Set List Management**

- Buat daftar lagu untuk performa
- Simpan otomatis ke local storage

✅ **Song Editing**

- Tambah lagu baru
- Edit lirik dan chord
- Input notasi melodi (not angka/balok)

✅ **UI Features**

- Dark/light mode toggle
- Auto scroll dengan kecepatan custom
- Mobile responsive
- Chord highlighting

---

## 🤖 Langkah 2: Setup AI Assistant (OPTIONAL - 15 menit)

### Apa itu AI Assistant?

Tombol 🤖 di form edit lagu yang otomatis:

- Cari video YouTube berdasarkan judul & artis
- Auto-fill kunci musik (Key)
- Auto-fill tempo (BPM)
- Auto-fill gaya musik (Style)
- Kasih links ke 3 database chord

### Setup (Hanya 3 Langkah)

**Step 1: Buat `.env.local` file**

Di folder root (same level as `package.json`), buat file bernama `.env.local`:

```env
VITE_YOUTUBE_API_KEY=your_youtube_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

**Step 2: Get API Keys**

**YouTube API Key (WAJIB untuk video search):**

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project
3. Enable "YouTube Data API v3"
4. Create API Key in Credentials
5. Copy key to `.env.local`

[Lihat tutorial lengkap → ENV_SETUP.md](ENV_SETUP.md)

**Gemini API Key (OPTIONAL untuk key/tempo/style):**

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Get API Key"
3. Create new API key
4. Copy ke `.env.local`

**Step 3: Restart Server**

```bash
npm run dev
```

Clear browser cache (Ctrl+Shift+Del) untuk force reload.

### Test AI Assistant

1. Buka "Tambah Lagu Baru" atau edit lagu
2. Isi judul dan artis (misal: "Imagine" "John Lennon")
3. Klik tombol 🤖 **AI**
4. Klik "🔍 Cari Informasi Lagu"
5. Lihat hasilnya! ✨

---

## 📚 Dokumentasi per Feature

### Untuk Pengguna (Musicians)

| Fitur                  | Dokumentasi                                            | Waktu Baca |
| ---------------------- | ------------------------------------------------------ | ---------- |
| **Keyboard Shortcuts** | [KEYBOARD_SHORTCUTS.md](KEYBOARD_SHORTCUTS.md)         | 3 min      |
| **AI Assistant**       | [AI_ASSISTANT_QUICK_REF.md](AI_ASSISTANT_QUICK_REF.md) | 5 min      |
| **Bulk Add Songs**     | [BULK_ADD_SONGS.md](BULK_ADD_SONGS.md)                 | 5 min      |
| **Melody Notation**    | [MELODY_NOTATION_GUIDE.md](MELODY_NOTATION_GUIDE.md)   | 5 min      |
| **Keyboard Display**   | [KEYBOARD_MODE_GUIDE.md](KEYBOARD_MODE_GUIDE.md)       | 3 min      |

### Untuk Developers

| Topic                    | Dokumentasi                                        | Waktu Baca |
| ------------------------ | -------------------------------------------------- | ---------- |
| **Setup Lengkap**        | [ENV_SETUP.md](ENV_SETUP.md)                       | 10 min     |
| **Development**          | [DEVELOPERS_GUIDE.md](DEVELOPERS_GUIDE.md)         | 15 min     |
| **Architecture**         | [AI_ASSISTANT.md](AI_ASSISTANT.md)                 | 20 min     |
| **Performance**          | [VIRTUAL_SCROLLING.md](VIRTUAL_SCROLLING.md)       | 10 min     |
| **PWA & Service Worker** | [SERVICE_WORKER_GUIDE.md](SERVICE_WORKER_GUIDE.md) | 10 min     |

---

## 🔧 Build untuk Production

### Development Build

```bash
npm run dev
# Runs at http://localhost:5173
```

### Production Build

```bash
npm run build
# Creates optimized build in 'dist' folder
```

### Preview Production Build

```bash
npm run preview
# Preview at http://localhost:4173
```

### Deploy Options

- **Vercel:** Push ke GitHub, auto-deploy
- **Netlify:** Connect GitHub repo, auto-build
- **Traditional:** Upload `dist` folder ke web server
- **Docker:** Build container image

---

## 🎯 Checklist: First Time Setup

- [ ] Run `npm install`
- [ ] Run `npm run dev`
- [ ] Buka `http://localhost:5173` di browser
- [ ] Lihat daftar lagu dan coba play
- [ ] Coba keyboard shortcuts (tekan `?`)
- [ ] (Optional) Setup API keys untuk AI features
- [ ] (Optional) Baca [KEYBOARD_SHORTCUTS.md](KEYBOARD_SHORTCUTS.md) untuk master shortcuts

---

## ❓ Troubleshooting

### Port 5173 sudah dipakai?

```bash
# Run di port berbeda
npm run dev -- --port 3000
```

### API Key tidak bekerja?

1. Buat file `.env.local` (bukan `.env`)
2. Pastikan key benar (copy dari console tanpa typo)
3. Restart server: `npm run dev`
4. Clear browser cache: `Ctrl+Shift+Del`

### Lagu tidak muncul?

1. Cek console browser (F12)
2. Cek apakah database sudah ter-load
3. Coba refresh page (Ctrl+R)

### Performance lambat?

1. Cek "Performance Mode" di Settings
2. Reduce lagu list size (export to new setlist)
3. Clear browser cache dan cookies

---

## 📞 Next Steps

**Setelah setup:**

1. ✅ Explore semua fitur di aplikasi
2. ✅ Set preferences di Settings modal (gear icon)
3. ✅ Setup shortcuts yang sering dipakai
4. ✅ Create setlists untuk setlists yang sering dimainkan
5. ✅ Backup setlists (export function)

**Untuk development:**

1. ✅ Baca [DEVELOPERS_GUIDE.md](DEVELOPERS_GUIDE.md)
2. ✅ Pelajari hook patterns di `src/hooks/`
3. ✅ Explore API routes di `api/` folder
4. ✅ Customize styling di `src/` CSS files

---

## 🎉 Enjoy!

Aplikasi ini memiliki **20+ features** yang powerful. Mulai dari yang basic dan explore sesuai kebutuhan Anda.

**Pertanyaan?** Lihat dokumentasi yang relevan atau buka GitHub issues.

---

**Status: PRODUCTION READY** ✅
Dibuat: 15 Januari 2026

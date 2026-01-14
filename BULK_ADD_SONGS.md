# 📝 Bulk Add Songs to Setlist Feature

## Overview

Fitur **Bulk Add Songs** memungkinkan Anda menambahkan banyak lagu ke setlist sekaligus dengan cara yang efisien dan intuitif. Cukup ketikkan atau paste daftar nama lagu, dan aplikasi akan otomatis mencari lagu yang ada dan menandai mana yang sudah ada dan mana yang belum.

## How to Use

### 1. **Buka Setlist**

- Navigasi ke tab **🎵 Setlist**
- Pilih setlist yang ingin ditambahi lagu
- Klik tombol **📝 (Tambah Lagu dari Daftar)** di sebelah tombol ➕

### 2. **Input Daftar Lagu**

Daftar lagu dapat diformat dengan:

- **Satu per baris:**
  ```
  Lagu Pertama
  Lagu Kedua
  Lagu Ketiga
  ```
- **Pemisah koma:**
  ```
  Lagu Satu, Lagu Dua, Lagu Tiga
  ```
- **Pemisah semicolon atau pipe:**
  ```
  Lagu A; Lagu B | Lagu C
  ```

### 3. **Cari Lagu**

- Klik tombol **🔍 Cari Lagu**
- Aplikasi akan otomatis:
  - Membersihkan dan memformat setiap nama lagu
  - Mencari kecocokan di database lagu Anda
  - Mendeteksi lagu yang sudah ada di setlist

### 4. **Review Hasil**

Setiap lagu akan ditampilkan dengan status:

| Status      | Indikator     | Arti                                           |
| ----------- | ------------- | ---------------------------------------------- |
| ✓ Ditemukan | Border hijau  | Lagu ditemukan dan siap ditambahkan            |
| ⚠️ Duplikat | Border kuning | Lagu sudah ada di setlist ini                  |
| ⏳ Pending  | Border putus  | Lagu tidak ada - akan disimpan sebagai pending |

### 5. **Tambahkan ke Setlist**

- Klik **✓ Tambah X Lagu** untuk menambahkan semua lagu:
  - Lagu yang ditemukan langsung ditambahkan ke setlist
  - Lagu yang belum ada disimpan sebagai **pending** dengan status "⏳"
- Lagu pending akan muncul di bagian terpisah di sebelah lagu normal
- Klik **➕ Buat Sekarang** pada lagu pending untuk membuat lagu baru

## Pending Songs System

Sistem **Pending Songs** memungkinkan Anda menyimpan daftar lagu yang ingin ditambahkan bahkan sebelum lagu tersebut ada di database.

### Workflow Pending Songs:

1. **Bulk Add Lagu yang Belum Ada**

   ```
   Input: Lagu A, Lagu Baru, Lagu C
   Hasil: Lagu A & C ditambah (ada)
          Lagu Baru ditambah sebagai pending
   ```

2. **View Pending Songs**

   - Muncul di bagian terpisah dengan label "⏳ Lagu Pending"
   - Ditampilkan dengan border dashed dan warna berbeda
   - Berguna untuk track lagu yang perlu dibuat

3. **Buat Lagu Pending**

   - Klik **➕ Buat Sekarang** pada lagu pending
   - Song form akan terbuka dengan nama pre-filled
   - Lengkapi chord, lirik, dan informasi lagu
   - Saat disimpan, otomatis replace pending entry dengan actual song ID

4. **Hapus Lagu Pending**
   - Klik **✕ Hapus** untuk menghapus dari setlist
   - Tidak menghapus lagu dari database (jika sudah ada)

### Benefits:

- ✅ **Workflow Fleksibel** - Tambah semua lagu terlebih dahulu, buat nanti
- ✅ **Tidak Terputus** - Setlist tetap lengkap meskipun beberapa lagu belum dibuat
- ✅ **Track Pending** - Lihat mana lagu yang masih perlu dibuat
- ✅ **Quick Add** - Klik "Buat Sekarang" untuk cepat menambah lagu baru

## Features

### Smart Search Algorithm

- **Partial matching**: Mencocokkan sebagian nama lagu (case-insensitive)
- **Bidirectional matching**: Mencari jika search term ada di nama lagu atau sebaliknya
- Contoh: Mencari "Jadi" akan menemukan "Jadilah Terang"

### Duplicate Detection

- Otomatis mendeteksi lagu yang sudah ada di setlist
- Mencegah penambahan duplikat
- Menampilkan jumlah lagu yang sudah ada

### Batch Addition

- Menambahkan beberapa lagu sekaligus dengan satu klik
- Sinkronisasi otomatis dengan backend
- Toast notification untuk konfirmasi

### Add New Song

- Tombol **➕ Tambah Baru** untuk lagu yang tidak ditemukan
- Membuka song form dengan nama pre-filled (dalam pengembangan)

## Summary Stats

Setelah pencarian, Anda akan melihat ringkasan:

```
✓ Ditemukan & bisa ditambah: 3
⚠️ Sudah ada di setlist: 1
⏳ Menunggu ditambah (pending): 2
```

## Example Workflow

### Scenario: Menambah Setlist untuk Kebaktian Minggu

**Input:**

```
Jadilah Terang
Ajaib Ajaib
Cinta Sejati
Damai Sejahtera
Yang Baru Tuhan Buat
```

**Hasil Pencarian:**

- ✓ Jadilah Terang (ditemukan - akan ditambah)
- ✓ Ajaib Ajaib (ditemukan - akan ditambah)
- ⏳ Cinta Sejati (tidak ditemukan - akan disimpan pending)
- ✓ Damai Sejahtera (ditemukan - akan ditambah)
- ⚠️ Yang Baru Tuhan Buat (sudah ada - tidak akan ditambah)

**Aksi:**

- Klik **✓ Tambah 4 Lagu** → Menambahkan 3 lagu actual + 1 pending
- Setelah berhasil:
  - Setlist sekarang punya 3 lagu aktual + 1 lagu pending
  - Lihat "Cinta Sejati" di bagian "⏳ Lagu Pending"
  - Klik **➕ Buat Sekarang** untuk membuat lagu baru
  - Form terbuka dengan nama "Cinta Sejati" sudah terisi
  - Lengkapi chord, lirik, artis, dan key
  - Saat simpan, Cinta Sejati replace pending entry

### Scenario: Bulk Import dari Playlist Lain

**Workflow:**

1. Copy seluruh daftar lagu dari playlist/setlist eksternal
2. Paste ke BulkAddSongs modal
3. Klik "Cari Lagu"
4. Lihat hasil:
   - Lagu yang ada sudah ditambahkan ke setlist
   - Lagu baru muncul sebagai pending untuk dibuat nanti
5. Nanti ketika punya waktu, buat lagu pending satu per satu

**Benefit:** Setlist instan + track lagu apa yang masih perlu dibuat

**Action:**

- Klik **✓ Tambah 3 Lagu** → Ditambahkan ke setlist
- Klik **➕ Tambah Baru** untuk "Cinta Sejati" → Buat lagu baru
- "Yang Baru Tuhan Buat" otomatis dilewati

## Tips & Tricks

### 1. **Format Nama Lagu**

- Gunakan nama resmi lagu untuk hasil terbaik
- Jangan perlu huruf kapital yang sempurna (case-insensitive)
- Contoh: "jadilah terang", "JADILAH TERANG", "Jadilah Terang" → Semua match

### 2. **Copy-Paste dari Setlist Lain**

- Jika punya daftar lagu dari setlist eksternal
- Cukup copy-paste semua nama lagu
- Aplikasi akan otomatis memformat

### 3. **Batch Edit**

- Lebih cepat dari menambahkan satu-satu
- Dapat 5-10 lagu sekaligus
- Ideal untuk membuat setlist dari playlist existing

### 4. **Validasi Data**

- Review hasil pencarian sebelum klik "Tambah"
- Pastikan tidak ada typo di nama lagu
- Tambahkan lagu baru yang tidak ditemukan agar tetap tersimpan

## Technical Details

### Search Algorithm

```javascript
// Pencarian dilakukan dengan:
// 1. Normalize: lowercase
// 2. Check if search string includes song name
// 3. OR check if song name includes search string
// 4. This allows both "Jadi" → "Jadilah" dan "Jadilah Tuhan" → "Jadilah"
```

### Duplicate Prevention

- Menggunakan `Set` untuk menghindari duplikat ID
- Membandingkan dengan `setlist.songs` array
- Menampilkan warning untuk lagu duplikat

### Batch Sync

- Menambahkan semua lagu sekaligus ke state
- Single API call untuk `PUT /api/setlists/{id}`
- Toast notification setelah berhasil

## Limitations

### Current Version

- ✅ **Pending Songs System** - Lagu belum ada otomatis disimpan (NEW!)
- ❌ Tidak support drag-reorder setelah bulk add (gunakan setlist view)
- ❌ Tidak support import dari file/URL langsung
- ❌ Search tidak support fuzzy matching (exact word matching)

### Future Enhancements

- ✅ Auto-link pending songs ketika lagu baru dibuat dengan nama matching
- ✅ Bulk create untuk pending songs (buat beberapa sekaligus)
- ✅ Fuzzy matching untuk hasil lebih fleksibel
- ✅ Import dari file CSV/TXT
- ✅ Bulk edit pending songs dengan drag-reorder
- ✅ Template untuk pending songs (artist, key, dll)

## Browser Support

| Browser | Support | Notes               |
| ------- | ------- | ------------------- |
| Chrome  | ✓ Full  | Semua fitur bekerja |
| Firefox | ✓ Full  | Semua fitur bekerja |
| Safari  | ✓ Full  | Semua fitur bekerja |
| Edge    | ✓ Full  | Semua fitur bekerja |
| Mobile  | ✓ Full  | Responsive modal    |

## Troubleshooting

### Masalah: Lagu tidak ditemukan padahal ada

**Solusi:**

- Cek ejaan nama lagu
- Gunakan nama dalam database (lihat daftar lagu)
- Coba nama sebagian saja

### Masalah: Duplikat ditampilkan

**Solusi:**

- Normal, fitur ini mencegah re-add
- Gunakan tombol "➕ Tambah Baru" untuk lagu berbeda dengan nama sama

### Masalah: Paste tidak bekerja

**Solusi:**

- Gunakan Ctrl+V (Windows) atau Cmd+V (Mac)
- Pastikan textarea ter-focus
- Coba format berbeda (newline vs comma)

## API Integration

### Endpoint

```
PUT /api/setlists/{setlistId}
```

### Payload

```json
{
  "name": "Setlist Name",
  "songs": ["id1", "id2", "id3"],
  "songKeys": {},
  "completedSongs": {},
  "updatedAt": 1234567890
}
```

## Component Architecture

### BulkAddSongsModal.jsx

- **Props:**

  - `songs`: Array lagu yang tersedia
  - `currentSetList`: Setlist yang sedang diedit
  - `onAddSongs`: Callback dengan array song IDs
  - `onAddNewSong`: Callback untuk membuat lagu baru
  - `onCancel`: Callback untuk menutup modal

- **State:**

  - `inputText`: Raw input dari user
  - `results`: Array hasil pencarian
  - `searched`: Boolean pencarian sudah dilakukan

- **Methods:**
  - `handleSearch()`: Parse & search
  - `handleAddSelected()`: Bulk add
  - `handleAddNewSongClick()`: Trigger new song form

## Related Features

- **Setlist Management**: [docs/SETLIST_GUIDE.md](SETLIST_GUIDE.md)
- **Song Management**: [docs/SONG_GUIDE.md](SONG_GUIDE.md)
- **Keyboard Shortcuts**: [KEYBOARD_SHORTCUTS.md](KEYBOARD_SHORTCUTS.md)

## Feedback & Suggestions

Jika punya ide untuk improve fitur ini:

- Tambahkan feedback di GitHub Issues
- Sugesti format input baru
- Improvement untuk search algorithm

---

**Last Updated:** January 2026  
**Feature Status:** ✓ Production Ready

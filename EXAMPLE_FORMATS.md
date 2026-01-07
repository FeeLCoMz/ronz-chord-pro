# Contoh Format Chord yang Didukung

## Format 1: ChordPro (dengan bracket)

```
{title: Bukan Cinta Biasa}
{artist: Siti Nurhaliza}
{key: C}

{start_of_verse}
[C]Ku tak sangka [Em]bila berjumpa denganmu
[Am]Hatiku berbunga [F]mekar [G]seribu
[C]Kau menghias [Em]hari-hariku yang dulu
[Am]Yang selalu [F]sepi dan [G]sunyi
{end_of_verse}

{start_of_chorus}
[F]Ini bukan [G]cinta biasa
[Em]Yang pernah [Am]singgah di hati
[Dm]Membuatku [G]berbunga-bunga
[C]Hingga tak tahu [Am]diri
{end_of_chorus}
```

## Format 2: Standard (chord di atas lirik - Copy dari situs lain)

```
Title: Bukan Cinta Biasa
Artist: Siti Nurhaliza
Key: C

C              Em
Ku tak sangka bila berjumpa denganmu
Am             F         G
Hatiku berbunga mekar seribu
C              Em
Kau menghias hari-hariku yang dulu
Am             F         G
Yang selalu sepi dan sunyi

F              G
Ini bukan cinta biasa
Em             Am
Yang pernah singgah di hati
Dm             G
Membuatku berbunga-bunga
C              Am
Hingga tak tahu diri
```

## Kelebihan Format Standard:
✅ **Copy-paste langsung dari website chord**
✅ **Tidak perlu convert/edit format**
✅ **Posisi chord tetap akurat di atas lirik**
✅ **Lebih natural untuk pengguna**

## Cara Menggunakan:
1. Copy chord dari website favorit (ultimate-guitar.com, chordfrenzy.com, dll)
2. Paste langsung ke form
3. Aplikasi otomatis mendeteksi format dan menampilkan dengan benar
4. Transpose, auto-scroll, dan semua fitur tetap bekerja! 🎸

---

## Integrasi Not Angka ke Lirik (Inline)

- Isi field "Melodi Not Angka" di form lagu, contoh:

```
1 2 3 4 | 5 5 6 5 | 4 3 2 1 |
```

- Gunakan `|` pada lirik untuk menandai birama. Not angka akan muncul tepat di bawah baris lirik dan dikelompokkan per `|`.

Contoh:

```
[C]Ku tak sangka | [Em]berjumpa de-[Am]nganmu |
Hatiku ber-[F]bunga mekar | seribu [G]|
```

Output:

```
Ku tak sangka | berjumpa de- nganmu |
1 2 3 4 | 5 5 6 5 |

Hatiku ber- bunga mekar | seribu |
4 3 2 1 |
```

Catatan: jumlah birama pada lirik sebaiknya konsisten dengan jumlah birama pada melodi.

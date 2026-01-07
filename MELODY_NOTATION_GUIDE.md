# 🎵 Panduan Not Angka (Melodi) — Diketik dalam Lirik

## Format Input Melodi

Aplikasi ini mendukung input melodi dalam format not angka yang ditulis **langsung di dalam text lirik** (bukan field terpisah). Not angka akan otomatis dikenali dan ditampilkan inline di bawah baris lirik yang sesuai. Berikut format lengkap dan cara penggunaannya.

### Format Dasar Not Angka

```
1 2 3 4 | 5 5 6 5 | 4 3 2 1 |
```

- **Angka 1-7**: Mewakili tingkat nada (do, re, mi, fa, sol, la, si)
- **Spasi**: Memisahkan setiap not
- **|**: Garis bar (pemisah birama)

### Oktaf

- **Titik (.)**: Not rendah/oktaf bawah
  ```
  1. 2. 3. 4. | 5 6 7 1 |
  ```
  Contoh: `1.` = do rendah

- **Apostrof (')**: Not tinggi/oktaf atas
  ```
  5 6 7 1' | 2' 3' 4' 5' |
  ```
  Contoh: `1'` = do tinggi

### Durasi Not

- **Tanpa tanda**: Not standar (1 ketukan)
  ```
  1 2 3 4 |
  ```

- **Tanda minus (-)**: Not panjang
  ```
  1-- 2-- | 3--- 4 |
  ```
  - `1-` = 2 ketukan
  - `1--` = 3 ketukan
  - `1---` = 4 ketukan

### Aksidental

- **Kres (#)**: Nada naik setengah
  ```
  1# 2# 3 4# |
  ```

- **Mol (b)**: Nada turun setengah
  ```
  2b 3 4 5b |
  ```

### Tanda Istirahat

- **Minus (-) atau underscore (_)**: Istirahat
  ```
  1 2 - 4 | _ 6 7 1 |
  ```

### Kualitas Not (opsional)

- **m**: Minor (opsional, untuk notasi khusus)
  ```
  1 2m 3 4 |
  ```

## Contoh Lengkap

### Contoh 1: Melodi Sederhana
```
1 2 3 4 | 5 5 6 5 | 4 3 2 1 |
```

### Contoh 2: Dengan Oktaf Berbeda
```
1. 2. 3 4 | 5 6 7 1' | 2' 1' 7 6 | 5 - - - |
```

### Contoh 3: Dengan Durasi Panjang
```
1-- 2 3 | 4-- 5 6 | 7--- - | 1--- - |
```

### Contoh 4: Dengan Aksidental
```
1 2 3# 4 | 5 6b 7 1' | 2'# 1' 7b 6 |
```

### Contoh 5: Lengkap (Kasih Putih)
```
5 5 5 3 5 | 6 5 3 2 1 | 5 5 5 3 5 | 6 5 3 2 |
```

## Integrasi ke Lirik (Diketik Langsung)

- Not angka ditulis dalam text lirik, pada baris terpisah.
- Baris yang dimulai dengan digit 1-7 akan otomatis dikenali sebagai baris not angka.
- Baris not angka akan muncul di bawah baris lirik sebelumnya dan dipetakan per birama berdasarkan `|`.
- Jangan campur not angka dengan lirik pada baris yang sama.

### Contoh Integrasi

Format input di form lirik:

```
{title: Kasih Putih}
{artist: Glenn Fredly}
{key: C}

{start_of_verse}
[C]Ku ingin selalu | [G]bersamamu selamanya |
[Am]Dalam suka dan | [F]duka sepanjang masa |
5 5 5 3 5 | 6 5 3 2 |
[C]Cinta ini | [G]adalah milikmu |
[Am]Selamanya aku | [F]akan setia padamu |
1 1 2 3 | 2 1 - - |
{end_of_verse}
```

Tampilan di aplikasi:

```
Ku ingin selalu | bersamamu selamanya |
(not angka tidak ditampilkan untuk baris tanpa melodi)

Cinta ini | bersamamu selamanya |
5 5 5 3 5 | 6 5 3 2 |

Cinta ini | bersamamu selamanya |
1 1 2 3 | 2 1 - - |
```

### Tips Penulisan

1. **Letakkan not angka pada baris terpisah**, langsung di bawah lirik yang ingin ditambahkan melodi.
2. **Gunakan format yang sama seperti sebelumnya**: `1 2 3 4 | 5 5 6 5 | 4 3 2 1 |`
3. **Jangan pisahkan dengan baris kosong** antara lirik dan melodi supaya mapping bekerja dengan baik.
4. **Pastikan jumlah birama (`|`) pada lirik konsisten** dengan melodi.
5. **Transpose tetap bekerja**: Menggeser not angka secara diatonis.

## Tips

- ✅ Gunakan spasi untuk memisahkan not
- ✅ Gunakan | untuk menandai akhir bar/birama
- ✅ Untuk not panjang, tambahkan - sesuai durasi
- ✅ Titik (.) untuk not rendah, apostrof (') untuk not tinggi
- ✅ Melodi akan otomatis ter-transpose sesuai chord

## Tampilan

Not angka ditampilkan sederhana sebagai angka dan simbol di bawah lirik, dikelompokkan per birama dan dipisahkan oleh `|`.

## Batasan & Catatan

- Format ini fokus pada melodi vokal/instrumen melodi utama.
- Transpose bekerja dalam skala diatonis (1-7).
- Gunakan `|` di lirik untuk menyelaraskan birama.

## Contoh Lagu yang Sudah Ada Melodinya

1. **Kasih Putih** - Glenn Fredly
   ```
   5 5 5 3 5 | 6 5 3 2 1 | 5 5 5 3 5 | 6 5 3 2 |
   ```

2. **Sempurna** - Andra and The Backbone
   ```
   2 2 3 5 | 6 5 3 2 | 1 1 2 3 | 2 1 - - |
   ```

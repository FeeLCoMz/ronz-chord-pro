# 🎵 Panduan Not Angka (Melodi) — Format Lengkap & Integrasi ke Lirik

## Format Input Melodi

Aplikasi ini mendukung input melodi dalam format not angka dan menampilkannya langsung di bawah baris lirik (inline), selaras dengan tanda birama `|` pada lirik. Berikut format lengkap dan cara integrasinya.

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

## Integrasi ke Lirik (Inline)

- Not angka akan muncul di bawah baris lirik yang memiliki tanda birama `|`.
- Mapping dilakukan berdasarkan jumlah grup `|` pada setiap baris lirik.
- Satu grup `|` pada lirik = satu birama dari not angka.
- Jika ada `||` (double bar), dihitung sebagai dua grup bar.

### Contoh Integrasi

Melodi (field "Melodi Not Angka"):

```
1 2 3 4 | 5 5 6 5 | 4 3 2 1 |
```

Lirik (mengandung bar `|`):

```
[C]Ku tak sangka | [Em]berjumpa de-[Am]nganmu |
Hatiku ber-[F]bunga mekar | seribu [G]|
```

Tampilan:

```
Ku tak sangka | berjumpa de- nganmu |
1 2 3 4 | 5 5 6 5 |

Hatiku ber- bunga mekar | seribu |
4 3 2 1 |
```

Catatan:
- Pastikan jumlah birama pada lirik (jumlah grup `|`) konsisten dengan birama pada melodi.
- Jika birama melodi habis lebih dulu, baris berikutnya tidak akan menampilkan not angka.
- Transpose lagu juga menggeser not angka secara diatonis.

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

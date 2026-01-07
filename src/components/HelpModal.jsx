import React from 'react';

const Section = ({ title, children }) => (
  <div style={{ marginBottom: '1rem' }}>
    <h3 style={{ margin: '0 0 0.5rem' }}>{title}</h3>
    <div style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>{children}</div>
  </div>
);

const CodeBlock = ({ children }) => (
  <pre style={{
    background: 'var(--bg-muted, #0f172a)',
    color: 'var(--text, #e2e8f0)',
    padding: '0.6rem',
    borderRadius: '8px',
    border: '1px solid rgba(99,102,241,0.3)',
    overflowX: 'auto',
  }}>{children}</pre>
);

export default function HelpModal({ onClose }) {
  return (
    <div className="help-overlay" onClick={onClose}>
      <div
        className="help-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(880px, 92vw)',
          maxHeight: '80vh',
          overflow: 'auto',
          background: 'rgba(15, 23, 42, 0.96)',
          color: '#e2e8f0',
          border: '1px solid rgba(99,102,241,0.35)',
          boxShadow: '0 18px 36px -8px rgba(0,0,0,0.6)',
          borderRadius: '12px',
          padding: '1rem 1.25rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>❓ Bantuan</h2>
          <button className="btn-close" onClick={onClose} title="Tutup">✕</button>
        </div>

        <Section title="Ringkas">
          <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
            <li>Transpose: gunakan tombol ♭/♯ untuk geser nada.</li>
            <li>Auto Scroll: klik ▶ untuk scroll otomatis; atur kecepatannya.</li>
            <li>YouTube: tampilkan/sempunyikan player untuk referensi.</li>
            <li>Setlist: kelola daftar lagu untuk tampil.</li>
            <li>Melodi: not angka tampil inline di bawah lirik per birama.</li>
          </ul>
        </Section>

        <Section title="Format Chord">
          <p>Dukungan dua format utama:</p>
          <strong>1) ChordPro (bracket) </strong>
          <CodeBlock>{`{title: Contoh}
{artist: Penyanyi}
{key: C}

{start_of_verse}
[C]Ku tak sangka [Em]berjumpa denganmu
{end_of_verse}`}</CodeBlock>
          <strong>2) Standard (chord di atas lirik)</strong>
          <CodeBlock>{`C              Em
Ku tak sangka bila berjumpa denganmu
Am             F         G
Hatiku berbunga mekar seribu`}</CodeBlock>
          <p>Copy-paste dari situs chord, aplikasi akan mendeteksi dan merender dengan benar. Transpose dan fitur lain tetap bekerja.</p>
        </Section>

        <Section title="Format Not Angka (Lengkap)">
          <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
            <li>Angka 1–7: do–si. Pisahkan dengan spasi.</li>
            <li>Oktaf: titik (.) ke bawah, apostrof (') ke atas. Contoh: 1., 1'.</li>
            <li>Durasi: tambah "-" untuk perpanjang. Contoh: 1-, 1--, 1---</li>
            <li>Aksidental: "#" (kres), "b" (mol): 3#, 4b.</li>
            <li>Istirahat: "-" atau "_" sebagai rest.</li>
            <li>Birama: pisahkan dengan "|". Contoh bar:
              <CodeBlock>{`1 2 3 4 | 5 5 6 5 | 4 3 2 1 |`}</CodeBlock>
            </li>
          </ul>
        </Section>

        <Section title="Integrasi Not Angka ke Lirik (Inline)">
          <p>Not angka ditampilkan di bawah baris lirik dan dipetakan per birama berdasarkan jumlah grup "|" di lirik.</p>
          <CodeBlock>{`Melodi:
1 2 3 4 | 5 5 6 5 | 4 3 2 1 |

Lirik:
[C]Ku tak sangka | [Em]berjumpa de-[Am]nganmu |
Hatiku ber-[F]bunga mekar | seribu [G]|

Output:
Ku tak sangka | berjumpa de- nganmu |
1 2 3 4 | 5 5 6 5 |

Hatiku ber- bunga mekar | seribu |
4 3 2 1 |`}</CodeBlock>
          <p>Pastikan jumlah birama di lirik konsisten dengan melodi. Transpose menggeser not angka secara diatonis.</p>
        </Section>

        <Section title="Kontrol & Fitur">
          <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
            <li><strong>Transpose</strong>: geser nada ±1 semiton, reset kembali ke asli.</li>
            <li><strong>Auto Scroll</strong>: aktifkan lalu atur kecepatan (0.5x–5x).</li>
            <li><strong>YouTube Viewer</strong>: tampilkan player jika lagu punya `youtubeId`.</li>
            <li><strong>Setlist</strong>: buat/hapus, tambah/kurangi lagu, pilih setlist aktif.</li>
            <li><strong>Export/Import</strong>: ekspor seluruh db ke JSON; impor untuk memulihkan.</li>
            <li><strong>Sync ke DB</strong>: kirim data ke backend (Turso) lewat tombol Sync.</li>
          </ul>
        </Section>

        <Section title="Tips Audio Piano">
          <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
            <li>Klik sekali pada halaman agar audio diizinkan oleh browser.</li>
            <li>Pastikan tab/browser tidak mute dan volume sistem cukup.</li>
            <li>Piano virtual memakai oscillator (timbre sederhana) untuk sekarang.</li>
          </ul>
        </Section>

        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-primary" onClick={onClose}>Tutup</button>
        </div>
      </div>
    </div>
  );
}

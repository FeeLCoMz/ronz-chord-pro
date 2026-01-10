import { GoogleGenerativeAI } from '@google/generative-ai';
import busboy from 'busboy';

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Parse multipart form data using busboy
    const bb = busboy({ headers: req.headers });
    let audioBuffer = null;
    let mimeType = 'audio/mpeg';
    let fileName = '';

    await new Promise((resolve, reject) => {
      bb.on('file', (fieldname, file, info) => {
        if (fieldname === 'audio') {
          mimeType = info.mimeType || 'audio/mpeg';
          fileName = info.filename || 'audio.mp3';
          
          const chunks = [];
          file.on('data', (chunk) => {
            chunks.push(chunk);
          });
          
          file.on('end', () => {
            audioBuffer = Buffer.concat(chunks);
          });
          
          file.on('error', reject);
        }
      });

      bb.on('close', resolve);
      bb.on('error', reject);

      req.pipe(bb);
    });

    if (!audioBuffer || audioBuffer.length === 0) {
      res.status(400).json({ error: 'Audio file required or empty' });
      return;
    }

    // Convert buffer to base64
    const base64Audio = audioBuffer.toString('base64');

    const model = client.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Create request with audio file data
    const response = await model.generateContent([
      {
        inlineData: {
          mimeType: mimeType,
          data: base64Audio,
        },
      },
      {
        text: 'Transkripsi audio ini menjadi teks lirik lagu. Jika ada bagian yang tidak jelas, gunakan [?]. Format hasil sebagai lirik lagu yang bisa dibaca. Jangan tambahkan keterangan atau penjelasan lain, hanya liriknya saja.',
      },
    ]);

    const transcript = response.response.text();

    res.status(200).json({
      success: true,
      transcript: transcript || '',
      message: 'Transkripsi berhasil'
    });
  } catch (error) {
    console.error('Transcription error:', error);
    res.status(500).json({
      error: error.message || 'Gagal transkripsi audio',
      details: error.toString()
    });
  }
}

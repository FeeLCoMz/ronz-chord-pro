import React, { useState } from 'react';
import { askAI } from '../apiClient';

// Simple AI chat UI for song context
export default function AiAssistant({ song, onClose }) {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'Tanya apa saja tentang lagu ini.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    try {
      const context = song ? `${song.title} - ${song.artist}` : '';
      const res = await askAI({ prompt: input, context });
      setMessages(prev => [...prev, { role: 'assistant', content: res?.response || 'AI tidak memberikan jawaban.' }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Gagal menghubungi AI: ' + err.message }]);
    }
    setLoading(false);
  };

  const openGemini = () => {
    let q = '';
    if (song && song.title) q += song.title;
    if (song && song.artist) q += (q ? ' ' : '') + song.artist;
    const url = q
      ? `https://gemini.google.com/?q=${encodeURIComponent(q)}`
      : 'https://gemini.google.com/';
    window.open(url, '_blank', 'noopener');
  };

  return (
    <div style={{ padding: 16 }}>
      <h3 style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
        💬 Chat AI Lagu
        <button
          className="btn btn-sm btn-secondary"
          style={{ marginLeft: 8 }}
          onClick={openGemini}
          title="Buka Gemini di tab baru"
        >
          Buka Gemini
        </button>
      </h3>
      {song && (
        <div style={{ fontSize: '0.95em', marginBottom: 12, color: '#888' }}>
          <b>{song.title}</b> <span style={{ color: '#aaa' }}>by {song.artist}</span>
        </div>
      )}
      <div style={{ maxHeight: 220, overflowY: 'auto', background: '#f8fafc', borderRadius: 8, padding: 8, marginBottom: 8 }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: 6, color: msg.role === 'assistant' ? '#2563eb' : '#222' }}>
            <b>{msg.role === 'user' ? 'Anda' : msg.role === 'assistant' ? 'AI' : 'Sistem'}:</b> {msg.content}
          </div>
        ))}
        {loading && <div style={{ color: '#aaa' }}>AI sedang mengetik...</div>}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Tulis pertanyaan..."
          style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
          disabled={loading}
        />
        <button className="btn btn-primary" onClick={handleSend} disabled={loading || !input.trim()}>
          Kirim
        </button>
      </div>
    </div>
  );
}

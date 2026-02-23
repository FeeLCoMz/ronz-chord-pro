// Handler untuk export lirik ke TXT
export function handleExportText(song, artist, key, originalKey, tempo, lyricsClean, setShowExportMenu) {
  if (!song) return;
  const content = `${song.title}\nArtist: ${artist}\nKey: ${key}\n${originalKey ? `Original Key: ${originalKey}\n` : ''}Tempo: ${tempo} BPM\n\n${lyricsClean}`;
  const blob = new Blob([content], { type: "text/plain" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${song.title}.txt`;
  a.click();
  window.URL.revokeObjectURL(url);
  setShowExportMenu(false);
}

// Handler untuk export lirik ke PDF (print)
export function handleExportPDF(song, artist, key, originalKey, tempo, lyricsClean, setShowExportMenu) {
  if (!song) return;
  const content = `
<html>
<head>
  <title>${song.title}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    h1 { color: #333; }
    .meta { color: #666; margin: 20px 0; }
    .lyrics { white-space: pre-wrap; font-family: monospace; }
  </style>
</head>
<body>
  <h1>${song.title}</h1>
  <div class="meta">
    <p><strong>Artist:</strong> ${artist}</p>
    <p><strong>Key:</strong> ${key}</p>
    <p><strong>Tempo:</strong> ${tempo} BPM</p>
  </div>
  <div class="lyrics">${lyricsClean}</div>
</body>
</html>
    `;
  const printWindow = window.open("", "", "height=400,width=600");
  printWindow.document.write(content);
  printWindow.document.close();
  printWindow.print();
  setShowExportMenu(false);
}

// Handler untuk share lagu
export function handleShare(song, artist, setShareMessage) {
  const shareUrl = window.location.href;
  if (navigator.share) {
    navigator.share({
      title: song.title,
      text: `Check out this song: ${song.title} by ${artist}`,
      url: shareUrl,
    });
  } else {
    navigator.clipboard.writeText(shareUrl);
    setShareMessage("Link copied to clipboard!");
    setTimeout(() => setShareMessage(""), 2000);
  }
}

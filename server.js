const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
const PORT = 3000;

app.use(cors());

app.get('/api/audio', (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ error: 'Missing search query' });
  }

  const safeQuery = query.replace(/"/g, '').replace(/'/g, '');
  const cmd = `yt-dlp "ytsearch10:${safeQuery}" -f 140 --print "%(title)s|||%(url)s"`;

  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`yt-dlp error: ${stderr}`);
      return res.status(500).json({ error: 'Failed to fetch audio' });
    }

    const lines = stdout.trim().split('\n');
    const results = lines.map(line => {
      const [title, url] = line.trim().split('|||');
      return { title, url };
    });

    if (results.length === 0) {
      return res.status(404).json({ error: 'No songs found' });
    }

    res.json({ results });
  });
});

app.listen(PORT, () => {
  console.log(`🎧 YouTube Audio server running at http://localhost:${PORT}`);
});

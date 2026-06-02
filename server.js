const express = require('express');
const path = require('path');
const https = require('https');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Serve static files ────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ── SMM Proxy Route ───────────────────────────────────────
app.get('/api/smm', async (req, res) => {
  const params = new URLSearchParams(req.query);
  const targetUrl = `https://smmparty.com/api/v2?${params.toString()}`;

  try {
    const data = await fetchUrl(targetUrl);
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  } catch (err) {
    res.status(500).json({ error: 'فشل الاتصال بـ SMMParty: ' + err.message });
  }
});

// ── Catch-all → index.html ────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Simple fetch helper (no extra deps) ──────────────────
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    lib.get(url, { headers: { 'User-Agent': 'KingSocial/5.0' } }, (response) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

app.listen(PORT, () => {
  console.log(`✅ King Social running on port ${PORT}`);
});

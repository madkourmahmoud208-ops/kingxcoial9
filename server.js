const express = require('express');
const path    = require('path');
const https   = require('https');
const http    = require('http');
const qs      = require('querystring');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

// ── SMM Proxy — POST to SMMParty ─────────────────────────
app.get('/api/smm', async (req, res) => {
  const postData = qs.stringify(req.query);   // key=xxx&action=services ...
  const options  = {
    hostname: 'smmparty.com',
    path:     '/api/v2',
    method:   'POST',
    headers:  {
      'Content-Type':   'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData),
      'User-Agent':     'KingSocial/5.0',
    },
  };

  try {
    const raw  = await postRequest(options, postData);
    const json = JSON.parse(raw);             // تأكيد إنه JSON صح
    res.json(json);
  } catch (err) {
    res.status(500).json({ error: 'فشل الاتصال: ' + err.message });
  }
});

// ── Catch-all → index.html ────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── POST helper ───────────────────────────────────────────
function postRequest(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (resp) => {
      let data = '';
      resp.on('data', chunk => data += chunk);
      resp.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

app.listen(PORT, () => {
  console.log(`✅ King Social running on port ${PORT}`);
});

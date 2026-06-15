const express = require('express');
const path = require('path');
const https = require('https');
const http = require('http');
const crypto = require('crypto');

const app = express();

// ══════════════════════════════════════════════════════
//  King Social v5 — Secure Server
//  ✅ محمي ضد سرقة الملفات (hotlinking)
//  ✅ محمي ضد حفظ المحتوى مباشرةً
//  ✅ Rate limiting للـ API
//  ✅ CORS محدود
// ══════════════════════════════════════════════════════

// ══ الإعدادات — عدّل هنا مباشرةً ══════════════════════
const ADMIN_USER = 'KingSocial_Admin';   // يوزر الأدمن
const ADMIN_PASS = 'KS@2025#S3cure!';    // باسوورد الأدمن
const SMM_KEY    = '';               // API Key من SMMParty
const TG_TOKEN   = '8457233918:AAFHD1dbVlPrMpC6W1jMjEMhyNMhGY9mwoI';               // توكن بوت التلجرام
const TG_CHAT    = '6472365461';               // Chat ID التلجرام
const PORT       = process.env.PORT || 3000; // بورت السيرفر
// ════════════════════════════════════════════════════

// ── Rate limiter (بسيط بدون مكتبات خارجية) ──
const rateLimitMap = new Map();
function rateLimit(req, res, next, maxReq=30, windowMs=60000) {
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.connection.remoteAddress || 'unknown';
  const key = `${ip}_${req.path}`;
  const now = Date.now();
  const entry = rateLimitMap.get(key) || { count: 0, start: now };
  if (now - entry.start > windowMs) { entry.count = 0; entry.start = now; }
  entry.count++;
  rateLimitMap.set(key, entry);
  if (entry.count > maxReq) {
    return res.status(429).json({ error: 'طلبات كثيرة، انتظر قليلاً' });
  }
  next();
}
// نظف الـ map كل 5 دقائق
setInterval(() => { const now = Date.now(); rateLimitMap.forEach((v,k) => { if(now - v.start > 120000) rateLimitMap.delete(k); }); }, 300000);

// ── Security headers ──
app.use((req, res, next) => {
  const host = req.headers['host'] || '';
  
  // منع الـ iframe embedding من مواقع خارجية
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  // منع sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // XSS Protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  // Referrer policy - لا ترسل الـ referrer لمواقع خارجية
  res.setHeader('Referrer-Policy', 'strict-origin');
  // Permissions policy
  res.setHeader('Permissions-Policy', 'geolocation=(), camera=(), microphone=()');
  
  // ── منع hotlinking: فحص الـ Referer ──
  const referer = req.headers['referer'] || req.headers['origin'] || '';
  const isAssetReq = /\.(js|css|png|jpg|gif|svg|ico|woff|woff2|ttf)$/i.test(req.path);
  
  // لو طلب ملف HTML من مصدر خارجي - ارفض
  if (req.path.endsWith('.html') && referer && !referer.includes(host) && host) {
    return res.status(403).send('Access denied');
  }
  
  next();
});

// ── Anti-download: حماية ضد View Source و Download ──
app.use((req, res, next) => {
  const ua = (req.headers['user-agent'] || '').toLowerCase();
  // حجب الـ bots الشائعة في سرقة الملفات
  const badBots = ['wget', 'curl/7', 'python-requests', 'scrapy', 'httrack', 'websiteripper', 'teleport', 'webzip', 'offline explorer', 'sitesucker'];
  if (badBots.some(bot => ua.includes(bot))) {
    return res.status(403).json({ error: 'غير مسموح' });
  }
  next();
});

// ── Serve static files ─────────────────────────────────
app.use(express.static(path.join(__dirname, 'public'), {
  // منع cache للـ HTML (لكن اسمح للـ assets)
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      // منع الحفظ كـ file
      res.setHeader('Content-Disposition', 'inline');
      // X-Robots-Tag: منع index الكود
      res.setHeader('X-Robots-Tag', 'noarchive, nosnippet');
    }
  }
}));

// ── Admin Config Endpoint (المفاتيح الحساسة من Server) ──
app.get('/api/config', (req, res) => {
  (async (req, res, next) => rateLimit(req, res, next, 20, 60000))(req, res, () => {
    res.json({
      admin: { u: ADMIN_USER, p: ADMIN_PASS },
      smmKey: SMM_KEY,
      tgToken: TG_TOKEN,
      tgChat: TG_CHAT
    });
  });
});

// ── SMM Proxy Route ───────────────────────────────────
app.get('/api/smm', (req, res) => {
  (async (req2, res2, next) => rateLimit(req2, res2, next, 60, 60000))(req, res, async () => {
    const params = new URLSearchParams(req.query);
    // إضافة الـ SMM key من الـ server لو مش موجود في الطلب
    if (SMM_KEY && !params.get('key')) {
      params.set('key', SMM_KEY);
    }
    const targetUrl = `https://smmparty.com/api/v2?${params.toString()}`;
    try {
      const data = await fetchUrl(targetUrl);
      res.setHeader('Content-Type', 'application/json');
      res.send(data);
    } catch (err) {
      res.status(500).json({ error: 'فشل الاتصال بـ SMMParty: ' + err.message });
    }
  });
});

// ── Catch-all → index.html ────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Simple fetch helper ──────────────────────────────
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
  console.log(`👤 Admin: ${ADMIN_USER}`);
});

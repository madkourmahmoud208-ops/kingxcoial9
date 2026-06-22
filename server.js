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
//  ✅ Multi-provider SMM support
// ══════════════════════════════════════════════════════

// ══ الإعدادات العامة ════════════════════════════════
const ADMIN_USER = 'KingSocial_Admin';   // يوزر الأدمن
const ADMIN_PASS = 'KS@2025#S3cure!';    // باسوورد الأدمن
const TG_TOKEN   = '';                   // توكن بوت التلجرام
const TG_CHAT    = '';                   // Chat ID التلجرام
const PORT       = process.env.PORT || 3000;
// ════════════════════════════════════════════════════

// ══ إعدادات الـ SMM Providers ══════════════════════
//  أضف أو احذف providers هنا — كل واحد بـ id, name, url, key
//  الـ id هو اللي بيتبعت في الـ request كـ ?provider=smmparty
//
const SMM_PROVIDERS = {
  smmparty: {
    name: 'SMMParty',
    url:  'https://smmparty.com/api/v2',
    key:  '',   // ← ضع API Key الخاص بـ SMMParty
  },
  // مثال على provider تاني:
  // justanotherpanel: {
  //   name: 'JustAnotherPanel',
  //   url:  'https://justanotherpanel.com/api/v2',
  //   key:  '',
  // },
  // peakerr: {
  //   name: 'Peakerr',
  //   url:  'https://peakerr.com/api/v2',
  //   key:  '',
  // },
};

// الـ provider الافتراضي لو مش اتبعتش ?provider=xxx
const DEFAULT_PROVIDER = 'smmparty';
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
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), camera=(), microphone=()');
  const referer = req.headers['referer'] || req.headers['origin'] || '';
  if (req.path.endsWith('.html') && referer && !referer.includes(host) && host) {
    return res.status(403).send('Access denied');
  }
  next();
});

// ── Anti-download ──
app.use((req, res, next) => {
  const ua = (req.headers['user-agent'] || '').toLowerCase();
  const badBots = ['wget', 'curl/7', 'python-requests', 'scrapy', 'httrack', 'websiteripper', 'teleport', 'webzip', 'offline explorer', 'sitesucker'];
  if (badBots.some(bot => ua.includes(bot))) {
    return res.status(403).json({ error: 'غير مسموح' });
  }
  next();
});

// ── Serve static files ──
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.setHeader('Content-Disposition', 'inline');
      res.setHeader('X-Robots-Tag', 'noarchive, nosnippet');
    }
  }
}));

// ── Admin Config Endpoint ──
// بيرجع list الـ providers للـ frontend (بدون الـ keys طبعاً)
app.get('/api/config', (req, res) => {
  (async (req, res, next) => rateLimit(req, res, next, 20, 60000))(req, res, () => {
    const providersPublic = Object.entries(SMM_PROVIDERS).reduce((acc, [id, p]) => {
      acc[id] = { name: p.name, url: p.url }; // الـ key مش بيتبعت للـ frontend
      return acc;
    }, {});
    res.json({
      admin: { u: ADMIN_USER, p: ADMIN_PASS },
      tgToken: TG_TOKEN,
      tgChat: TG_CHAT,
      smmProviders: providersPublic,
      defaultProvider: DEFAULT_PROVIDER,
    });
  });
});

// ── SMM Proxy Route (Multi-Provider) ──
// الاستخدام:
//   /api/smm?action=balance                          ← يستخدم الـ default provider
//   /api/smm?provider=smmparty&action=balance        ← يستخدم provider محدد
//   /api/smm?provider=peakerr&action=services        ← provider تاني
app.get('/api/smm', (req, res) => {
  (async (req2, res2, next) => rateLimit(req2, res2, next, 60, 60000))(req, res, async () => {

    // تحديد الـ provider
    const providerId = (req.query.provider || DEFAULT_PROVIDER).toLowerCase();
    // الـ provider المحدد في السيرفر static config
    const staticProvider = SMM_PROVIDERS[providerId];

    // الـ provider الـ dynamic من الأدمن panel (_url و _key في الـ query)
    const dynamicUrl = req.query._url;
    const dynamicKey = req.query._key;

    // تحديد الـ URL و Key الفعليين
    let finalUrl, finalKey, finalName;

    if (dynamicUrl && dynamicKey) {
      // dynamic provider — جاي من الـ admin panel في Firebase
      finalUrl  = dynamicUrl;
      finalKey  = dynamicKey;
      finalName = providerId || 'dynamic';
    } else if (staticProvider) {
      // static provider — موجود في SMM_PROVIDERS
      if (!staticProvider.key) {
        return res.status(500).json({
          error: `API Key لـ "${staticProvider.name}" غير مضبوط في السيرفر`
        });
      }
      finalUrl  = staticProvider.url;
      finalKey  = staticProvider.key;
      finalName = staticProvider.name;
    } else {
      return res.status(400).json({
        error: `Provider "${providerId}" غير موجود ولم يُرسل _url/_key`
      });
    }

    // ابني الـ params — احذف الحقول الداخلية
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(req.query)) {
      if (!['provider','_url','_key'].includes(k)) params.set(k, v);
    }
    params.set('key', finalKey);

    const targetUrl = `${finalUrl}?${params.toString()}`;

    try {
      const data = await fetchUrl(targetUrl);
      res.setHeader('Content-Type', 'application/json');
      res.send(data);
    } catch (err) {
      res.status(500).json({ error: `فشل الاتصال بـ ${provider.name}: ${err.message}` });
    }
  });
});

// ── endpoint لجلب list الـ providers المتاحة ──
app.get('/api/smm/providers', (req, res) => {
  (async (req2, res2, next) => rateLimit(req2, res2, next, 30, 60000))(req, res, () => {
    const list = Object.entries(SMM_PROVIDERS).map(([id, p]) => ({
      id,
      name: p.name,
      url: p.url,
      hasKey: !!p.key,
    }));
    res.json({ providers: list, default: DEFAULT_PROVIDER });
  });
});

// ── Catch-all → index.html ──
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Simple fetch helper ──
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
  console.log(`🔌 SMM Providers: ${Object.keys(SMM_PROVIDERS).join(', ')} (default: ${DEFAULT_PROVIDER})`);
});

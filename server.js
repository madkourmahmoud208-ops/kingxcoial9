const express = require('express');
const path    = require('path');
const https   = require('https');
const http    = require('http');
const crypto  = require('crypto');

const app = express();
app.use(express.json({ limit: '1mb' }));

// ══ الإعدادات ══════════════════════════════════════════
const ADMIN_USER  = 'KingSocial_Admin';
const ADMIN_PASS  = 'KS@2025#S3cure!';
const SMM_KEY     = '';
const TG_TOKEN    = '';
const TG_CHAT     = '';
const PORT        = process.env.PORT || 3000;
// Firebase RTDB — نفس الـ DB المستخدمة في الـ frontend
const FIREBASE_DB = 'https://tiktokzoom-97c9d-default-rtdb.firebaseio.com';
// ════════════════════════════════════════════════════

// ── Rate limiter ──────────────────────────────────────
const rateLimitMap = new Map();
function rateLimit(req, res, next, maxReq = 30, windowMs = 60000) {
  const ip    = req.headers['x-forwarded-for']?.split(',')[0] || req.connection.remoteAddress || 'unknown';
  const key   = `${ip}_${req.path}`;
  const now   = Date.now();
  const entry = rateLimitMap.get(key) || { count: 0, start: now };
  if (now - entry.start > windowMs) { entry.count = 0; entry.start = now; }
  entry.count++;
  rateLimitMap.set(key, entry);
  if (entry.count > maxReq) {
    return res.status(429).json({ error: 'rate_limit_exceeded', message: 'طلبات كثيرة، انتظر قليلاً' });
  }
  next();
}
setInterval(() => {
  const now = Date.now();
  rateLimitMap.forEach((v, k) => { if (now - v.start > 120000) rateLimitMap.delete(k); });
}, 300000);

// ── Security headers ──────────────────────────────────
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), camera=(), microphone=()');

  // CORS — مفتوح فقط لـ /api/v1
  if (req.path.startsWith('/api/v1')) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Key, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();
  }

  // منع hotlinking
  const host    = req.headers['host'] || '';
  const referer = req.headers['referer'] || req.headers['origin'] || '';
  if (req.path.endsWith('.html') && referer && !referer.includes(host) && host) {
    return res.status(403).send('Access denied');
  }
  next();
});

// ── Anti-scraping bots ────────────────────────────────
app.use((req, res, next) => {
  const ua      = (req.headers['user-agent'] || '').toLowerCase();
  const badBots = ['wget', 'curl/7', 'python-requests', 'scrapy', 'httrack',
                   'websiteripper', 'teleport', 'webzip', 'offline explorer', 'sitesucker'];
  if (badBots.some(b => ua.includes(b))) return res.status(403).json({ error: 'غير مسموح' });
  next();
});

// ── HTTP helpers ──────────────────────────────────────
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    lib.get(url, { headers: { 'User-Agent': 'KingSocial/5.0' } }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    }).on('error', reject);
  });
}

function fetchMethod(url, method, body = null) {
  return new Promise((resolve, reject) => {
    try {
      const lib     = url.startsWith('https') ? https : http;
      const urlObj  = new URL(url);
      const bodyStr = body ? JSON.stringify(body) : null;
      const opts    = {
        hostname : urlObj.hostname,
        port     : urlObj.port || (url.startsWith('https') ? 443 : 80),
        path     : urlObj.pathname + urlObj.search,
        method,
        headers  : {
          'Content-Type'  : 'application/json',
          'User-Agent'    : 'KingSocial/5.0',
          ...(bodyStr ? { 'Content-Length': Buffer.byteLength(bodyStr) } : {})
        }
      };
      const req = lib.request(opts, (res) => {
        let d = '';
        res.on('data', c => d += c);
        res.on('end', () => resolve(d));
      });
      req.on('error', reject);
      if (bodyStr) req.write(bodyStr);
      req.end();
    } catch (e) { reject(e); }
  });
}

// ── Firebase REST helpers ─────────────────────────────
const fbGet   = async (p)    => JSON.parse(await fetchUrl(`${FIREBASE_DB}/${p}.json`));
const fbPatch = async (p, v) => JSON.parse(await fetchMethod(`${FIREBASE_DB}/${p}.json`, 'PATCH', v));

// ── API Key cache (5 min TTL) ─────────────────────────
const keyCache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

async function validateApiKey(key) {
  if (!key || (!key.startsWith('ks_live_') && !key.startsWith('ks_test_'))) return null;
  const cached = keyCache.get(key);
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data;
  try {
    const hash = crypto.createHash('sha256').update(key).digest('hex').substring(0, 32);
    const data = await fbGet(`apiKeys/${hash}`);
    const result = (data && data.isActive !== false) ? data : null;
    keyCache.set(key, { data: result, ts: Date.now() });
    return result;
  } catch {
    return null;
  }
}

// ── API Key middleware ────────────────────────────────
async function requireApiKey(req, res, next) {
  const key = req.headers['x-api-key'] || req.query.api_key;
  if (!key) {
    return res.status(401).json({
      error: 'unauthorized', message: 'مفتاح API مطلوب. أضف X-API-Key header أو api_key parameter.',
      docs: '/api-docs.html'
    });
  }
  const kd = await validateApiKey(key);
  if (!kd) {
    return res.status(403).json({ error: 'forbidden', message: 'مفتاح API غير صالح أو موقوف.' });
  }
  req.apiUser = kd;
  // تحديث usage (fire & forget)
  const hash = crypto.createHash('sha256').update(key).digest('hex').substring(0, 32);
  fbPatch(`apiKeys/${hash}`, { lastUsedAt: new Date().toISOString(), usageCount: (kd.usageCount || 0) + 1 })
    .catch(() => {});
  // تحديث userApiKeys للمستخدم
  fbPatch(`userApiKeys/${kd.userId}/${hash}`, { lastUsedAt: new Date().toISOString(), usageCount: (kd.usageCount || 0) + 1 })
    .catch(() => {});
  setTimeout(() => keyCache.delete(key), CACHE_TTL);
  next();
}

// ── Static files ──────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public'), {
  index: false,   // ← منع خدمة index.html تلقائياً عند فتح /
  setHeaders: (res, fp) => {
    if (fp.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.setHeader('Content-Disposition', 'inline');
      res.setHeader('X-Robots-Tag', 'noarchive, nosnippet');
    }
  }
}));

// ── Admin config ──────────────────────────────────────
app.get('/api/config', (req, res) => {
  (async (q, s, n) => rateLimit(q, s, n, 20, 60000))(req, res, () => {
    res.json({ admin: { u: ADMIN_USER, p: ADMIN_PASS }, smmKey: SMM_KEY, tgToken: TG_TOKEN, tgChat: TG_CHAT });
  });
});

// ── SMM Proxy ─────────────────────────────────────────
app.get('/api/smm', (req, res) => {
  (async (q, s, n) => rateLimit(q, s, n, 60, 60000))(req, res, async () => {
    const params = new URLSearchParams(req.query);
    if (SMM_KEY && !params.get('key')) params.set('key', SMM_KEY);
    try {
      const data = await fetchUrl(`https://smmparty.com/api/v2?${params.toString()}`);
      res.setHeader('Content-Type', 'application/json');
      res.send(data);
    } catch (err) {
      res.status(500).json({ error: 'فشل الاتصال بـ SMMParty: ' + err.message });
    }
  });
});

// ══════════════════════════════════════════════════════
//  API v1  — /api/v1/*
// ══════════════════════════════════════════════════════
const v1 = express.Router();
v1.use((req, res, next) => rateLimit(req, res, next, 120, 60000));

// GET /api/v1  ── معلومات الـ API
v1.get('/', (req, res) => {
  res.json({
    name: 'King Social API', version: '1.0',
    docs: `${req.protocol}://${req.get('host')}/api-docs.html`,
    endpoints: [
      'GET  /api/v1/services',
      'GET  /api/v1/services/:id',
      'GET  /api/v1/balance',
      'POST /api/v1/order',
      'GET  /api/v1/orders',
      'GET  /api/v1/order/:id'
    ]
  });
});

// GET /api/v1/services ────────────────────────────────
v1.get('/services', requireApiKey, async (req, res) => {
  try {
    const raw = await fbGet('services');
    if (!raw) return res.json({ success: true, count: 0, services: [] });

    const { platform, category, search } = req.query;
    let list = Object.entries(raw).map(([id, s]) => ({
      id, name: s.name || '', category: s.category || '', platform: s.app || 'Other',
      price_per_1000: s.price || 0, currency: 'EGP',
      min: s.min || 100, max: s.max || 10000,
      quality: s.quality || '', speed: s.speed || '',
      refill_guarantee: s.refill || false, cancel_allowed: s.cancel || false,
      smm_id: s.smmpartyId || null
    }));

    if (platform) list = list.filter(s => s.platform.toLowerCase() === platform.toLowerCase());
    if (category) list = list.filter(s => s.category.toLowerCase().includes(category.toLowerCase()));
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(s => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
    }
    res.json({ success: true, count: list.length, services: list });
  } catch (e) {
    res.status(500).json({ error: 'server_error', message: e.message });
  }
});

// GET /api/v1/services/:id ────────────────────────────
v1.get('/services/:id', requireApiKey, async (req, res) => {
  try {
    const s = await fbGet(`services/${req.params.id}`);
    if (!s) return res.status(404).json({ error: 'not_found', message: 'الخدمة غير موجودة' });
    res.json({ success: true, service: {
      id: req.params.id, name: s.name, category: s.category, platform: s.app,
      price_per_1000: s.price, currency: 'EGP',
      min: s.min, max: s.max, quality: s.quality, speed: s.speed,
      refill_guarantee: s.refill || false, cancel_allowed: s.cancel || false,
      smm_id: s.smmpartyId || null
    }});
  } catch (e) {
    res.status(500).json({ error: 'server_error', message: e.message });
  }
});

// GET /api/v1/balance ─────────────────────────────────
v1.get('/balance', requireApiKey, async (req, res) => {
  try {
    const user = await fbGet(`users/${req.apiUser.userId}`);
    if (!user) return res.status(404).json({ error: 'not_found', message: 'المستخدم غير موجود' });
    res.json({
      success: true, username: req.apiUser.userId,
      balance: parseFloat(user.balance || 0).toFixed(2),
      currency: 'EGP', level: user.level || 'مبتدئ'
    });
  } catch (e) {
    res.status(500).json({ error: 'server_error', message: e.message });
  }
});

// POST /api/v1/order ──────────────────────────────────
v1.post('/order', requireApiKey, async (req, res) => {
  const { service_id, link, quantity } = req.body;
  if (!service_id || !link || !quantity) {
    return res.status(400).json({
      error: 'bad_request', message: 'حقول مطلوبة ناقصة',
      required: { service_id: 'string', link: 'string', quantity: 'number' }
    });
  }
  const qty = parseInt(quantity);
  if (isNaN(qty) || qty <= 0) {
    return res.status(400).json({ error: 'bad_request', message: 'quantity يجب أن يكون رقماً موجباً' });
  }
  try {
    const [svc, user] = await Promise.all([
      fbGet(`services/${service_id}`),
      fbGet(`users/${req.apiUser.userId}`)
    ]);
    if (!svc)  return res.status(404).json({ error: 'not_found', message: 'الخدمة غير موجودة' });
    if (!user) return res.status(404).json({ error: 'not_found', message: 'المستخدم غير موجود' });
    if (qty < svc.min || qty > svc.max) {
      return res.status(400).json({
        error: 'invalid_quantity',
        message: `الكمية يجب أن تكون بين ${svc.min} و ${svc.max}`,
        min: svc.min, max: svc.max
      });
    }
    const total   = parseFloat(((qty / 1000) * svc.price).toFixed(4));
    const balance = parseFloat(user.balance || 0);
    if (balance < total) {
      return res.status(402).json({
        error: 'insufficient_balance', required: total, available: balance, currency: 'EGP'
      });
    }
    const orderId   = `ORD-API-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const newBalance = parseFloat((balance - total).toFixed(4));
    const order = {
      id: orderId, user: req.apiUser.userId,
      serviceId: service_id, serviceName: svc.name || '', serviceApp: svc.app || '',
      link, quantity: qty, price: svc.price, total,
      status: 'pending', createdAt: new Date().toISOString(),
      source: 'api', apiKeyName: req.apiUser.keyName || 'API Key'
    };
    await Promise.all([
      fetchMethod(`${FIREBASE_DB}/orders.json`, 'POST', order),
      fbPatch(`users/${req.apiUser.userId}`, {
        balance: newBalance,
        totalSpent: parseFloat(((user.totalSpent || 0) + total).toFixed(4)),
        totalOrders: (user.totalOrders || 0) + 1
      })
    ]);
    res.status(201).json({
      success: true, order: {
        order_id: orderId, service: svc.name, link, quantity: qty,
        charge: total, currency: 'EGP', status: 'pending',
        new_balance: newBalance, created_at: order.createdAt
      }
    });
  } catch (e) {
    res.status(500).json({ error: 'server_error', message: e.message });
  }
});

// GET /api/v1/orders ──────────────────────────────────
v1.get('/orders', requireApiKey, async (req, res) => {
  try {
    const raw = await fbGet('orders');
    if (!raw) return res.json({ success: true, count: 0, orders: [] });
    const orders = Object.entries(raw)
      .filter(([, o]) => o.user === req.apiUser.userId)
      .map(([k, o]) => ({
        order_id: o.id || k, service: o.serviceName, platform: o.serviceApp,
        link: o.link, quantity: o.quantity, charge: o.total,
        status: o.status, created_at: o.createdAt
      }))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 100);
    res.json({ success: true, count: orders.length, orders });
  } catch (e) {
    res.status(500).json({ error: 'server_error', message: e.message });
  }
});

// GET /api/v1/order/:id ───────────────────────────────
v1.get('/order/:id', requireApiKey, async (req, res) => {
  try {
    const raw = await fbGet('orders');
    if (!raw) return res.status(404).json({ error: 'not_found', message: 'الطلب غير موجود' });
    const entry = Object.entries(raw).find(([, o]) =>
      o.id === req.params.id && o.user === req.apiUser.userId
    );
    if (!entry) return res.status(404).json({ error: 'not_found', message: 'الطلب غير موجود' });
    const [, o] = entry;
    res.json({ success: true, order: {
      order_id: o.id, service: o.serviceName, platform: o.serviceApp,
      link: o.link, quantity: o.quantity,
      start_count: o.startCount || 0, remains: o.remains || o.quantity || 0,
      charge: o.total, status: o.status,
      smm_order_id: o.smmpartyOrderId || null,
      created_at: o.createdAt, last_updated: o.lastChecked || o.createdAt
    }});
  } catch (e) {
    res.status(500).json({ error: 'server_error', message: e.message });
  }
});

// Mount API v1
app.use('/api/v1', v1);

// ── Catch-all → panel.html ─────────────────────────────
// ⚠️  index.html أصبح ملف فارغ (طعم)
// ⚠️  الملف الحقيقي هو panel.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'panel.html'));
});

app.listen(PORT, () => {
  console.log(`✅ King Social  :${PORT}`);
  console.log(`📡 API v1       → /api/v1`);
  console.log(`📚 API Docs     → /api-docs.html`);
  console.log(`🎭 Decoy file   → /index.html  (فارغ)`);
});

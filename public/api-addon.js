/**
 * King Social — API Addon v3
 * ● مفاتيح API  → pg-apikeys
 * ● دليل API   → pg-apidocs
 * ● تجميع الخدمات بالتطبيق في الـ dropdown
 */
(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════
     CSS
  ══════════════════════════════════════════════════════ */
  const CSS = `
  /* ── sub nav items ── */
  .sb-sub { padding:5px 14px 5px 14px; display:flex; align-items:center; gap:9px;
    font-size:12px; color:var(--t2); cursor:pointer; transition:var(--tr);
    border-right:2px solid transparent; position:relative; }
  .sb-sub::before { content:''; position:absolute; right:22px; top:0; bottom:0;
    width:1px; background:var(--bd); }
  .sb-sub:first-of-type::before { top:50%; }
  .sb-sub:last-of-type::before { bottom:50%; }
  .sb-sub:hover { background:var(--bg2); color:var(--t1); }
  .sb-sub.on { background:var(--ps); color:var(--pur); border-right-color:var(--pur); }
  .sb-sub i { font-size:12px; width:16px; text-align:center; flex-shrink:0; }
  .sb-sub .sb-sub-dot { width:5px; height:5px; border-radius:50%; background:var(--bd2);
    flex-shrink:0; transition:var(--tr); }
  .sb-sub.on .sb-sub-dot { background:var(--pur); }
  .sb.col .sb-sub span:not(.sbn) { display:none; }
  .sb.col .sb-sub::before { display:none; }
  .sb.col .sb-sub { padding:8px 0; justify-content:center; }

  /* ── API Keys page ── */
  .apk-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-bottom:18px; }
  .apk-stat { background:var(--bg2); border:1px solid var(--bd); border-radius:12px;
    padding:14px 12px; text-align:center; transition:var(--tr); }
  .apk-stat:hover { border-color:rgba(184,160,255,.4); transform:translateY(-1px); }
  .apk-stat .sv { font-size:26px; font-weight:900; color:var(--pur); line-height:1.1; }
  .apk-stat .sl { font-size:10.5px; color:var(--t2); margin-top:4px; }
  .apk-card { background:var(--bg2); border:1px solid var(--bd); border-radius:12px;
    padding:16px 18px; margin-bottom:14px; }
  .apk-card-hd { display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; }
  .apk-card-hd h3 { font-size:13px; font-weight:700; display:flex; align-items:center; gap:8px; }
  .apk-kr { display:flex; align-items:center; gap:9px; padding:11px 13px;
    background:var(--bg1); border:1px solid var(--bd); border-radius:9px;
    margin-bottom:8px; transition:var(--tr); }
  .apk-kr:hover { border-color:var(--c3); }
  .apk-kr:last-child { margin-bottom:0; }
  .apk-pfx { font-family:var(--mono); font-size:11px; color:var(--pur); flex:1;
    overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .apk-badge { padding:2px 8px; border-radius:12px; font-size:10px; font-weight:700; flex-shrink:0; }
  .apk-badge.on  { background:var(--gs); color:var(--grn); }
  .apk-badge.off { background:var(--rs); color:var(--red); }
  .apk-nm { font-size:11px; background:var(--c1); color:var(--t1); padding:2px 8px;
    border-radius:4px; flex-shrink:0; max-width:110px; overflow:hidden; text-overflow:ellipsis; }
  .apk-meta { font-size:10px; color:var(--t3); flex-shrink:0; white-space:nowrap; }
  .apk-rev { padding:4px 9px; background:transparent; color:var(--red);
    border:1px solid var(--red); border-radius:6px; font-size:10px; font-weight:700;
    cursor:pointer; transition:var(--tr); font-family:var(--font); flex-shrink:0; }
  .apk-rev:hover { background:var(--red); color:#fff; }
  .apk-empty { text-align:center; padding:32px 16px; color:var(--t2); }
  .apk-empty i { font-size:28px; display:block; margin-bottom:10px; color:var(--t3); }
  .apk-new-btn { padding:7px 15px; background:var(--ps); color:var(--pur);
    border:1px solid var(--pur); border-radius:7px; font-size:12px; font-weight:700;
    cursor:pointer; transition:var(--tr); font-family:var(--font); display:flex; align-items:center; gap:6px; }
  .apk-new-btn:hover { background:var(--pur); color:#fff; }
  .apk-usage-row { display:flex; align-items:center; gap:8px; padding:9px 12px;
    background:var(--bg1); border:1px solid var(--bd); border-radius:var(--r); margin:4px 0; }
  .apk-usage-key { font-family:var(--mono); font-size:11px; color:var(--teal); flex:1;
    overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }

  /* ── API Docs page ── */
  .apd-hero { background:linear-gradient(135deg,rgba(184,160,255,.08),rgba(91,164,255,.05));
    border:1px solid rgba(184,160,255,.2); border-radius:14px; padding:28px 24px;
    margin-bottom:20px; position:relative; overflow:hidden; }
  .apd-hero::after { content:''; position:absolute; top:-40px; left:-40px; width:160px; height:160px;
    background:radial-gradient(circle,rgba(184,160,255,.15),transparent 70%); pointer-events:none; }
  .apd-hero h1 { font-size:22px; font-weight:900; color:var(--t0); margin-bottom:6px; }
  .apd-hero p  { font-size:12.5px; color:var(--t2); max-width:420px; line-height:1.7; }
  .apd-badges  { display:flex; gap:7px; margin-top:14px; flex-wrap:wrap; }
  .apd-badge   { padding:3px 11px; border-radius:20px; font-size:10.5px; font-weight:700; }
  .apd-badge.v { background:var(--gs); color:var(--grn); }
  .apd-badge.r { background:var(--ts); color:var(--teal); }
  .apd-badge.j { background:var(--bs); color:var(--blue); }
  .apd-sec-ttl { font-size:13.5px; font-weight:800; color:var(--t0); margin:20px 0 12px;
    display:flex; align-items:center; gap:9px; }
  .apd-info { padding:12px 14px; border-radius:9px; font-size:12px; margin:10px 0;
    display:flex; gap:9px; align-items:flex-start; line-height:1.7; }
  .apd-info.tip  { background:var(--bs); border:1px solid rgba(91,164,255,.25); color:var(--blue); }
  .apd-info.warn { background:var(--ys); border:1px solid rgba(255,200,66,.2); color:var(--ylw); }
  .apd-info i    { margin-top:2px; flex-shrink:0; }
  .apd-url { font-family:var(--mono); font-size:11.5px; background:var(--bg);
    border:1px solid rgba(184,160,255,.25); border-radius:8px; padding:11px 14px;
    color:var(--pur); margin:8px 0; word-break:break-all; line-height:1.8; }
  /* endpoint cards */
  .apd-ep { background:var(--bg2); border:1px solid var(--bd); border-radius:11px;
    margin-bottom:10px; overflow:hidden; }
  .apd-eph { display:flex; align-items:center; gap:10px; padding:13px 16px;
    cursor:pointer; transition:background .15s; user-select:none; }
  .apd-eph:hover { background:var(--bg3); }
  .apd-epb { padding:0 16px 16px; display:none; animation:fadeIn .15s ease; }
  .apd-ep.open .apd-epb { display:block; }
  .apd-ep.open .apd-chv { transform:rotate(180deg); }
  .apd-chv { color:var(--t3); transition:transform .22s; font-size:10px; margin-right:auto; }
  .apd-mth { padding:2px 10px; border-radius:5px; font-size:10.5px; font-weight:800;
    font-family:var(--mono); flex-shrink:0; }
  .apd-mth.G { background:var(--bs); color:var(--blue); border:1px solid rgba(91,164,255,.3); }
  .apd-mth.P { background:var(--gs); color:var(--grn); border:1px solid rgba(61,232,160,.3); }
  .apd-path { font-family:var(--mono); font-size:12px; color:var(--t0); flex:1; min-width:0;
    overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .apd-elbl { font-size:11px; color:var(--t2); flex-shrink:0; white-space:nowrap; }
  /* tables */
  .apd-tbl { width:100%; border-collapse:collapse; font-size:11.5px; margin:10px 0; }
  .apd-tbl th { padding:7px 10px; background:var(--bg1); color:var(--t2); font-weight:600;
    text-align:right; border-bottom:1px solid var(--bd); }
  .apd-tbl td { padding:7px 10px; border-bottom:1px solid var(--bd); color:var(--t1); vertical-align:top; }
  .apd-tbl td:first-child { font-family:var(--mono); color:var(--pur); font-size:10.5px; }
  .apd-req { color:var(--red); font-size:9.5px; font-weight:700; }
  /* code */
  .apd-code { background:var(--bg); border:1px solid rgba(91,164,255,.18); border-radius:9px;
    padding:14px; font-family:var(--mono); font-size:11px; color:var(--t1);
    overflow-x:auto; line-height:1.75; position:relative; margin:10px 0; }
  .apd-code pre { white-space:pre; }
  .apd-copy { position:absolute; top:8px; left:8px; padding:3px 9px; background:var(--c1);
    border:1px solid var(--bd); border-radius:5px; font-size:10px; font-weight:700;
    color:var(--t2); cursor:pointer; transition:var(--tr); z-index:1; }
  .apd-copy:hover { background:var(--c2); color:var(--t0); }
  .apd-code .k  { color:var(--pur); }
  .apd-code .s  { color:var(--grn); }
  .apd-code .n  { color:var(--ylw); }
  .apd-code .w  { color:var(--blue); }
  .apd-code .c  { color:var(--t3); font-style:italic; }
  /* error table */
  .apd-etbl { width:100%; border-collapse:collapse; font-size:11.5px; }
  .apd-etbl th { padding:7px 10px; background:var(--bg1); color:var(--t2); font-weight:600;
    text-align:right; border-bottom:1px solid var(--bd); }
  .apd-etbl td { padding:8px 10px; border-bottom:1px solid var(--bd); color:var(--t1); }
  .apd-etbl td:nth-child(1) { font-family:var(--mono); color:var(--ylw); font-weight:700; }
  .apd-etbl td:nth-child(2) { font-family:var(--mono); color:var(--red); font-size:10.5px; }
  /* code tabs */
  .apd-ctabs { display:flex; gap:2px; margin-bottom:-1px; position:relative; z-index:1; }
  .apd-ctab { padding:5px 12px; font-size:10.5px; font-weight:700; border-radius:6px 6px 0 0;
    cursor:pointer; border:1px solid var(--bd); border-bottom:none; background:var(--bg1);
    color:var(--t2); transition:var(--tr); }
  .apd-ctab.on { background:var(--bg); color:var(--t0); border-color:rgba(91,164,255,.25); }
  .apd-cblock { display:none; }
  .apd-cblock.on { display:block; }

  /* modal */
  #apkModal { display:none; position:fixed; inset:0; background:rgba(0,0,0,.78);
    z-index:99999; align-items:center; justify-content:center; padding:16px; }
  #apkModal.show { display:flex; }
  .apkm-box { background:var(--bg2); border:1px solid var(--bd2); border-radius:14px;
    padding:26px; width:min(420px,100%); }
  .apkm-box h2 { font-size:15px; font-weight:800; margin-bottom:16px;
    display:flex; align-items:center; gap:8px; }
  .apkm-inp { width:100%; padding:10px 14px; background:var(--bg1);
    border:1px solid var(--bd); border-radius:var(--r); color:var(--t0);
    font-size:13px; font-family:var(--font); transition:var(--tr); }
  .apkm-inp:focus { border-color:var(--pur); outline:none; }
  .apkm-warn { background:var(--ys); border:1px solid rgba(255,200,66,.25); border-radius:8px;
    padding:10px 13px; font-size:11.5px; color:var(--ylw); margin-bottom:12px;
    display:flex; gap:8px; line-height:1.65; }
  .apkm-key { font-family:var(--mono); font-size:10.5px; background:var(--bg); padding:12px;
    border-radius:var(--r); border:1px dashed var(--pur); color:var(--pur);
    word-break:break-all; margin:10px 0; line-height:1.8; user-select:all; }
  .apkm-row { display:flex; gap:8px; margin-top:12px; }
  .apkm-bp { flex:1; padding:10px; background:var(--pur); color:#fff; border:none;
    border-radius:var(--r); font-weight:700; font-size:13px; cursor:pointer;
    transition:var(--tr); font-family:var(--font); }
  .apkm-bp:disabled { opacity:.5; cursor:not-allowed; }
  .apkm-bs { padding:10px 14px; background:var(--bg1); border:1px solid var(--bd);
    border-radius:var(--r); color:var(--t1); cursor:pointer; font-size:12px; font-family:var(--font); }
  @keyframes fadeIn { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:none} }
  @media(max-width:600px){ .apk-grid{grid-template-columns:1fr 1fr} }
  `;

  /* ══════════════════════════════════════════════════════
     HTML: صفحة المفاتيح
  ══════════════════════════════════════════════════════ */
  function keysPageHtml() {
    return `
    <div class="pg-hd">
      <h1 style="display:flex;align-items:center;gap:10px">
        <i class="fas fa-key" style="color:var(--pur)"></i>مفاتيح API
      </h1>
      <p style="color:var(--t2);font-size:12.5px;margin-top:4px">
        أنشئ مفاتيح API لربط تطبيقاتك الخارجية بـ King Social
      </p>
    </div>
    <div class="apk-grid">
      <div class="apk-stat"><div class="sv" id="apks-total">—</div><div class="sl">إجمالي المفاتيح</div></div>
      <div class="apk-stat"><div class="sv" id="apks-active">—</div><div class="sl">مفاتيح نشطة</div></div>
      <div class="apk-stat"><div class="sv" id="apks-calls">—</div><div class="sl">إجمالي الاستدعاءات</div></div>
    </div>
    <div class="apk-card">
      <div class="apk-card-hd">
        <h3><i class="fas fa-key" style="color:var(--pur)"></i> مفاتيحك</h3>
        <button class="apk-new-btn" onclick="apkShowModal()">
          <i class="fas fa-plus"></i> مفتاح جديد
        </button>
      </div>
      <div id="apk-list">
        <div class="apk-empty"><i class="fas fa-circle-notch fa-spin"></i></div>
      </div>
    </div>
    <div class="apk-card">
      <div class="apk-card-hd"><h3><i class="fas fa-circle-info" style="color:var(--blue)"></i> كيف تستخدم المفتاح</h3></div>
      <div style="font-size:12px;color:var(--t1);margin-bottom:7px">أرسله في كل طلب كـ Header:</div>
      <div class="apd-url">X-API-Key: ks_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</div>
      <div style="font-size:12px;color:var(--t1);margin:10px 0 7px">أو كـ Query Parameter:</div>
      <div class="apd-url">/api/v1/services?api_key=ks_live_...</div>
      <div style="margin-top:14px;text-align:center">
        <span onclick="window.nav('apidocs')" style="color:var(--blue);font-size:12px;font-weight:700;cursor:pointer">
          <i class="fas fa-book"></i> فتح الدليل الكامل
        </span>
      </div>
    </div>

    <!-- Modal -->
    <div id="apkModal">
      <div class="apkm-box">
        <h2><i class="fas fa-key" style="color:var(--pur)"></i> مفتاح API جديد</h2>
        <div id="apkm-form">
          <div style="font-size:11.5px;color:var(--t2);margin-bottom:7px">اسم المفتاح</div>
          <input id="apkm-name" class="apkm-inp" type="text"
            placeholder="مثال: موقعي الشخصي، بوت التلجرام..." maxlength="50" autocomplete="off">
          <div class="apkm-row">
            <button class="apkm-bp" id="apkm-cbtn" onclick="apkCreate()">
              <i class="fas fa-plus"></i> إنشاء
            </button>
            <button class="apkm-bs" onclick="apkHideModal()">إلغاء</button>
          </div>
        </div>
        <div id="apkm-result" style="display:none">
          <div class="apkm-warn">
            <i class="fas fa-triangle-exclamation" style="flex-shrink:0;margin-top:2px"></i>
            <span><strong>مهم!</strong> احفظ هذا المفتاح الآن في مكان آمن. لن يُعرض ثانيةً أبداً.</span>
          </div>
          <div class="apkm-key" id="apkm-kval">ks_live_...</div>
          <div class="apkm-row">
            <button class="apkm-bp" id="apkm-cpbtn" onclick="apkCopyKey()"
              style="background:var(--ps);color:var(--pur);border:1px solid var(--pur)">
              <i class="fas fa-copy"></i> نسخ المفتاح
            </button>
            <button class="apkm-bp" onclick="apkHideModal()"
              style="background:var(--grn);color:#000;flex:.65">
              <i class="fas fa-check"></i> تم
            </button>
          </div>
        </div>
      </div>
    </div>
    `;
  }

  /* ══════════════════════════════════════════════════════
     HTML: صفحة الدليل
  ══════════════════════════════════════════════════════ */
  function docsPageHtml() {
    return `
    <div class="apd-hero">
      <h1><i class="fas fa-code" style="color:var(--pur);margin-left:10px;font-size:20px"></i>دليل King Social API</h1>
      <p>اربط تطبيقاتك بالمنصة مباشرةً — تحكم كامل في الخدمات والطلبات والرصيد</p>
      <div class="apd-badges">
        <span class="apd-badge v">v1.0 Stable</span>
        <span class="apd-badge r">REST</span>
        <span class="apd-badge j">JSON</span>
      </div>
    </div>

    <!-- Base URL -->
    <div class="apk-card">
      <div class="apk-card-hd"><h3><i class="fas fa-link" style="color:var(--blue)"></i> عنوان القاعدة</h3></div>
      <div class="apd-url">https://kingxsocial.vercel.app/api/v1</div>
      <div class="apd-info tip"><i class="fas fa-circle-info"></i>
        كل الردود بصيغة JSON. طلب ناجح = <code style="background:var(--bg);padding:1px 5px;border-radius:3px;font-size:11px">success: true</code>
      </div>
    </div>

    <!-- Auth -->
    <div class="apk-card">
      <div class="apk-card-hd"><h3><i class="fas fa-shield-halved" style="color:var(--pur)"></i> المصادقة</h3></div>
      <div style="font-size:12px;color:var(--t1);margin-bottom:7px">الطريقة 1 — Header (الأفضل)</div>
      <div class="apd-url">X-API-Key: ks_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</div>
      <div style="font-size:12px;color:var(--t1);margin:10px 0 7px">الطريقة 2 — Query Parameter</div>
      <div class="apd-url">/api/v1/balance?api_key=ks_live_...</div>
      <div class="apd-info warn"><i class="fas fa-triangle-exclamation"></i>
        لا تشارك مفتاحك. لو اتسرّب اذهب لـ
        <span onclick="window.nav('apikeys')" style="text-decoration:underline;cursor:pointer">مفاتيح API</span>
        وأوقفه فوراً.</div>
    </div>

    <!-- Rate Limits -->
    <div class="apk-card">
      <div class="apk-card-hd"><h3><i class="fas fa-gauge" style="color:var(--ylw)"></i> حدود الطلبات</h3></div>
      <table class="apd-tbl">
        <thead><tr><th>النطاق</th><th>الحد</th><th>النافذة</th></tr></thead>
        <tbody>
          <tr><td style="color:var(--t1);font-family:var(--mono);font-size:11px">/api/v1/*</td>
              <td style="color:var(--t0);font-weight:700">120 طلب</td>
              <td style="color:var(--t2)">كل دقيقة</td></tr>
        </tbody>
      </table>
    </div>

    <!-- Endpoints title -->
    <div class="apd-sec-ttl">
      <i class="fas fa-list" style="color:var(--teal)"></i> نقاط النهاية
    </div>

    <!-- GET /services -->
    <div class="apd-ep open">
      <div class="apd-eph" onclick="this.closest('.apd-ep').classList.toggle('open')">
        <span class="apd-mth G">GET</span>
        <span class="apd-path">/api/v1/services</span>
        <span class="apd-elbl">قائمة كل الخدمات</span>
        <i class="fas fa-chevron-down apd-chv"></i>
      </div>
      <div class="apd-epb">
        <div style="font-size:11px;color:var(--t2);margin-bottom:8px">Query Parameters (اختيارية)</div>
        <table class="apd-tbl">
          <thead><tr><th>Parameter</th><th>النوع</th><th>الوصف</th></tr></thead>
          <tbody>
            <tr><td>platform</td><td style="color:var(--t1)">string</td><td style="color:var(--t1)">فلتر: tiktok, instagram, youtube, ...</td></tr>
            <tr><td>category</td><td style="color:var(--t1)">string</td><td style="color:var(--t1)">فلتر بالفئة (جزئي)</td></tr>
            <tr><td>search</td><td style="color:var(--t1)">string</td><td style="color:var(--t1)">بحث في الاسم والفئة</td></tr>
          </tbody>
        </table>
        <div class="apd-ctabs">
          <div class="apd-ctab on" onclick="apdTab(this,'curl')">cURL</div>
          <div class="apd-ctab" onclick="apdTab(this,'js')">JavaScript</div>
        </div>
        <div class="apd-cblock on" data-lang="curl">
          <div class="apd-code">
            <button class="apd-copy" onclick="apdCopy(this)">نسخ</button>
            <pre>curl -X GET \
  "https://kingxsocial.vercel.app/api/v1/services?platform=tiktok" \
  -H "X-API-Key: ks_live_xxxx..."</pre>
          </div>
        </div>
        <div class="apd-cblock" data-lang="js">
          <div class="apd-code">
            <button class="apd-copy" onclick="apdCopy(this)">نسخ</button>
            <pre><span class="w">const</span> res = <span class="w">await</span> fetch(<span class="s">'/api/v1/services?platform=tiktok'</span>, {
  headers: { <span class="s">'X-API-Key'</span>: <span class="s">'ks_live_xxxx...'</span> }
});
<span class="w">const</span> { services } = <span class="w">await</span> res.json();</pre>
          </div>
        </div>
        <div style="font-size:11px;color:var(--t2);margin:10px 0 6px">نموذج الرد</div>
        <div class="apd-code"><pre>{
  <span class="k">"success"</span>: <span class="w">true</span>, <span class="k">"count"</span>: <span class="n">24</span>,
  <span class="k">"services"</span>: [{
    <span class="k">"id"</span>: <span class="s">"svc001"</span>, <span class="k">"name"</span>: <span class="s">"متابعين تيك توك — عرب"</span>,
    <span class="k">"platform"</span>: <span class="s">"tiktok"</span>, <span class="k">"price_per_1000"</span>: <span class="n">12.5</span>,
    <span class="k">"currency"</span>: <span class="s">"EGP"</span>, <span class="k">"min"</span>: <span class="n">100</span>, <span class="k">"max"</span>: <span class="n">50000</span>,
    <span class="k">"refill_guarantee"</span>: <span class="w">true</span>
  }]
}</pre></div>
      </div>
    </div>

    <!-- GET /balance -->
    <div class="apd-ep">
      <div class="apd-eph" onclick="this.closest('.apd-ep').classList.toggle('open')">
        <span class="apd-mth G">GET</span>
        <span class="apd-path">/api/v1/balance</span>
        <span class="apd-elbl">رصيد الحساب</span>
        <i class="fas fa-chevron-down apd-chv"></i>
      </div>
      <div class="apd-epb">
        <div class="apd-code">
          <button class="apd-copy" onclick="apdCopy(this)">نسخ</button>
          <pre>curl -X GET \
  "https://kingxsocial.vercel.app/api/v1/balance" \
  -H "X-API-Key: ks_live_xxxx..."</pre>
        </div>
        <div class="apd-code"><pre>{
  <span class="k">"success"</span>: <span class="w">true</span>,
  <span class="k">"username"</span>: <span class="s">"Ahmed123"</span>,
  <span class="k">"balance"</span>: <span class="s">"142.50"</span>,
  <span class="k">"currency"</span>: <span class="s">"EGP"</span>,
  <span class="k">"level"</span>: <span class="s">"محترف"</span>
}</pre></div>
      </div>
    </div>

    <!-- POST /order -->
    <div class="apd-ep">
      <div class="apd-eph" onclick="this.closest('.apd-ep').classList.toggle('open')">
        <span class="apd-mth P">POST</span>
        <span class="apd-path">/api/v1/order</span>
        <span class="apd-elbl">إنشاء طلب جديد</span>
        <i class="fas fa-chevron-down apd-chv"></i>
      </div>
      <div class="apd-epb">
        <table class="apd-tbl">
          <thead><tr><th>الحقل</th><th>النوع</th><th>الوصف</th></tr></thead>
          <tbody>
            <tr><td>service_id <span class="apd-req">*</span></td><td style="color:var(--t1)">string</td><td style="color:var(--t1)">معرّف الخدمة</td></tr>
            <tr><td>link <span class="apd-req">*</span></td><td style="color:var(--t1)">string</td><td style="color:var(--t1)">رابط الحساب أو المنشور</td></tr>
            <tr><td>quantity <span class="apd-req">*</span></td><td style="color:var(--t1)">number</td><td style="color:var(--t1)">العدد (ضمن min/max الخدمة)</td></tr>
          </tbody>
        </table>
        <div class="apd-ctabs">
          <div class="apd-ctab on" onclick="apdTab(this,'curl')">cURL</div>
          <div class="apd-ctab" onclick="apdTab(this,'js')">JavaScript</div>
          <div class="apd-ctab" onclick="apdTab(this,'py')">Python</div>
        </div>
        <div class="apd-cblock on" data-lang="curl">
          <div class="apd-code">
            <button class="apd-copy" onclick="apdCopy(this)">نسخ</button>
            <pre>curl -X POST \
  "https://kingxsocial.vercel.app/api/v1/order" \
  -H "X-API-Key: ks_live_xxxx..." \
  -H "Content-Type: application/json" \
  -d '{"service_id":"svc001","link":"https://tiktok.com/@user","quantity":1000}'</pre>
          </div>
        </div>
        <div class="apd-cblock" data-lang="js">
          <div class="apd-code">
            <button class="apd-copy" onclick="apdCopy(this)">نسخ</button>
            <pre><span class="w">const</span> res = <span class="w">await</span> fetch(<span class="s">'/api/v1/order'</span>, {
  method: <span class="s">'POST'</span>,
  headers: { <span class="s">'X-API-Key'</span>: <span class="s">'ks_live_xxxx...'</span>, <span class="s">'Content-Type'</span>: <span class="s">'application/json'</span> },
  body: JSON.stringify({ service_id: <span class="s">'svc001'</span>, link: <span class="s">'https://tiktok.com/@user'</span>, quantity: <span class="n">1000</span> })
});
<span class="w">const</span> { order } = <span class="w">await</span> res.json();
console.log(order.order_id, order.charge + <span class="s">' EGP'</span>);</pre>
          </div>
        </div>
        <div class="apd-cblock" data-lang="py">
          <div class="apd-code">
            <button class="apd-copy" onclick="apdCopy(this)">نسخ</button>
            <pre><span class="w">import</span> requests
res = requests.post(<span class="s">"https://kingxsocial.vercel.app/api/v1/order"</span>,
  headers={<span class="s">"X-API-Key"</span>: <span class="s">"ks_live_xxxx..."</span>},
  json={<span class="s">"service_id"</span>: <span class="s">"svc001"</span>, <span class="s">"link"</span>: <span class="s">"https://tiktok.com/@user"</span>, <span class="s">"quantity"</span>: <span class="n">1000</span>})
print(res.json()[<span class="s">"order"</span>][<span class="s">"order_id"</span>])</pre>
          </div>
        </div>
        <div class="apd-code"><pre><span class="c">// 201 Created</span>
{
  <span class="k">"success"</span>: <span class="w">true</span>,
  <span class="k">"order"</span>: {
    <span class="k">"order_id"</span>: <span class="s">"ORD-API-1735000000-A1B2C"</span>,
    <span class="k">"service"</span>: <span class="s">"متابعين تيك توك"</span>,
    <span class="k">"quantity"</span>: <span class="n">1000</span>, <span class="k">"charge"</span>: <span class="n">12.5</span>,
    <span class="k">"status"</span>: <span class="s">"pending"</span>, <span class="k">"new_balance"</span>: <span class="n">130.0</span>
  }
}</pre></div>
      </div>
    </div>

    <!-- GET /orders -->
    <div class="apd-ep">
      <div class="apd-eph" onclick="this.closest('.apd-ep').classList.toggle('open')">
        <span class="apd-mth G">GET</span>
        <span class="apd-path">/api/v1/orders</span>
        <span class="apd-elbl">آخر 100 طلب</span>
        <i class="fas fa-chevron-down apd-chv"></i>
      </div>
      <div class="apd-epb">
        <div class="apd-code">
          <button class="apd-copy" onclick="apdCopy(this)">نسخ</button>
          <pre>curl -X GET "https://kingxsocial.vercel.app/api/v1/orders" -H "X-API-Key: ks_live_xxxx..."</pre>
        </div>
      </div>
    </div>

    <!-- GET /order/:id -->
    <div class="apd-ep">
      <div class="apd-eph" onclick="this.closest('.apd-ep').classList.toggle('open')">
        <span class="apd-mth G">GET</span>
        <span class="apd-path">/api/v1/order/:id</span>
        <span class="apd-elbl">حالة طلب بعينه</span>
        <i class="fas fa-chevron-down apd-chv"></i>
      </div>
      <div class="apd-epb">
        <table class="apd-tbl" style="margin-bottom:10px">
          <thead><tr><th>الحالة</th><th>المعنى</th></tr></thead>
          <tbody>
            <tr><td>pending</td><td style="color:var(--t1)">في الانتظار</td></tr>
            <tr><td>in_progress</td><td style="color:var(--t1)">جارٍ التنفيذ</td></tr>
            <tr><td>completed</td><td style="color:var(--grn)">اكتمل ✅</td></tr>
            <tr><td>partial</td><td style="color:var(--ylw)">اكتمل جزئياً</td></tr>
            <tr><td>cancelled</td><td style="color:var(--red)">ملغي ❌</td></tr>
          </tbody>
        </table>
        <div class="apd-code">
          <button class="apd-copy" onclick="apdCopy(this)">نسخ</button>
          <pre>curl "https://kingxsocial.vercel.app/api/v1/order/ORD-API-xxx" -H "X-API-Key: ks_live_xxxx..."</pre>
        </div>
      </div>
    </div>

    <!-- Errors -->
    <div class="apd-sec-ttl" style="margin-top:24px">
      <i class="fas fa-triangle-exclamation" style="color:var(--red)"></i> أكواد الأخطاء
    </div>
    <div class="apk-card">
      <table class="apd-etbl">
        <thead><tr><th>HTTP</th><th>error</th><th>السبب</th></tr></thead>
        <tbody>
          <tr><td>401</td><td>unauthorized</td><td>مفتاح API غير موجود</td></tr>
          <tr><td>403</td><td>forbidden</td><td>المفتاح غلط أو موقوف</td></tr>
          <tr><td>400</td><td>bad_request</td><td>حقول ناقصة أو قيم خاطئة</td></tr>
          <tr><td>400</td><td>invalid_quantity</td><td>الكمية خارج النطاق</td></tr>
          <tr><td>402</td><td>insufficient_balance</td><td>رصيد غير كافٍ</td></tr>
          <tr><td>404</td><td>not_found</td><td>الخدمة أو الطلب غير موجود</td></tr>
          <tr><td>429</td><td>rate_limit_exceeded</td><td>طلبات كثيرة — انتظر دقيقة</td></tr>
          <tr><td>500</td><td>server_error</td><td>خطأ داخلي — حاول مرة أخرى</td></tr>
        </tbody>
      </table>
    </div>

    <!-- Full example -->
    <div class="apd-sec-ttl"><i class="fas fa-code" style="color:var(--teal)"></i> مثال JavaScript كامل</div>
    <div class="apd-code">
      <button class="apd-copy" onclick="apdCopy(this)">نسخ الكل</button>
      <pre><span class="w">const</span> API = {
  key:  <span class="s">'ks_live_xxxxxxxxxxxx'</span>,
  base: <span class="s">'https://kingxsocial.vercel.app/api/v1'</span>,
  <span class="w">async</span> call(path, method = <span class="s">'GET'</span>, body = <span class="w">null</span>) {
    <span class="w">const</span> r = <span class="w">await</span> fetch(<span class="w">this</span>.base + path, {
      method,
      headers: { <span class="s">'X-API-Key'</span>: <span class="w">this</span>.key, <span class="s">'Content-Type'</span>: <span class="s">'application/json'</span> },
      body: body ? JSON.stringify(body) : <span class="w">null</span>
    });
    <span class="w">const</span> d = <span class="w">await</span> r.json();
    <span class="w">if</span> (!d.success) <span class="w">throw new</span> Error(d.message || d.error);
    <span class="w">return</span> d;
  }
};

<span class="c">// جلب خدمات تيك توك وإنشاء طلب</span>
<span class="w">const</span> { services } = <span class="w">await</span> API.call(<span class="s">'/services?platform=tiktok'</span>);
<span class="w">const</span> svc = services.find(s => s.name.includes(<span class="s">'متابعين'</span>));
<span class="w">const</span> { balance } = <span class="w">await</span> API.call(<span class="s">'/balance'</span>);
<span class="w">const</span> cost = (<span class="n">500</span> / <span class="n">1000</span>) * svc.price_per_1000;
<span class="w">if</span> (parseFloat(balance) < cost) <span class="w">throw new</span> Error(<span class="s">'رصيد غير كافٍ'</span>);
<span class="w">const</span> { order } = <span class="w">await</span> API.call(<span class="s">'/order'</span>, <span class="s">'POST'</span>, {
  service_id: svc.id,
  link:       <span class="s">'https://www.tiktok.com/@myusername'</span>,
  quantity:   <span class="n">500</span>
});
console.log(<span class="s">`✅ ${order.order_id} — تم خصم ${order.charge} EGP`</span>);</pre>
    </div>
    `;
  }

  /* ══════════════════════════════════════════════════════
     Tab switcher inside docs endpoint cards
  ══════════════════════════════════════════════════════ */
  window.apdTab = function (btn, lang) {
    const grp = btn.closest('.apd-ep') || btn.closest('.apk-card');
    if (!grp) return;
    grp.querySelectorAll('.apd-ctab').forEach(t => t.classList.remove('on'));
    grp.querySelectorAll('.apd-cblock').forEach(b => b.classList.remove('on'));
    btn.classList.add('on');
    grp.querySelectorAll(`.apd-cblock[data-lang="${lang}"]`).forEach(b => b.classList.add('on'));
  };

  window.apdCopy = function (btn) {
    const pre = btn.closest('.apd-code').querySelector('pre');
    navigator.clipboard.writeText(pre ? pre.textContent : '').then(() => {
      btn.textContent = 'تم ✓';
      setTimeout(() => btn.textContent = 'نسخ', 1800);
    });
  };

  /* ══════════════════════════════════════════════════════
     API Keys logic
  ══════════════════════════════════════════════════════ */
  window.apkLoadKeys = function () {
    if (!window.CU || !window.DB) return;
    const list = document.getElementById('apk-list');
    if (!list) return;
    list.innerHTML = '<div class="apk-empty"><i class="fas fa-circle-notch fa-spin"></i></div>';
    DB.ref('userApiKeys/' + CU.u).once('value').then(snap => {
      const data = snap.val();
      const g = id => document.getElementById(id);
      const keys = data ? Object.values(data) : [];
      if (g('apks-total'))  g('apks-total').textContent  = keys.length || '0';
      if (g('apks-active')) g('apks-active').textContent = keys.filter(k => k.isActive !== false).length || '0';
      if (g('apks-calls'))  g('apks-calls').textContent  = keys.reduce((s, k) => s + (k.usageCount || 0), 0);
      if (!keys.length) {
        list.innerHTML = '<div class="apk-empty"><i class="fas fa-key"></i><div style="margin-top:4px">لا توجد مفاتيح بعد</div><div style="font-size:11px;margin-top:4px;color:var(--t3)">أنشئ مفتاحك الأول</div></div>';
        return;
      }
      list.innerHTML = Object.entries(data)
        .sort((a, b) => new Date(b[1].createdAt) - new Date(a[1].createdAt))
        .map(([hash, k]) => {
          const on = k.isActive !== false;
          const dt = k.createdAt ? new Date(k.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' }) : '';
          return `<div class="apk-kr" style="${on ? '' : 'opacity:.5'}">
            <span class="apk-pfx">${k.keyPrefix || 'ks_live_'}••••••••••••••••••••</span>
            <span class="apk-badge ${on ? 'on' : 'off'}">${on ? 'نشط' : 'موقوف'}</span>
            <span class="apk-nm" title="${k.keyName || ''}">${k.keyName || 'بدون اسم'}</span>
            <span class="apk-meta">${dt}</span>
            ${k.usageCount ? `<span class="apk-meta" style="color:var(--pur)">${k.usageCount} طلب</span>` : ''}
            ${on ? `<button class="apk-rev" onclick="apkRevoke('${hash}')"><i class="fas fa-ban"></i> إلغاء</button>` : ''}
          </div>`;
        }).join('');
    });
  };

  window.apkShowModal = function () {
    if (!window.CU) { if (typeof toast === 'function') toast('سجّل دخولك أولاً', 'err'); return; }
    document.getElementById('apkm-form').style.display   = '';
    document.getElementById('apkm-result').style.display = 'none';
    document.getElementById('apkm-name').value = '';
    document.getElementById('apkModal').classList.add('show');
    setTimeout(() => document.getElementById('apkm-name').focus(), 100);
  };
  window.apkHideModal = function () {
    document.getElementById('apkModal').classList.remove('show');
    window.apkLoadKeys();
  };
  document.addEventListener('click', e => {
    const m = document.getElementById('apkModal');
    if (m && e.target === m) window.apkHideModal();
  });

  window.apkCreate = async function () {
    if (!window.CU || !window.DB) return;
    const inp  = document.getElementById('apkm-name');
    const name = inp.value.trim();
    if (!name) { inp.style.borderColor = 'var(--red)'; setTimeout(() => inp.style.borderColor = '', 1400); return; }
    const btn = document.getElementById('apkm-cbtn');
    btn.disabled = true; btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>';
    try {
      const rand    = Array.from(crypto.getRandomValues(new Uint8Array(32))).map(b => b.toString(36)).join('').replace(/[^a-z0-9]/g, '').substring(0, 40);
      const fullKey = 'ks_live_' + rand;
      const prefix  = fullKey.substring(0, 18);
      const buf     = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(fullKey));
      const hash    = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 32);
      const now     = new Date().toISOString();
      const kd      = { keyName: name, keyPrefix: prefix, userId: CU.u, isActive: true, createdAt: now, lastUsedAt: null, usageCount: 0 };
      await Promise.all([
        DB.ref('apiKeys/' + hash).set(kd),
        DB.ref('userApiKeys/' + CU.u + '/' + hash).set({ keyName: name, keyPrefix: prefix, isActive: true, createdAt: now, usageCount: 0 })
      ]);
      window._apkLastKey = fullKey;
      document.getElementById('apkm-kval').textContent = fullKey;
      document.getElementById('apkm-form').style.display   = 'none';
      document.getElementById('apkm-result').style.display = '';
    } catch (e) { if (typeof toast === 'function') toast('خطأ: ' + e.message, 'err'); }
    btn.disabled = false; btn.innerHTML = '<i class="fas fa-plus"></i> إنشاء';
  };

  window.apkCopyKey = function () {
    const k = window._apkLastKey || document.getElementById('apkm-kval').textContent;
    navigator.clipboard.writeText(k).then(() => {
      const b = document.getElementById('apkm-cpbtn');
      b.innerHTML = '<i class="fas fa-check"></i> تم!';
      setTimeout(() => b.innerHTML = '<i class="fas fa-copy"></i> نسخ المفتاح', 2000);
    });
  };

  window.apkRevoke = async function (hash) {
    if (!confirm('⚠️ إيقاف هذا المفتاح؟\nأي تطبيق يستخدمه سيتوقف فوراً.')) return;
    try {
      await Promise.all([
        DB.ref('apiKeys/' + hash).update({ isActive: false }),
        DB.ref('userApiKeys/' + CU.u + '/' + hash).update({ isActive: false })
      ]);
      window.apkLoadKeys();
      if (typeof toast === 'function') toast('تم إيقاف المفتاح', 'ok');
    } catch { if (typeof toast === 'function') toast('فشل الإيقاف', 'err'); }
  };

  /* ══════════════════════════════════════════════════════
     تجميع الخدمات بالتطبيق — override buildSvcDD
  ══════════════════════════════════════════════════════ */
  function overrideBuildSvcDD() {
    window.buildSvcDD = function (cat) {
      const menu = document.getElementById('svc-options');
      if (!menu) return;
      menu.innerHTML = '';
      const svcs = (window.ALL_CATS && window.ALL_CATS[cat]) || [];
      if (!svcs.length) {
        const empty = document.createElement('div');
        empty.className = 'cdd-empty';
        empty.textContent = 'لا توجد خدمات في هذه الفئة';
        menu.appendChild(empty);
        return;
      }

      /* ── تجميع بالتطبيق مع ترتيب المنصة المختارة أولاً ── */
      const byApp = {};
      const appOrder = [];
      svcs.forEach(s => {
        const app = s.app || 'Other';
        if (!byApp[app]) { byApp[app] = []; appOrder.push(app); }
        byApp[app].push(s);
      });

      /* لو في منصة مختارة حطها أول */
      const SEL = window.SEL_PLAT;
      if (SEL) {
        const idx = appOrder.findIndex(a => a.toLowerCase() === SEL.toLowerCase());
        if (idx > 0) { appOrder.splice(0, 0, appOrder.splice(idx, 1)[0]); }
      }

      const multiApp = appOrder.length > 1;
      const ACLR = window.ACLR || {};
      const AICO = window.AICO || {};
      const CUR  = window.CUR  || 'EGP';
      const CFG  = window.CFG  || {};
      const fmtN = window.fmtN;

      const mk = window.mk || function (tag, cls, txt) {
        const el = document.createElement(tag);
        if (cls) el.className = cls;
        if (txt) el.textContent = txt;
        return el;
      };

      appOrder.forEach(app => {
        /* ── App group label ── */
        if (multiApp) {
          const grp = mk('div', 'cdd-group-label');
          grp.style.cssText = 'display:flex;align-items:center;gap:7px;padding:9px 14px 5px';
          const iw = mk('div');
          iw.style.cssText = `width:18px;height:18px;border-radius:5px;background:${ACLR[app] || 'var(--c2)'};display:flex;align-items:center;justify-content:center;flex-shrink:0`;
          const ic = mk('i', AICO[app] || 'fas fa-cube');
          ic.style.cssText = 'font-size:9px;color:#fff';
          iw.appendChild(ic);
          grp.appendChild(iw);
          grp.appendChild(document.createTextNode(app));
          /* count badge */
          const cnt = mk('span');
          cnt.textContent = byApp[app].length;
          cnt.style.cssText = 'margin-right:auto;background:var(--c1);color:var(--t2);border-radius:10px;padding:1px 7px;font-size:9.5px;font-weight:700';
          grp.appendChild(cnt);
          menu.appendChild(grp);
        }

        /* ── Services in this app ── */
        byApp[app].forEach((s, idx) => {
          const dispId    = s.smmpartyId ? String(s.smmpartyId) : String(100 + idx);
          const curObj    = (CFG.curs || []).find(x => x.c === CUR) || { r: 1, c: 'EGP' };
          const priceDisp = (s.price || 0) / curObj.r;
          const priceFmt  = priceDisp.toFixed(priceDisp >= 10 ? 2 : 4) + ' ' + CUR;

          const opt = mk('div', 'cdd-option');
          opt.style.cssText = 'gap:8px;padding:8px 12px;align-items:center';
          if (multiApp) opt.style.paddingRight = '28px'; /* indent under group */

          const icWrap = mk('div', 'cdd-opt-icon');
          icWrap.style.cssText = `background:${ACLR[app] || 'var(--c2)'};width:28px;height:28px;border-radius:6px;display:flex;align-items:center;justify-content:center;flex-shrink:0`;
          const ic = mk('i', AICO[app] || 'fas fa-cube');
          ic.style.cssText = 'font-size:12px;color:#fff';
          icWrap.appendChild(ic);

          const info = mk('div');
          info.style.cssText = 'flex:1;min-width:0;overflow:hidden';
          const nm = mk('div', '', s.name || 'خدمة');
          nm.style.cssText = 'font-size:11.5px;font-weight:600;color:var(--t0);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;word-break:break-word;line-height:1.35';
          const idSpan = mk('span', '', '#' + dispId);
          idSpan.style.cssText = 'font-size:9.5px;color:var(--t3);font-family:var(--mono)';
          info.appendChild(nm); info.appendChild(idSpan);

          const pr = mk('div');
          pr.style.cssText = 'text-align:left;flex-shrink:0';
          const prVal = mk('div', '', priceFmt);
          prVal.style.cssText = 'font-size:11px;font-weight:800;color:var(--blue);white-space:nowrap';
          const prLbl = mk('div', '', '/ 1000');
          prLbl.style.cssText = 'font-size:9px;color:var(--t3);text-align:left';
          pr.appendChild(prVal); pr.appendChild(prLbl);

          opt.appendChild(icWrap); opt.appendChild(info); opt.appendChild(pr);
          opt.addEventListener('click', () => {
            window.SEL_SVC = s;
            if (typeof window.selectService === 'function') window.selectService(s);
            if (typeof window.closeAllCDD  === 'function') window.closeAllCDD();
          });
          menu.appendChild(opt);
        });
      });
    };
  }

  /* ══════════════════════════════════════════════════════
     Patch nav() — يتعامل مع 'apikeys' و 'apidocs'
  ══════════════════════════════════════════════════════ */
  function patchNav() {
    try { if (typeof PG !== 'undefined') { PG['apikeys'] = 'مفاتيح API'; PG['apidocs'] = 'دليل API'; } } catch (_) {}
    const _orig = window.nav;
    window.nav = function (name) {
      if (name === 'apikeys' || name === 'apidocs') {
        document.querySelectorAll('.pg').forEach(p => p.classList.remove('on'));
        const pg = document.getElementById('pg-' + name);
        if (pg) pg.classList.add('on');
        document.querySelectorAll('.sb-link,.sb-sub,.mn,.mn-c').forEach(i => i.classList.remove('on'));
        ['snav-' + name, 'mnav-' + name].forEach(id => { const el = document.getElementById(id); if (el) el.classList.add('on'); });
        const pt = document.getElementById('pg-ttl');
        if (pt) pt.textContent = name === 'apikeys' ? 'مفاتيح API' : 'دليل API';
        if (name === 'apikeys') window.apkLoadKeys();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      /* عند التنقل لصفحة ثانية امسح تحديد API */
      document.querySelectorAll('.sb-sub').forEach(i => i.classList.remove('on'));
      _orig.call(this, name);
    };
  }

  /* ══════════════════════════════════════════════════════
     Sidebar — مجموعة المطورون بـ sub-items
  ══════════════════════════════════════════════════════ */
  function addSidebar() {
    if (document.getElementById('snav-apikeys')) return;
    const sbBody = document.querySelector('.sb-body');
    if (!sbBody) return;
    const ref = document.getElementById('snav-admin') || document.querySelector('.sb-foot');

    /* Group label */
    const grp = document.createElement('div');
    grp.className = 'sb-grp';
    grp.textContent = 'المطورون';

    /* Parent link (non-clickable label) */
    const parent = document.createElement('div');
    parent.className = 'sb-link';
    parent.style.cssText = 'cursor:default;opacity:.85';
    parent.innerHTML = '<i class="fas fa-code" style="color:var(--pur)"></i><span style="color:var(--t1)">واجهة API</span>';

    /* Sub: مفاتيح */
    const sub1 = document.createElement('div');
    sub1.className = 'sb-sub';
    sub1.id = 'snav-apikeys';
    sub1.innerHTML = '<span class="sb-sub-dot"></span><span>مفاتيح API</span>';
    sub1.onclick = () => { window.nav('apikeys'); if (typeof closeSB === 'function') closeSB(); };

    /* Sub: دليل */
    const sub2 = document.createElement('div');
    sub2.className = 'sb-sub';
    sub2.id = 'snav-apidocs';
    sub2.innerHTML = '<span class="sb-sub-dot"></span><span>دليل API</span>';
    sub2.onclick = () => { window.nav('apidocs'); if (typeof closeSB === 'function') closeSB(); };

    [grp, parent, sub1, sub2].forEach(el => {
      if (ref) sbBody.insertBefore(el, ref);
      else sbBody.appendChild(el);
    });
  }

  /* ══════════════════════════════════════════════════════
     Add pages to .pc
  ══════════════════════════════════════════════════════ */
  function addPages() {
    const pc = document.querySelector('.pc');
    if (!pc) return;
    if (!document.getElementById('pg-apikeys')) {
      const pk = document.createElement('div');
      pk.id = 'pg-apikeys'; pk.className = 'pg';
      pk.innerHTML = keysPageHtml();
      pc.appendChild(pk);
    }
    if (!document.getElementById('pg-apidocs')) {
      const pd = document.createElement('div');
      pd.id = 'pg-apidocs'; pd.className = 'pg';
      pd.innerHTML = docsPageHtml();
      pc.appendChild(pd);
    }
  }

  function injectCSS() {
    const s = document.createElement('style');
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ══════════════════════════════════════════════════════
     Boot
  ══════════════════════════════════════════════════════ */
  let tries = 0;
  const boot = setInterval(() => {
    if (++tries > 40) return clearInterval(boot);
    const ready = window.DB      !== undefined
               && typeof window.nav      === 'function'
               && typeof window.ALL_CATS !== 'undefined'
               && document.querySelector('.sb-body')
               && document.querySelector('.pc');
    if (!ready) return;
    clearInterval(boot);
    injectCSS();
    patchNav();
    addSidebar();
    addPages();
    overrideBuildSvcDD();
  }, 300);

})();

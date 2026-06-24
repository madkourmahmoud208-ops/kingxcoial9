/**
 * King Social — API Addon v2
 * يضيف صفحة API كاملة جوه التطبيق:
 *   - تبويب 1: إدارة المفاتيح
 *   - تبويب 2: دليل API
 */
(function () {
  'use strict';

  /* ─── CSS ──────────────────────────────────────────── */
  const CSS = `
  /* layout */
  #pg-api .a-tabs{display:flex;gap:4px;margin-bottom:20px;background:var(--bg2);border:1px solid var(--bd);border-radius:var(--r2);padding:4px}
  #pg-api .a-tab{flex:1;padding:9px;text-align:center;border-radius:var(--r);font-size:12px;font-weight:700;cursor:pointer;color:var(--t2);transition:all .18s}
  #pg-api .a-tab.on{background:var(--bg3);color:var(--t0);box-shadow:0 2px 8px rgba(0,0,0,.4)}
  #pg-api .a-panel{display:none}
  #pg-api .a-panel.on{display:block}

  /* stats */
  #pg-api .ag{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:18px}
  #pg-api .as{background:var(--bg2);border:1px solid var(--bd);border-radius:var(--r2);padding:14px;text-align:center}
  #pg-api .as .v{font-size:24px;font-weight:900;color:var(--pur)}
  #pg-api .as .l{font-size:10.5px;color:var(--t2);margin-top:4px}

  /* key rows */
  #pg-api .ac{background:var(--bg2);border:1px solid var(--bd);border-radius:var(--r2);padding:16px 18px;margin-bottom:14px}
  #pg-api .ach{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
  #pg-api .ach h3{font-size:13px;font-weight:700;display:flex;align-items:center;gap:8px}
  #pg-api .kr{display:flex;align-items:center;gap:8px;padding:10px 12px;background:var(--bg1);border:1px solid var(--bd);border-radius:var(--r);margin-bottom:7px;transition:var(--tr)}
  #pg-api .kr:last-child{margin-bottom:0}
  #pg-api .kp{font-family:var(--mono);font-size:11px;color:var(--pur);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  #pg-api .kb{padding:2px 8px;border-radius:12px;font-size:10px;font-weight:700;flex-shrink:0}
  #pg-api .kb.on{background:var(--gs);color:var(--grn)}
  #pg-api .kb.off{background:var(--rs);color:var(--red)}
  #pg-api .kn{font-size:11px;background:var(--c1);color:var(--t1);padding:2px 8px;border-radius:4px;flex-shrink:0;max-width:110px;overflow:hidden;text-overflow:ellipsis}
  #pg-api .km{font-size:10px;color:var(--t3);flex-shrink:0}
  #pg-api .kd{padding:4px 9px;background:transparent;color:var(--red);border:1px solid var(--red);border-radius:5px;font-size:10px;font-weight:700;cursor:pointer;transition:var(--tr);font-family:var(--font);flex-shrink:0}
  #pg-api .kd:hover{background:var(--red);color:#fff}
  #pg-api .empty-msg{text-align:center;padding:28px;color:var(--t2)}
  #pg-api .empty-msg i{font-size:26px;display:block;margin-bottom:8px;color:var(--t3)}
  #pg-api .btn-new{padding:6px 14px;background:var(--ps);color:var(--pur);border:1px solid var(--pur);border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;transition:var(--tr);font-family:var(--font)}
  #pg-api .btn-new:hover{background:var(--pur);color:#fff}

  /* docs tab */
  #pg-api .d-url{font-family:var(--mono);font-size:12px;background:var(--bg);border:1px solid var(--bd2);border-radius:var(--r);padding:11px 14px;color:var(--pur);margin:10px 0;word-break:break-all}
  #pg-api .d-info{padding:12px 14px;border-radius:var(--r);font-size:12px;margin:12px 0;display:flex;gap:8px;align-items:flex-start;line-height:1.7}
  #pg-api .d-info.tip{background:var(--bs);border:1px solid rgba(91,164,255,.25);color:var(--blue)}
  #pg-api .d-info.warn{background:var(--ys);border:1px solid rgba(255,200,66,.25);color:var(--ylw)}
  #pg-api .d-ep{background:var(--bg2);border:1px solid var(--bd);border-radius:var(--r2);margin-bottom:10px;overflow:hidden}
  #pg-api .d-eph{display:flex;align-items:center;gap:10px;padding:13px 16px;cursor:pointer;transition:background .15s}
  #pg-api .d-eph:hover{background:var(--bg3)}
  #pg-api .d-epb{padding:0 16px 16px;display:none}
  #pg-api .d-ep.open .d-epb{display:block}
  #pg-api .d-ep.open .d-chv{transform:rotate(180deg)}
  #pg-api .d-chv{color:var(--t3);transition:transform .2s;font-size:10px;margin-right:auto}
  #pg-api .mth{padding:2px 9px;border-radius:5px;font-size:10px;font-weight:800;font-family:var(--mono)}
  #pg-api .mth.g{background:var(--bs);color:var(--blue);border:1px solid rgba(91,164,255,.3)}
  #pg-api .mth.p{background:var(--gs);color:var(--grn);border:1px solid rgba(61,232,160,.3)}
  #pg-api .d-path{font-family:var(--mono);font-size:12px;color:var(--t0);flex:1}
  #pg-api .d-eplbl{font-size:11.5px;color:var(--t2)}
  #pg-api .d-tbl{width:100%;border-collapse:collapse;font-size:11.5px;margin:10px 0}
  #pg-api .d-tbl th{padding:7px 10px;background:var(--bg1);color:var(--t2);font-weight:600;text-align:right;border-bottom:1px solid var(--bd)}
  #pg-api .d-tbl td{padding:7px 10px;border-bottom:1px solid var(--bd);color:var(--t1);vertical-align:top}
  #pg-api .d-tbl td:first-child{font-family:var(--mono);color:var(--pur);font-size:10.5px}
  #pg-api .req{color:var(--red);font-size:9.5px;font-weight:700}
  #pg-api .d-code{background:var(--bg);border:1px solid var(--bd2);border-radius:var(--r);padding:12px 14px;font-family:var(--mono);font-size:11px;color:var(--t1);overflow-x:auto;line-height:1.7;position:relative;margin-top:10px}
  #pg-api .d-code pre{white-space:pre}
  #pg-api .d-copy{position:absolute;top:8px;left:8px;padding:3px 9px;background:var(--c1);border:1px solid var(--bd);border-radius:5px;font-size:10px;font-weight:700;color:var(--t2);cursor:pointer}
  #pg-api .d-copy:hover{background:var(--c2);color:var(--t0)}
  #pg-api .etbl{width:100%;border-collapse:collapse;font-size:11.5px}
  #pg-api .etbl th{padding:7px 10px;background:var(--bg1);color:var(--t2);font-weight:600;text-align:right;border-bottom:1px solid var(--bd)}
  #pg-api .etbl td{padding:7px 10px;border-bottom:1px solid var(--bd);color:var(--t1)}
  #pg-api .ec{font-family:var(--mono);color:var(--ylw);font-size:11px}
  #pg-api .em{font-family:var(--mono);color:var(--red);font-size:10px}
  #pg-api .hl-k{color:var(--pur)}
  #pg-api .hl-s{color:var(--grn)}
  #pg-api .hl-n{color:var(--ylw)}
  #pg-api .hl-w{color:var(--blue)}
  #pg-api .hl-c{color:var(--t3);font-style:italic}

  /* modal */
  #ap-modal{display:none;position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:99999;align-items:center;justify-content:center;padding:16px}
  #ap-modal.show{display:flex}
  .ap-box{background:var(--bg2);border:1px solid var(--bd2);border-radius:var(--r3);padding:26px;width:min(420px,100%)}
  .ap-box h2{font-size:15px;font-weight:800;margin-bottom:16px;display:flex;align-items:center;gap:8px}
  .ap-inp{width:100%;padding:10px 14px;background:var(--bg1);border:1px solid var(--bd);border-radius:var(--r);color:var(--t0);font-size:13px;font-family:var(--font);transition:var(--tr)}
  .ap-inp:focus{border-color:var(--pur);outline:none}
  .ap-wbox{background:var(--ys);border:1px solid rgba(255,200,66,.3);border-radius:var(--r);padding:10px 12px;font-size:11.5px;color:var(--ylw);margin-bottom:12px;display:flex;gap:8px;line-height:1.6}
  .ap-kshow{font-family:var(--mono);font-size:11px;background:var(--bg);padding:12px;border-radius:var(--r);border:1px dashed var(--pur);color:var(--pur);word-break:break-all;margin:10px 0;line-height:1.8;user-select:all}
  .ap-row{display:flex;gap:8px;margin-top:12px}
  .ap-bp{flex:1;padding:10px;background:var(--pur);color:#fff;border:none;border-radius:var(--r);font-weight:700;font-size:13px;cursor:pointer;transition:var(--tr);font-family:var(--font)}
  .ap-bp:disabled{opacity:.5;cursor:not-allowed}
  .ap-bs{padding:10px 14px;background:var(--bg1);border:1px solid var(--bd);border-radius:var(--r);color:var(--t1);cursor:pointer;font-size:12px;font-family:var(--font)}
  @media(max-width:600px){#pg-api .ag{grid-template-columns:1fr 1fr}}
  `;

  /* ─── Page HTML ─────────────────────────────────────── */
  function pageHtml() {
    return `
    <div class="pg-hd">
      <h1 style="display:flex;align-items:center;gap:10px">
        <i class="fas fa-code" style="color:var(--pur)"></i>واجهة API
      </h1>
      <p style="color:var(--t2);font-size:12.5px;margin-top:4px">اربط تطبيقاتك بـ King Social عبر مفاتيح API آمنة</p>
    </div>

    <!-- Tabs -->
    <div class="a-tabs">
      <div class="a-tab on" id="atab-keys" onclick="apTab('keys')"><i class="fas fa-key"></i> مفاتيحي</div>
      <div class="a-tab"    id="atab-docs" onclick="apTab('docs')"><i class="fas fa-book"></i> دليل API</div>
    </div>

    <!-- ══ TAB 1: KEYS ══ -->
    <div class="a-panel on" id="apanel-keys">
      <div class="ag">
        <div class="as"><div class="v" id="ast-t">—</div><div class="l">إجمالي المفاتيح</div></div>
        <div class="as"><div class="v" id="ast-a">—</div><div class="l">نشطة</div></div>
        <div class="as"><div class="v" id="ast-c">—</div><div class="l">الاستدعاءات</div></div>
      </div>
      <div class="ac">
        <div class="ach">
          <h3><i class="fas fa-key" style="color:var(--pur)"></i> مفاتيحك</h3>
          <button class="btn-new" onclick="apShowModal()"><i class="fas fa-plus"></i> مفتاح جديد</button>
        </div>
        <div id="ap-list"><div class="empty-msg"><i class="fas fa-circle-notch fa-spin"></i></div></div>
      </div>
      <div class="ac">
        <div class="ach"><h3><i class="fas fa-circle-info" style="color:var(--blue)"></i> كيفية الاستخدام</h3></div>
        <div style="font-size:12px;color:var(--t1);margin-bottom:6px">أرسل المفتاح في كل طلب:</div>
        <div class="d-url">X-API-Key: ks_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</div>
        <div style="font-size:12px;color:var(--t1);margin:10px 0 6px">أو كـ query parameter:</div>
        <div class="d-url">/api/v1/services?api_key=ks_live_...</div>
      </div>
    </div>

    <!-- ══ TAB 2: DOCS ══ -->
    <div class="a-panel" id="apanel-docs">

      <!-- Base URL -->
      <div class="ac">
        <div class="ach"><h3><i class="fas fa-link" style="color:var(--blue)"></i> عنوان القاعدة (Base URL)</h3></div>
        <div class="d-url">https://kingxsocial.vercel.app/api/v1</div>
        <div class="d-info tip"><i class="fas fa-circle-info" style="flex-shrink:0"></i> كل الردود بصيغة JSON. طلب ناجح = <code>success: true</code> في الرد.</div>
      </div>

      <!-- Auth -->
      <div class="ac">
        <div class="ach"><h3><i class="fas fa-key" style="color:var(--pur)"></i> المصادقة (Authentication)</h3></div>
        <div style="font-size:12px;color:var(--t1);margin-bottom:8px">الطريقة الأولى — Header (مُفضّل)</div>
        <div class="d-url">X-API-Key: ks_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</div>
        <div style="font-size:12px;color:var(--t1);margin:10px 0 6px">الطريقة الثانية — Query Parameter</div>
        <div class="d-url">/api/v1/services?api_key=ks_live_...</div>
        <div class="d-info warn"><i class="fas fa-triangle-exclamation" style="flex-shrink:0"></i> لا تشارك مفتاحك. لو اتسرّب ارجع لتبويب "مفاتيحي" وأوقفه فوراً.</div>
      </div>

      <!-- Rate Limits -->
      <div class="ac">
        <div class="ach"><h3><i class="fas fa-gauge" style="color:var(--ylw)"></i> حدود الطلبات</h3></div>
        <table class="d-tbl">
          <thead><tr><th>النطاق</th><th>الحد</th><th>النافذة</th></tr></thead>
          <tbody>
            <tr><td style="color:var(--t1)">/api/v1/*</td><td style="color:var(--t1)">120 طلب</td><td style="color:var(--t1)">كل دقيقة</td></tr>
          </tbody>
        </table>
      </div>

      <!-- Endpoints title -->
      <div style="font-size:13px;font-weight:800;color:var(--t0);margin:20px 0 12px;display:flex;align-items:center;gap:8px">
        <i class="fas fa-list" style="color:var(--teal)"></i> نقاط النهاية
      </div>

      <!-- GET /services -->
      <div class="d-ep open">
        <div class="d-eph" onclick="this.closest('.d-ep').classList.toggle('open')">
          <span class="mth g">GET</span>
          <span class="d-path">/api/v1/services</span>
          <span class="d-eplbl">قائمة كل الخدمات</span>
          <i class="fas fa-chevron-down d-chv"></i>
        </div>
        <div class="d-epb">
          <div style="font-size:11.5px;color:var(--t2);margin-bottom:6px">Query Parameters (اختيارية)</div>
          <table class="d-tbl">
            <thead><tr><th>Parameter</th><th>النوع</th><th>الوصف</th></tr></thead>
            <tbody>
              <tr><td>platform</td><td style="color:var(--t1)">string</td><td style="color:var(--t1)">فلتر بالمنصة: tiktok, instagram, ...</td></tr>
              <tr><td>category</td><td style="color:var(--t1)">string</td><td style="color:var(--t1)">فلتر بالفئة (جزئي)</td></tr>
              <tr><td>search</td><td style="color:var(--t1)">string</td><td style="color:var(--t1)">بحث في الاسم والفئة</td></tr>
            </tbody>
          </table>
          <div class="d-code">
            <button class="d-copy" onclick="doCopy(this)">نسخ</button>
            <pre>curl -X GET \
  "https://kingxsocial.vercel.app/api/v1/services?platform=tiktok" \
  -H "X-API-Key: ks_live_xxxx..."</pre>
          </div>
          <div style="font-size:11px;color:var(--t2);margin:10px 0 5px">نموذج الرد</div>
          <div class="d-code"><pre>{
  <span class="hl-k">"success"</span>: <span class="hl-w">true</span>,
  <span class="hl-k">"count"</span>: <span class="hl-n">24</span>,
  <span class="hl-k">"services"</span>: [{
    <span class="hl-k">"id"</span>: <span class="hl-s">"svc001"</span>,
    <span class="hl-k">"name"</span>: <span class="hl-s">"متابعين تيك توك — عرب"</span>,
    <span class="hl-k">"platform"</span>: <span class="hl-s">"tiktok"</span>,
    <span class="hl-k">"price_per_1000"</span>: <span class="hl-n">12.5</span>,
    <span class="hl-k">"currency"</span>: <span class="hl-s">"EGP"</span>,
    <span class="hl-k">"min"</span>: <span class="hl-n">100</span>, <span class="hl-k">"max"</span>: <span class="hl-n">50000</span>,
    <span class="hl-k">"refill_guarantee"</span>: <span class="hl-w">true</span>
  }]
}</pre></div>
        </div>
      </div>

      <!-- GET /services/:id -->
      <div class="d-ep">
        <div class="d-eph" onclick="this.closest('.d-ep').classList.toggle('open')">
          <span class="mth g">GET</span>
          <span class="d-path">/api/v1/services/:id</span>
          <span class="d-eplbl">تفاصيل خدمة واحدة</span>
          <i class="fas fa-chevron-down d-chv"></i>
        </div>
        <div class="d-epb">
          <table class="d-tbl">
            <thead><tr><th>Path Param</th><th>الوصف</th></tr></thead>
            <tbody><tr><td>id <span class="req">*مطلوب</span></td><td style="color:var(--t1)">معرّف الخدمة (id من قائمة الخدمات)</td></tr></tbody>
          </table>
          <div class="d-code">
            <button class="d-copy" onclick="doCopy(this)">نسخ</button>
            <pre>curl -X GET \
  "https://kingxsocial.vercel.app/api/v1/services/svc001" \
  -H "X-API-Key: ks_live_xxxx..."</pre>
          </div>
        </div>
      </div>

      <!-- GET /balance -->
      <div class="d-ep">
        <div class="d-eph" onclick="this.closest('.d-ep').classList.toggle('open')">
          <span class="mth g">GET</span>
          <span class="d-path">/api/v1/balance</span>
          <span class="d-eplbl">رصيد الحساب</span>
          <i class="fas fa-chevron-down d-chv"></i>
        </div>
        <div class="d-epb">
          <div class="d-code">
            <button class="d-copy" onclick="doCopy(this)">نسخ</button>
            <pre>curl -X GET \
  "https://kingxsocial.vercel.app/api/v1/balance" \
  -H "X-API-Key: ks_live_xxxx..."</pre>
          </div>
          <div class="d-code" style="margin-top:8px"><pre>{
  <span class="hl-k">"success"</span>: <span class="hl-w">true</span>,
  <span class="hl-k">"username"</span>: <span class="hl-s">"Ahmed123"</span>,
  <span class="hl-k">"balance"</span>: <span class="hl-s">"142.50"</span>,
  <span class="hl-k">"currency"</span>: <span class="hl-s">"EGP"</span>,
  <span class="hl-k">"level"</span>: <span class="hl-s">"محترف"</span>
}</pre></div>
        </div>
      </div>

      <!-- POST /order -->
      <div class="d-ep">
        <div class="d-eph" onclick="this.closest('.d-ep').classList.toggle('open')">
          <span class="mth p">POST</span>
          <span class="d-path">/api/v1/order</span>
          <span class="d-eplbl">إنشاء طلب جديد</span>
          <i class="fas fa-chevron-down d-chv"></i>
        </div>
        <div class="d-epb">
          <div style="font-size:11.5px;color:var(--t2);margin-bottom:6px">Request Body (JSON)</div>
          <table class="d-tbl">
            <thead><tr><th>الحقل</th><th>النوع</th><th>الوصف</th></tr></thead>
            <tbody>
              <tr><td>service_id <span class="req">*</span></td><td style="color:var(--t1)">string</td><td style="color:var(--t1)">معرّف الخدمة</td></tr>
              <tr><td>link <span class="req">*</span></td><td style="color:var(--t1)">string</td><td style="color:var(--t1)">رابط الحساب أو المنشور</td></tr>
              <tr><td>quantity <span class="req">*</span></td><td style="color:var(--t1)">number</td><td style="color:var(--t1)">العدد المطلوب (ضمن min/max)</td></tr>
            </tbody>
          </table>
          <div class="d-code">
            <button class="d-copy" onclick="doCopy(this)">نسخ</button>
            <pre>curl -X POST \
  "https://kingxsocial.vercel.app/api/v1/order" \
  -H "X-API-Key: ks_live_xxxx..." \
  -H "Content-Type: application/json" \
  -d '{
    "service_id": "svc001",
    "link": "https://www.tiktok.com/@username",
    "quantity": 1000
  }'</pre>
          </div>
          <div class="d-code" style="margin-top:8px"><pre>{
  <span class="hl-k">"success"</span>: <span class="hl-w">true</span>,
  <span class="hl-k">"order"</span>: {
    <span class="hl-k">"order_id"</span>: <span class="hl-s">"ORD-API-1735000000000-A1B2C"</span>,
    <span class="hl-k">"service"</span>: <span class="hl-s">"متابعين تيك توك"</span>,
    <span class="hl-k">"quantity"</span>: <span class="hl-n">1000</span>,
    <span class="hl-k">"charge"</span>: <span class="hl-n">12.5</span>,
    <span class="hl-k">"currency"</span>: <span class="hl-s">"EGP"</span>,
    <span class="hl-k">"status"</span>: <span class="hl-s">"pending"</span>,
    <span class="hl-k">"new_balance"</span>: <span class="hl-n">130.0</span>
  }
}</pre></div>
        </div>
      </div>

      <!-- GET /orders -->
      <div class="d-ep">
        <div class="d-eph" onclick="this.closest('.d-ep').classList.toggle('open')">
          <span class="mth g">GET</span>
          <span class="d-path">/api/v1/orders</span>
          <span class="d-eplbl">قائمة آخر 100 طلب</span>
          <i class="fas fa-chevron-down d-chv"></i>
        </div>
        <div class="d-epb">
          <div class="d-code">
            <button class="d-copy" onclick="doCopy(this)">نسخ</button>
            <pre>curl -X GET \
  "https://kingxsocial.vercel.app/api/v1/orders" \
  -H "X-API-Key: ks_live_xxxx..."</pre>
          </div>
        </div>
      </div>

      <!-- GET /order/:id -->
      <div class="d-ep">
        <div class="d-eph" onclick="this.closest('.d-ep').classList.toggle('open')">
          <span class="mth g">GET</span>
          <span class="d-path">/api/v1/order/:id</span>
          <span class="d-eplbl">حالة طلب واحد</span>
          <i class="fas fa-chevron-down d-chv"></i>
        </div>
        <div class="d-epb">
          <table class="d-tbl" style="margin-bottom:10px">
            <thead><tr><th>حالة الطلب</th><th>المعنى</th></tr></thead>
            <tbody>
              <tr><td>pending</td><td style="color:var(--t1)">في الانتظار</td></tr>
              <tr><td>in_progress</td><td style="color:var(--t1)">جارٍ التنفيذ</td></tr>
              <tr><td>completed</td><td style="color:var(--t1)">اكتمل ✅</td></tr>
              <tr><td>partial</td><td style="color:var(--t1)">اكتمل جزئياً</td></tr>
              <tr><td>cancelled</td><td style="color:var(--t1)">ملغي ❌</td></tr>
            </tbody>
          </table>
          <div class="d-code">
            <button class="d-copy" onclick="doCopy(this)">نسخ</button>
            <pre>curl -X GET \
  "https://kingxsocial.vercel.app/api/v1/order/ORD-API-xxx" \
  -H "X-API-Key: ks_live_xxxx..."</pre>
          </div>
        </div>
      </div>

      <!-- Error codes -->
      <div class="ac" style="margin-top:16px">
        <div class="ach"><h3><i class="fas fa-triangle-exclamation" style="color:var(--red)"></i> أكواد الأخطاء</h3></div>
        <table class="etbl">
          <thead><tr><th>HTTP</th><th>error</th><th>السبب</th></tr></thead>
          <tbody>
            <tr><td class="ec">401</td><td class="em">unauthorized</td><td>مفتاح API مش موجود</td></tr>
            <tr><td class="ec">403</td><td class="em">forbidden</td><td>المفتاح غلط أو موقوف</td></tr>
            <tr><td class="ec">400</td><td class="em">bad_request</td><td>حقول ناقصة أو قيم خاطئة</td></tr>
            <tr><td class="ec">400</td><td class="em">invalid_quantity</td><td>الكمية خارج نطاق الخدمة</td></tr>
            <tr><td class="ec">402</td><td class="em">insufficient_balance</td><td>الرصيد أقل من تكلفة الطلب</td></tr>
            <tr><td class="ec">404</td><td class="em">not_found</td><td>الخدمة أو الطلب غير موجود</td></tr>
            <tr><td class="ec">429</td><td class="em">rate_limit_exceeded</td><td>تجاوزت الحد — انتظر دقيقة</td></tr>
            <tr><td class="ec">500</td><td class="em">server_error</td><td>خطأ داخلي — حاول مرة أخرى</td></tr>
          </tbody>
        </table>
      </div>

      <!-- JS Example -->
      <div class="ac">
        <div class="ach"><h3><i class="fas fa-code" style="color:var(--teal)"></i> مثال JavaScript كامل</h3></div>
        <div class="d-code">
          <button class="d-copy" onclick="doCopy(this)">نسخ</button>
          <pre><span class="hl-w">const</span> API_KEY  = <span class="hl-s">'ks_live_xxxx...'</span>;
<span class="hl-w">const</span> BASE_URL = <span class="hl-s">'https://kingxsocial.vercel.app/api/v1'</span>;

<span class="hl-w">async function</span> ks(path, method = <span class="hl-s">'GET'</span>, body = <span class="hl-w">null</span>) {
  <span class="hl-w">const</span> res = <span class="hl-w">await</span> fetch(BASE_URL + path, {
    method,
    headers: { <span class="hl-s">'X-API-Key'</span>: API_KEY, <span class="hl-s">'Content-Type'</span>: <span class="hl-s">'application/json'</span> },
    body: body ? JSON.stringify(body) : <span class="hl-w">null</span>
  });
  <span class="hl-w">const</span> data = <span class="hl-w">await</span> res.json();
  <span class="hl-w">if</span> (!data.success) <span class="hl-w">throw new</span> Error(data.message || data.error);
  <span class="hl-w">return</span> data;
}

<span class="hl-c">// مثال: اطلب 500 متابع تيك توك</span>
<span class="hl-w">const</span> { services } = <span class="hl-w">await</span> ks(<span class="hl-s">'/services?platform=tiktok'</span>);
<span class="hl-w">const</span> svc = services.find(s => s.name.includes(<span class="hl-s">'متابعين'</span>));
<span class="hl-w">const</span> { balance } = <span class="hl-w">await</span> ks(<span class="hl-s">'/balance'</span>);
<span class="hl-w">const</span> { order } = <span class="hl-w">await</span> ks(<span class="hl-s">'/order'</span>, <span class="hl-s">'POST'</span>, {
  service_id: svc.id,
  link:       <span class="hl-s">'https://www.tiktok.com/@myusername'</span>,
  quantity:   <span class="hl-n">500</span>
});
console.log(<span class="hl-s">`✅ ${order.order_id} — تم خصم ${order.charge} EGP`</span>);</pre>
        </div>
      </div>

    </div><!-- end docs panel -->

    <!-- Modal -->
    <div id="ap-modal">
      <div class="ap-box">
        <h2><i class="fas fa-key" style="color:var(--pur)"></i> مفتاح API جديد</h2>
        <div id="ap-mform">
          <div style="font-size:12px;color:var(--t2);margin-bottom:6px">اسم المفتاح</div>
          <input id="ap-kname" class="ap-inp" type="text" placeholder="مثال: موقعي، بوت التيليجرام..." maxlength="40" autocomplete="off">
          <div class="ap-row">
            <button class="ap-bp" id="ap-cbtn" onclick="apCreateKey()"><i class="fas fa-plus"></i> إنشاء</button>
            <button class="ap-bs" onclick="apHideModal()">إلغاء</button>
          </div>
        </div>
        <div id="ap-mresult" style="display:none">
          <div class="ap-wbox"><i class="fas fa-triangle-exclamation" style="flex-shrink:0;margin-top:2px"></i><span><strong>احفظه الآن!</strong> لن يُعرض هذا المفتاح مرة أخرى.</span></div>
          <div class="ap-kshow" id="ap-kval">ks_live_...</div>
          <div class="ap-row">
            <button class="ap-bp" id="ap-cpbtn" onclick="apCopyKey()" style="background:var(--ps);color:var(--pur);border:1px solid var(--pur)"><i class="fas fa-copy"></i> نسخ</button>
            <button class="ap-bp" onclick="apHideModal()" style="background:var(--grn);color:#000;flex:.7"><i class="fas fa-check"></i> تم</button>
          </div>
        </div>
      </div>
    </div>
    `;
  }

  /* ─── Tab switcher ──────────────────────────────────── */
  window.apTab = function (name) {
    document.querySelectorAll('#pg-api .a-tab').forEach(t => t.classList.remove('on'));
    document.querySelectorAll('#pg-api .a-panel').forEach(p => p.classList.remove('on'));
    const tab   = document.getElementById('atab-' + name);
    const panel = document.getElementById('apanel-' + name);
    if (tab)   tab.classList.add('on');
    if (panel) panel.classList.add('on');
    if (name === 'keys') window.apLoadKeys();
  };

  /* ─── Copy button in docs ───────────────────────────── */
  window.doCopy = function (btn) {
    const pre = btn.closest('.d-code').querySelector('pre');
    const txt = pre ? pre.textContent : '';
    navigator.clipboard.writeText(txt).then(() => {
      btn.textContent = 'تم ✓';
      setTimeout(() => btn.textContent = 'نسخ', 1800);
    });
  };

  /* ─── Load keys ─────────────────────────────────────── */
  window.apLoadKeys = function () {
    if (!window.CU || !window.DB) return;
    const list = document.getElementById('ap-list');
    if (!list) return;
    list.innerHTML = '<div class="empty-msg"><i class="fas fa-circle-notch fa-spin"></i></div>';
    DB.ref('userApiKeys/' + CU.u).once('value').then(snap => {
      const data = snap.val();
      const ev   = id => document.getElementById(id);
      if (!data) {
        if (ev('ast-t')) ev('ast-t').textContent = '0';
        if (ev('ast-a')) ev('ast-a').textContent = '0';
        if (ev('ast-c')) ev('ast-c').textContent = '0';
        list.innerHTML = '<div class="empty-msg"><i class="fas fa-key"></i><div>لا توجد مفاتيح بعد</div></div>';
        return;
      }
      const keys = Object.values(data);
      if (ev('ast-t')) ev('ast-t').textContent = keys.length;
      if (ev('ast-a')) ev('ast-a').textContent = keys.filter(k => k.isActive !== false).length;
      if (ev('ast-c')) ev('ast-c').textContent = keys.reduce((s, k) => s + (k.usageCount || 0), 0);
      list.innerHTML = Object.entries(data)
        .sort((a, b) => new Date(b[1].createdAt) - new Date(a[1].createdAt))
        .map(([hash, k]) => {
          const on = k.isActive !== false;
          const dt = k.createdAt ? new Date(k.createdAt).toLocaleDateString('ar-EG', {year:'numeric',month:'short',day:'numeric'}) : '';
          return `<div class="kr" style="${on ? '' : 'opacity:.5'}">
            <span class="kp">${k.keyPrefix || 'ks_live_'}••••••••••••••••••</span>
            <span class="kb ${on ? 'on' : 'off'}">${on ? 'نشط' : 'موقوف'}</span>
            <span class="kn" title="${k.keyName || ''}">${k.keyName || 'بدون اسم'}</span>
            <span class="km">${dt}</span>
            ${k.usageCount ? `<span class="km" style="color:var(--pur)">${k.usageCount} طلب</span>` : ''}
            ${on ? `<button class="kd" onclick="apRevoke('${hash}')"><i class="fas fa-ban"></i></button>` : ''}
          </div>`;
        }).join('');
    });
  };

  /* ─── Modal ─────────────────────────────────────────── */
  window.apShowModal = function () {
    if (!window.CU) { if (typeof toast === 'function') toast('سجّل دخولك أولاً', 'err'); return; }
    document.getElementById('ap-mform').style.display   = '';
    document.getElementById('ap-mresult').style.display = 'none';
    document.getElementById('ap-kname').value = '';
    document.getElementById('ap-modal').classList.add('show');
    setTimeout(() => document.getElementById('ap-kname').focus(), 100);
  };
  window.apHideModal = function () {
    document.getElementById('ap-modal').classList.remove('show');
    window.apLoadKeys();
  };
  document.addEventListener('click', e => {
    const m = document.getElementById('ap-modal');
    if (m && e.target === m) window.apHideModal();
  });

  /* ─── Create key ────────────────────────────────────── */
  window.apCreateKey = async function () {
    if (!window.CU || !window.DB) return;
    const inp  = document.getElementById('ap-kname');
    const name = inp.value.trim();
    if (!name) { inp.style.borderColor = 'var(--red)'; setTimeout(() => inp.style.borderColor = '', 1500); return; }
    const btn = document.getElementById('ap-cbtn');
    btn.disabled = true; btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>';
    try {
      const rand    = Array.from(crypto.getRandomValues(new Uint8Array(32))).map(b => b.toString(36)).join('').replace(/[^a-z0-9]/g,'').substring(0, 40);
      const fullKey = 'ks_live_' + rand;
      const prefix  = fullKey.substring(0, 18);
      const buf     = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(fullKey));
      const hash    = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('').substring(0, 32);
      const now     = new Date().toISOString();
      const kd      = { keyName: name, keyPrefix: prefix, userId: CU.u, isActive: true, createdAt: now, lastUsedAt: null, usageCount: 0 };
      await Promise.all([
        DB.ref('apiKeys/' + hash).set(kd),
        DB.ref('userApiKeys/' + CU.u + '/' + hash).set({ keyName: name, keyPrefix: prefix, isActive: true, createdAt: now, usageCount: 0 })
      ]);
      window._apKey = fullKey;
      document.getElementById('ap-kval').textContent = fullKey;
      document.getElementById('ap-mform').style.display   = 'none';
      document.getElementById('ap-mresult').style.display = '';
    } catch (e) { if (typeof toast === 'function') toast('خطأ: ' + e.message, 'err'); }
    btn.disabled = false; btn.innerHTML = '<i class="fas fa-plus"></i> إنشاء';
  };

  /* ─── Copy generated key ────────────────────────────── */
  window.apCopyKey = function () {
    const k = window._apKey || document.getElementById('ap-kval').textContent;
    navigator.clipboard.writeText(k).then(() => {
      const b = document.getElementById('ap-cpbtn');
      b.innerHTML = '<i class="fas fa-check"></i> تم!';
      setTimeout(() => b.innerHTML = '<i class="fas fa-copy"></i> نسخ', 2000);
    });
  };

  /* ─── Revoke key ────────────────────────────────────── */
  window.apRevoke = async function (hash) {
    if (!confirm('⚠️ إيقاف هذا المفتاح؟\nأي تطبيق يستخدمه سيتوقف فوراً.')) return;
    try {
      await Promise.all([
        DB.ref('apiKeys/' + hash).update({ isActive: false }),
        DB.ref('userApiKeys/' + CU.u + '/' + hash).update({ isActive: false })
      ]);
      window.apLoadKeys();
      if (typeof toast === 'function') toast('تم إيقاف المفتاح', 'ok');
    } catch { if (typeof toast === 'function') toast('فشل الإيقاف', 'err'); }
  };

  /* ─── Patch nav() ───────────────────────────────────── */
  function patchNav() {
    try { PG['api'] = 'واجهة API'; } catch (_) {}
    const _orig = window.nav;
    window.nav = function (name) {
      if (name === 'api') {
        document.querySelectorAll('.pg').forEach(p => p.classList.remove('on'));
        const pg = document.getElementById('pg-api');
        if (pg) pg.classList.add('on');
        document.querySelectorAll('.sb-link,.mn,.mn-c').forEach(i => i.classList.remove('on'));
        ['snav-api','mnav-api'].forEach(id => { const el = document.getElementById(id); if (el) el.classList.add('on'); });
        const pt = document.getElementById('pg-ttl');
        if (pt) pt.textContent = 'واجهة API';
        window.apLoadKeys();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      _orig.call(this, name);
    };
  }

  /* ─── Add sidebar link ──────────────────────────────── */
  function addSidebar() {
    if (document.getElementById('snav-api')) return;
    const sbBody = document.querySelector('.sb-body');
    if (!sbBody) return;
    const ref = document.getElementById('snav-admin') || document.querySelector('.sb-foot');
    const grp  = Object.assign(document.createElement('div'), { className: 'sb-grp', textContent: 'المطورون' });
    const link = document.createElement('div');
    link.className = 'sb-link'; link.id = 'snav-api'; link.title = 'API';
    link.innerHTML = '<i class="fas fa-code"></i><span>واجهة API</span>';
    link.onclick = () => { window.nav('api'); if (typeof closeSB === 'function') closeSB(); };
    if (ref) { sbBody.insertBefore(grp, ref); sbBody.insertBefore(link, ref); }
    else      { sbBody.appendChild(grp);      sbBody.appendChild(link); }
  }

  /* ─── Add page ──────────────────────────────────────── */
  function addPage() {
    if (document.getElementById('pg-api')) return;
    const pc = document.querySelector('.pc');
    if (!pc) return;
    const pg = document.createElement('div');
    pg.id = 'pg-api'; pg.className = 'pg';
    pg.innerHTML = pageHtml();
    pc.appendChild(pg);
  }

  /* ─── Inject CSS ────────────────────────────────────── */
  function injectCSS() {
    const s = document.createElement('style');
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ─── Boot ──────────────────────────────────────────── */
  let tries = 0;
  const boot = setInterval(() => {
    if (++tries > 40) return clearInterval(boot);
    if (window.DB === undefined || typeof window.nav !== 'function' || !document.querySelector('.sb-body,.pc')) return;
    clearInterval(boot);
    injectCSS();
    patchNav();
    addSidebar();
    addPage();
  }, 300);

})();

/* Bear Bite API for Cloudflare Pages Functions.
   Storage: one KV namespace bound as "BB". Secret: ADMIN_SETUP_CODE (environment variable). */
const ITER = 100000; // PBKDF2 iterations (100000 is the maximum Cloudflare allows)
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SESSION_S = 12 * 3600;
const enc = new TextEncoder();
const uid = () => toHex(crypto.getRandomValues(new Uint8Array(5)));
const toHex = b => [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, "0")).join("");
const fromHex = s => new Uint8Array(s.match(/../g).map(h => parseInt(h, 16)));
const b64u = b => btoa(String.fromCharCode(...new Uint8Array(b))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const same = (a, b) => { a = String(a); b = String(b); let r = a.length ^ b.length; for (let i = 0; i < Math.max(a.length, b.length); i++) r |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0); return r === 0; };

const DEFAULTS = {
  business: { name: "Bear Bite", tagline: "Bite into goodness", heroTitle: "Bite into goodness.",
    heroText: "Choose from our menu, give us a call, and your order is ready when you arrive.",
    phoneDisplay: "+94 77 212 6006", phoneLink: "+94772126006", whatsapp: "", email: "",
    address: "2E Abeyrathne Mawatha, Boralesgamuwa 10290, Sri Lanka", mapQuery: "",
    facebook: "https://www.facebook.com/p/Bear-Bite-61590313485135/", instagram: "", tiktok: "",
    currency: "Rs.", timezone: "Asia/Colombo", footerText: "" },
  hours: DAYS.map(d => ({ day: d, open: "10:00", close: "21:00", closed: false })),
  status: { override: "auto", message: "" },
  announcement: { enabled: false, text: "" },
  categories: [
    { id: "c1", name: "Rice & Curry", icon: "curry", items: [
      { id: "i1", name: "Vegetable Rice & Curry", desc: "", price: "450", priceL: "", image: "", popular: false, soldOut: false, hidden: false },
      { id: "i2", name: "Egg Rice & Curry", desc: "", price: "500", priceL: "", image: "", popular: false, soldOut: false, hidden: false },
      { id: "i3", name: "Chicken Rice & Curry", desc: "", price: "550", priceL: "", image: "", popular: false, soldOut: false, hidden: false },
      { id: "i4", name: "Pork Rice & Curry", desc: "", price: "900", priceL: "", image: "", popular: false, soldOut: false, hidden: false } ] },
    { id: "c2", name: "Rice", icon: "rice", items: [
      { id: "i5", name: "Bear Bite Vegetable Rice", desc: "", price: "700", priceL: "1100", image: "", popular: false, soldOut: false, hidden: false },
      { id: "i6", name: "Bear Bite Chicken Rice", desc: "", price: "900", priceL: "1300", image: "", popular: true, soldOut: false, hidden: false },
      { id: "i7", name: "Bear Bite Seafood Rice", desc: "", price: "1300", priceL: "1700", image: "", popular: false, soldOut: false, hidden: false },
      { id: "i8", name: "Egg and Onion Rice", desc: "", price: "850", priceL: "1200", image: "", popular: false, soldOut: false, hidden: false },
      { id: "i9", name: "Mixed Chopsuey Rice", desc: "", price: "2300", priceL: "", image: "", popular: false, soldOut: false, hidden: false },
      { id: "i10", name: "Nasi Goreng", desc: "", price: "1500", priceL: "", image: "", popular: false, soldOut: false, hidden: false } ] },
    { id: "c3", name: "Noodles", icon: "noodles", items: [
      { id: "i11", name: "Bear Bite Vegetable Noodles", desc: "", price: "700", priceL: "1050", image: "", popular: false, soldOut: false, hidden: false },
      { id: "i12", name: "Bear Bite Chicken Noodles", desc: "", price: "950", priceL: "1300", image: "", popular: false, soldOut: false, hidden: false },
      { id: "i13", name: "Bear Bite Seafood Noodles", desc: "", price: "1300", priceL: "1750", image: "", popular: false, soldOut: false, hidden: false },
      { id: "i14", name: "Chinese Mixed Noodles", desc: "", price: "1250", priceL: "1650", image: "", popular: false, soldOut: false, hidden: false } ] },
    { id: "c4", name: "Appetizer", icon: "roll", items: [
      { id: "i15", name: "Chicken Spring Rolls (4 pcs)", desc: "", price: "300", priceL: "", image: "", popular: false, soldOut: false, hidden: false },
      { id: "i16", name: "Cuttlefish (3 pcs)", desc: "", price: "200", priceL: "", image: "", popular: false, soldOut: false, hidden: false },
      { id: "i17", name: "Egg Rolls", desc: "", price: "100", priceL: "", image: "", popular: false, soldOut: false, hidden: false },
      { id: "i18", name: "Parata", desc: "", price: "60", priceL: "", image: "", popular: false, soldOut: false, hidden: false },
      { id: "i19", name: "Egg Roti", desc: "", price: "120", priceL: "", image: "", popular: false, soldOut: false, hidden: false },
      { id: "i20", name: "Hopper", desc: "", price: "40", priceL: "", image: "", popular: false, soldOut: false, hidden: false },
      { id: "i21", name: "Egg Hopper", desc: "", price: "100", priceL: "", image: "", popular: false, soldOut: false, hidden: false } ] },
    { id: "c5", name: "Omelette", icon: "egg", items: [
      { id: "i22", name: "Plain Omelette", desc: "", price: "300", priceL: "", image: "", popular: false, soldOut: false, hidden: false },
      { id: "i23", name: "Cheese Omelette", desc: "", price: "500", priceL: "", image: "", popular: false, soldOut: false, hidden: false },
      { id: "i24", name: "Cheese and Chicken Omelette", desc: "", price: "650", priceL: "", image: "", popular: false, soldOut: false, hidden: false },
      { id: "i25", name: "Bear Bite Spicy Sri Lankan Omelette", desc: "", price: "650", priceL: "", image: "", popular: true, soldOut: false, hidden: false } ] },
    { id: "c6", name: "Chicken", icon: "chicken", items: [
      { id: "i26", name: "Black Pepper Chicken", desc: "", price: "1350", priceL: "", image: "", popular: false, soldOut: false, hidden: false },
      { id: "i27", name: "Chicken Devilled", desc: "", price: "1350", priceL: "", image: "", popular: false, soldOut: false, hidden: false },
      { id: "i28", name: "Chilli Chicken", desc: "", price: "1350", priceL: "", image: "", popular: false, soldOut: false, hidden: false } ] },
    { id: "c7", name: "Bear Bite Chicken", icon: "bear", items: [
      { id: "i29", name: "Set Menu", desc: "", price: "850", priceL: "1000", image: "", popular: false, soldOut: false, hidden: false },
      { id: "i30", name: "Chicken Fried Rice Budget Pack", desc: "", price: "400", priceL: "", image: "", popular: false, soldOut: false, hidden: false } ] },
    { id: "c8", name: "Fish", icon: "fish", items: [
      { id: "i31", name: "Fish Devilled", desc: "", price: "1200", priceL: "", image: "", popular: false, soldOut: false, hidden: false },
      { id: "i32", name: "Fish Fry", desc: "", price: "400", priceL: "", image: "", popular: false, soldOut: false, hidden: false } ] },
    { id: "c9", name: "Prawns", icon: "prawn", items: [
      { id: "i33", name: "Hot Butter Prawns", desc: "", price: "1500", priceL: "", image: "", popular: false, soldOut: false, hidden: false },
      { id: "i34", name: "Prawns Devilled", desc: "", price: "1600", priceL: "", image: "", popular: false, soldOut: false, hidden: false } ] },
    { id: "c10", name: "Cuttlefish", icon: "squid", items: [
      { id: "i35", name: "Hot Butter Cuttlefish", desc: "", price: "1600", priceL: "", image: "", popular: false, soldOut: false, hidden: false },
      { id: "i36", name: "Cuttlefish Devilled", desc: "", price: "1600", priceL: "", image: "", popular: false, soldOut: false, hidden: false } ] },
    { id: "c11", name: "Pork", icon: "pork", items: [
      { id: "i37", name: "Black Pork Curry", desc: "", price: "1700", priceL: "", image: "", popular: false, soldOut: false, hidden: false },
      { id: "i38", name: "Pork Devilled", desc: "", price: "1700", priceL: "", image: "", popular: false, soldOut: false, hidden: false },
      { id: "i39", name: "Black Pepper Pork", desc: "", price: "1700", priceL: "", image: "", popular: false, soldOut: false, hidden: false } ] },
    { id: "c12", name: "Vegetable", icon: "veg", items: [
      { id: "i40", name: "Chopsuey", desc: "", price: "800", priceL: "", image: "", popular: false, soldOut: false, hidden: false },
      { id: "i41", name: "Bold Vegetable", desc: "", price: "600", priceL: "", image: "", popular: false, soldOut: false, hidden: false } ] },
    { id: "c13", name: "Kottu", icon: "kottu", items: [
      { id: "i42", name: "Bear Bite Vegetable Kottu", desc: "", price: "650", priceL: "1000", image: "", popular: false, soldOut: false, hidden: false },
      { id: "i43", name: "Bear Bite Special Chicken Kottu", desc: "", price: "950", priceL: "1400", image: "", popular: true, soldOut: false, hidden: false },
      { id: "i44", name: "Bear Bite Cheese Kottu", desc: "", price: "1050", priceL: "1600", image: "", popular: true, soldOut: false, hidden: false },
      { id: "i45", name: "Bear Bite Cheese Chicken Kottu", desc: "", price: "1250", priceL: "1750", image: "", popular: false, soldOut: false, hidden: false },
      { id: "i46", name: "Bear Bite Nai Miris Kottu", desc: "", price: "900", priceL: "1250", image: "", popular: false, soldOut: false, hidden: false },
      { id: "i47", name: "Mixed Kottu", desc: "", price: "1300", priceL: "1850", image: "", popular: false, soldOut: false, hidden: false },
      { id: "i48", name: "Seafood Kottu", desc: "", price: "1300", priceL: "1850", image: "", popular: false, soldOut: false, hidden: false },
      { id: "i49", name: "Egg Kottu", desc: "", price: "750", priceL: "1100", image: "", popular: false, soldOut: false, hidden: false },
      { id: "i50", name: "Idiyappam Chicken Kottu", desc: "", price: "950", priceL: "1300", image: "", popular: false, soldOut: false, hidden: false },
      { id: "i51", name: "Idiyappam Seafood Kottu", desc: "", price: "1300", priceL: "1850", image: "", popular: false, soldOut: false, hidden: false },
      { id: "i52", name: "Idiyappam Mixed Kottu", desc: "", price: "1300", priceL: "1850", image: "", popular: false, soldOut: false, hidden: false } ] }],
  promotions: [{ id: "p1", title: "Sample promotion", text: "Edit or delete this in the admin panel.", badge: "New", image: "", start: "", end: "", active: false }],
  gallery: []
};

/* ---------- crypto ---------- */
async function hashPw(pw, salt = toHex(crypto.getRandomValues(new Uint8Array(16)))) {
  const key = await crypto.subtle.importKey("raw", enc.encode(pw), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: fromHex(salt), iterations: ITER }, key, 256);
  return { salt, hash: toHex(bits) };
}
const checkPw = async (pw, rec) => !!rec && typeof pw === "string" && same((await hashPw(pw, rec.salt)).hash, rec.hash);
const newRecovery = () => toHex(crypto.getRandomValues(new Uint8Array(10))).toUpperCase().match(/.{4}/g).join("-");
const normKey = k => String(k || "").toUpperCase().replace(/[^0-9A-F]/g, "");
async function hmac(secret, msg) {
  const k = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return b64u(await crypto.subtle.sign("HMAC", k, enc.encode(msg)));
}
async function makeToken(secret) { const exp = String(Math.floor(Date.now() / 1000) + SESSION_S); return exp + "." + await hmac(secret, exp); }
async function tokenOk(secret, token) {
  const [exp, sig] = String(token || "").split(".");
  if (!exp || !sig || !secret || +exp < Date.now() / 1000) return false;
  return same(sig, await hmac(secret, exp));
}
const strongEnough = pw => typeof pw === "string" && pw.length >= 8 && pw.length <= 200;

/* ---------- http helpers ---------- */
function json(obj, status = 200, cookie) {
  const h = new Headers({ "Content-Type": "application/json", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" });
  if (cookie) h.append("Set-Cookie", cookie);
  return new Response(JSON.stringify(obj), { status, headers: h });
}
const cookieOf = (req, name) => { const m = (req.headers.get("Cookie") || "").match(new RegExp("(?:^|; )" + name + "=([^;]*)")); return m ? m[1] : ""; };
const sessionCookie = (token, secure, maxAge = SESSION_S) => `bb_sid=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${maxAge}${secure ? "; Secure" : ""}`;
async function body(req, limit = 9e6) {
  if (+req.headers.get("content-length") > limit) throw new Error("Too large");
  try { return JSON.parse((await req.text()) || "{}"); } catch (e) { throw new Error("Bad JSON"); }
}

/* ---------- storage + rate limit ---------- */
const getAuth = env => env.BB.get("auth", "json");
const putAuth = (env, a) => env.BB.put("auth", JSON.stringify(a));
const isLocked = async (env, ip) => parseInt(await env.BB.get("fail:" + ip) || "0", 10) >= 5;
const addFail = async (env, ip) => env.BB.put("fail:" + ip, String(parseInt(await env.BB.get("fail:" + ip) || "0", 10) + 1), { expirationTtl: 900 });
const TOO_MANY = () => json({ error: "Too many attempts. Try again in 15 minutes." }, 429);

/* ---------- content validation ---------- */
function clean(x, depth = 0) {
  if (typeof x === "string") return x.slice(0, 3000);
  if (typeof x === "number" || typeof x === "boolean") return x;
  if (Array.isArray(x)) return x.slice(0, 500).map(v => clean(v, depth + 1));
  if (x && typeof x === "object" && depth < 6) { const o = {}; for (const k of Object.keys(x).slice(0, 60)) if (/^[\w-]+$/.test(k)) o[k] = clean(x[k], depth + 1); return o; }
  return null;
}
const okImg = v => typeof v === "string" && (v === "" || /^\/uploads\/[\w.-]+$/.test(v) || /^https?:\/\/\S+$/.test(v));
const okUrl = v => typeof v === "string" && (v === "" || /^https?:\/\/\S+$/.test(v));
function validate(input) {
  const c = clean(input); if (!c || typeof c !== "object") return null;
  const D = DEFAULTS;
  c.business = Object.assign({}, D.business, c.business || {});
  c.status = Object.assign({}, D.status, c.status || {});
  c.announcement = Object.assign({}, D.announcement, c.announcement || {});
  if (!["auto", "open", "closed"].includes(c.status.override)) c.status.override = "auto";
  for (const k of ["facebook", "instagram", "tiktok"]) if (!okUrl(c.business[k])) c.business[k] = "";
  if (!/^\+?\d{6,15}$/.test(c.business.phoneLink)) c.business.phoneLink = D.business.phoneLink;
  c.business.whatsapp = String(c.business.whatsapp).replace(/\D/g, "");
  try { new Intl.DateTimeFormat("en", { timeZone: c.business.timezone }); } catch (e) { c.business.timezone = "Asia/Colombo"; }
  if (!Array.isArray(c.hours) || c.hours.length !== 7) c.hours = D.hours;
  c.hours = c.hours.map((h, i) => ({ day: DAYS[i], open: /^\d\d:\d\d$/.test(h.open) ? h.open : "10:00", close: /^\d\d:\d\d$/.test(h.close) ? h.close : "21:00", closed: !!h.closed }));
  if (!Array.isArray(c.categories) || !Array.isArray(c.promotions) || !Array.isArray(c.gallery)) return null;
  c.categories = c.categories.map(cat => ({ id: String(cat.id || uid()), name: String(cat.name || "Untitled"), icon: /^[a-z]{1,12}$/.test(cat.icon) ? cat.icon : "",
    items: (Array.isArray(cat.items) ? cat.items : []).map(i => ({ id: String(i.id || uid()), name: String(i.name || "Untitled"), desc: String(i.desc || ""),
      price: String(i.price == null ? "" : i.price), priceL: String(i.priceL == null ? "" : i.priceL), image: okImg(i.image) ? i.image : "", popular: !!i.popular, soldOut: !!i.soldOut, hidden: !!i.hidden })) }));
  c.promotions = c.promotions.map(p => ({ id: String(p.id || uid()), title: String(p.title || "Untitled"), text: String(p.text || ""), badge: String(p.badge || ""),
    image: okImg(p.image) ? p.image : "", start: /^\d{4}-\d\d-\d\d$/.test(p.start) ? p.start : "", end: /^\d{4}-\d\d-\d\d$/.test(p.end) ? p.end : "", active: !!p.active }));
  c.gallery = c.gallery.filter(g => okImg(g.url) && g.url).map(g => ({ id: String(g.id || uid()), url: g.url, caption: String(g.caption || "") }));
  return { business: c.business, hours: c.hours, status: c.status, announcement: c.announcement, categories: c.categories, promotions: c.promotions, gallery: c.gallery };
}
async function cleanupUploads(env, content) {
  const used = new Set((JSON.stringify(content).match(/\/uploads\/[\w.-]+/g) || []).map(s => "img:" + s.slice(9)));
  const list = await env.BB.list({ prefix: "img:" });
  await Promise.all(list.keys.filter(k => !used.has(k.name) && Date.now() - ((k.metadata && k.metadata.t) || 0) > 3600000).map(k => env.BB.delete(k.name)));
}
const magicOk = (b, mime) => mime === "image/jpeg" ? b[0] === 0xFF && b[1] === 0xD8 : mime === "image/png" ? b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4E && b[3] === 0x47
  : mime === "image/webp" ? String.fromCharCode(...b.slice(0, 4)) === "RIFF" && String.fromCharCode(...b.slice(8, 12)) === "WEBP" : false;

/* ---------- router ---------- */
export async function onRequest({ request, env }) {
  try {
    if (!env.BB) return json({ error: "Storage is not connected. Add the KV binding named BB in Cloudflare (see README)." }, 500);
    const url = new URL(request.url), p = url.pathname.replace(/\/+$/, ""), m = request.method;
    const ip = request.headers.get("CF-Connecting-IP") || "local", secure = url.protocol === "https:";
    if (m !== "GET" && request.headers.get("X-Requested-With") !== "bb") return json({ error: "Forbidden" }, 403);

    if (m === "GET" && p === "/api/content") return json((await env.BB.get("content", "json")) || DEFAULTS);
    const auth = await getAuth(env);
    const loggedIn = async () => !!auth && await tokenOk(auth.secret, cookieOf(request, "bb_sid"));
    if (m === "GET" && p === "/api/auth/status") return json({ setup: !!auth, loggedIn: await loggedIn() });

    if (m === "POST" && p === "/api/auth/setup") {
      if (auth) return json({ error: "Already set up" }, 400);
      if (!env.ADMIN_SETUP_CODE) return json({ error: "Setup is switched off. Add an ADMIN_SETUP_CODE variable in Cloudflare first (see README)." }, 400);
      if (await isLocked(env, ip)) return TOO_MANY();
      const b = await body(request, 5000);
      if (!same(String(b.code || "").trim().toUpperCase(), String(env.ADMIN_SETUP_CODE).trim().toUpperCase())) { await addFail(env, ip); return json({ error: "Wrong setup code" }, 403); }
      if (!strongEnough(b.password)) return json({ error: "Password must be at least 8 characters" }, 400);
      const key = newRecovery(), secret = toHex(crypto.getRandomValues(new Uint8Array(32)));
      await putAuth(env, { password: await hashPw(b.password), recovery: await hashPw(normKey(key)), secret });
      return json({ ok: true, recoveryKey: key }, 200, sessionCookie(await makeToken(secret), secure));
    }
    if (m === "POST" && p === "/api/auth/login") {
      if (await isLocked(env, ip)) return TOO_MANY();
      const b = await body(request, 5000);
      if (!auth || !(await checkPw(b.password, auth.password))) { await addFail(env, ip); return json({ error: "Wrong password" }, 401); }
      await env.BB.delete("fail:" + ip);
      return json({ ok: true }, 200, sessionCookie(await makeToken(auth.secret), secure));
    }
    if (m === "POST" && p === "/api/auth/logout") return json({ ok: true }, 200, sessionCookie("", secure, 0));
    if (m === "POST" && p === "/api/auth/reset") {
      if (await isLocked(env, ip)) return TOO_MANY();
      const b = await body(request, 5000);
      if (!auth || !(await checkPw(normKey(b.recoveryKey), auth.recovery))) { await addFail(env, ip); return json({ error: "Recovery key is not correct" }, 401); }
      if (!strongEnough(b.password)) return json({ error: "Password must be at least 8 characters" }, 400);
      const key = newRecovery();
      await putAuth(env, { password: await hashPw(b.password), recovery: await hashPw(normKey(key)), secret: toHex(crypto.getRandomValues(new Uint8Array(32))) });
      return json({ ok: true, recoveryKey: key });
    }

    if (!p.startsWith("/api/admin/")) return json({ error: "Not found" }, 404);
    if (!(await loggedIn())) return json({ error: "Please log in" }, 401);

    if (m === "PUT" && p === "/api/admin/content") {
      const c = validate(await body(request, 2e6));
      if (!c) return json({ error: "Invalid content" }, 400);
      await env.BB.put("content", JSON.stringify(c)); await cleanupUploads(env, c);
      return json(c);
    }
    if (m === "GET" && p === "/api/admin/backup") {
      return new Response(JSON.stringify((await env.BB.get("content", "json")) || DEFAULTS, null, 2),
        { headers: { "Content-Type": "application/json", "Content-Disposition": 'attachment; filename="bear-bite-backup.json"', "Cache-Control": "no-store" } });
    }
    if (m === "POST" && p === "/api/admin/upload") {
      const b = await body(request);
      const mt = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(b.data || "");
      if (!mt) return json({ error: "Use a JPG, PNG or WebP image" }, 400);
      const bin = atob(mt[2]), bytes = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      if (bytes.length > 6e6 || !magicOk(bytes, mt[1])) return json({ error: "Image is invalid or too large" }, 400);
      const name = Date.now().toString(36) + uid() + { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" }[mt[1]];
      await env.BB.put("img:" + name, bytes, { metadata: { t: Date.now() } });
      return json({ url: "/uploads/" + name });
    }
    if (m === "POST" && p === "/api/admin/password") {
      if (await isLocked(env, ip)) return TOO_MANY();
      const b = await body(request, 5000);
      if (!(await checkPw(b.current, auth.password))) { await addFail(env, ip); return json({ error: "Current password is wrong" }, 401); }
      if (!strongEnough(b.password)) return json({ error: "New password must be at least 8 characters" }, 400);
      auth.password = await hashPw(b.password); auth.secret = toHex(crypto.getRandomValues(new Uint8Array(32))); await putAuth(env, auth);
      return json({ ok: true }, 200, sessionCookie(await makeToken(auth.secret), secure));
    }
    if (m === "POST" && p === "/api/admin/recovery") {
      if (await isLocked(env, ip)) return TOO_MANY();
      const b = await body(request, 5000);
      if (!(await checkPw(b.current, auth.password))) { await addFail(env, ip); return json({ error: "Password is wrong" }, 401); }
      const key = newRecovery(); auth.recovery = await hashPw(normKey(key)); await putAuth(env, auth);
      return json({ recoveryKey: key });
    }
    return json({ error: "Not found" }, 404);
  } catch (e) {
    return json({ error: e.message === "Too large" ? "File too large" : e.message === "Bad JSON" ? "Bad request" : "Server error" }, e.message === "Too large" ? 413 : 400);
  }
}

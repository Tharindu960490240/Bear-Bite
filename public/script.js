"use strict";
const $ = (s, e = document) => e.querySelector(s);
const $$ = (s, e = document) => [...e.querySelectorAll(s)];
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
let DATA = null, activeCat = null;

/* ---------- theme ---------- */
$("#themeBtn").onclick = () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem("bb-theme", next); } catch (e) {}
  const m = $('meta[name="theme-color"]'); if (m) m.content = next === "dark" ? "#110D08" : "#FFFCF5";
};

/* ---------- scroll reveal ---------- */
const io = "IntersectionObserver" in window
  ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.1, rootMargin: "0px 0px -30px 0px" })
  : null;
const reveal = () => {
  $$(".rv:not(.in)").forEach(e => { if (io) { io.unobserve(e); io.observe(e); } else e.classList.add("in"); });
  // safety net: anything already on screen when this runs is shown
  setTimeout(() => $$(".rv:not(.in)").forEach(e => { const r = e.getBoundingClientRect(); if (r.width && r.top < innerHeight && r.bottom > 0) e.classList.add("in"); }), 350);
};
reveal();

/* ---------- nav: mobile drawer, active link, shadow ---------- */
const burger = $("#burger"), drawer = $("#drawer");
const setDrawer = open => { drawer.classList.toggle("open", open); burger.setAttribute("aria-expanded", String(open)); };
burger.onclick = () => setDrawer(!drawer.classList.contains("open"));
$$("a", drawer).forEach(a => a.addEventListener("click", () => setDrawer(false)));
document.addEventListener("keydown", e => { if (e.key === "Escape") setDrawer(false); });
if (io) {
  const spy = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) $$("[data-nav]").forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  $$("main section[id]").forEach(s => spy.observe(s));
}

/* ---------- helpers ---------- */
const money = (p, cur) => { p = String(p || "").trim(); if (!p) return ""; const n = parseFloat(p); if (isNaN(n)) return p; return (cur ? cur + " " : "") + n.toLocaleString("en-US", { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 }); };
const ICON_KEYS = ["rice", "noodles", "curry", "kottu", "chicken", "fish", "prawn", "squid", "pork", "veg", "egg", "roll", "bear", "burger", "drink", "dessert", "pizza", "fries", "coffee", "utensils"];
const GUESS = [["curry", "curry"], ["rice", "rice"], ["noodle", "noodles"], ["kottu", "kottu"], ["chicken", "chicken"], ["fish", "fish"], ["prawn", "prawn"], ["shrimp", "prawn"], ["cuttle", "squid"], ["squid", "squid"], ["pork", "pork"], ["veg", "veg"], ["salad", "veg"], ["omelet", "egg"], ["egg", "egg"], ["appeti", "roll"], ["starter", "roll"], ["burger", "burger"], ["pizza", "pizza"], ["drink", "drink"], ["juice", "drink"], ["beverage", "drink"], ["coffee", "coffee"], ["tea", "coffee"], ["sweet", "dessert"], ["dessert", "dessert"], ["ice", "dessert"], ["side", "fries"], ["fries", "fries"], ["beef", "pork"], ["meat", "pork"]];
const iconFor = c => ICON_KEYS.includes(c.icon) ? c.icon : (GUESS.find(([k]) => c.name.toLowerCase().includes(k)) || [0, "utensils"])[1];
function ic(key) {
  const NS = "http://www.w3.org/2000/svg", s = document.createElementNS(NS, "svg"), u = document.createElementNS(NS, "use");
  s.setAttribute("class", "ic"); s.setAttribute("aria-hidden", "true"); u.setAttribute("href", "#i-" + key); s.appendChild(u); return s;
}
function priceNodes(i, cur) {
  const box = el("div", "prices"), small = money(i.price, cur), large = money(i.priceL, cur);
  const chip = (txt, size) => { const p = el("span", "price"); if (size) p.appendChild(el("em", "", size)); p.appendChild(document.createTextNode(txt)); return p; };
  if (large) { if (small) box.appendChild(chip(small, "S")); box.appendChild(chip(large, "L")); }
  else if (small) box.appendChild(chip(small));
  return box;
}
const safeUrl = u => /^(https?:\/\/|\/)/.test(u || "") ? u : "";
const mins = t => { const [h, m] = String(t).split(":").map(Number); return h * 60 + m; };
const fmt12 = t => { let [h, m] = t.split(":").map(Number); const ap = h >= 12 ? "PM" : "AM"; h = h % 12 || 12; return h + ":" + String(m).padStart(2, "0") + " " + ap; };

function nowInZone(tz) {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: tz, weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
  const g = t => parts.find(p => p.type === t).value;
  const idx = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(g("weekday"));
  return { day: idx, min: (+g("hour") % 24) * 60 + +g("minute"), date: `${g("year")}-${g("month")}-${g("day")}` };
}
function openStatus(d) {
  const st = d.status || {}, n = nowInZone(d.business.timezone || "Asia/Colombo");
  if (st.override === "closed") return { open: false, text: st.message || "Closed right now" };
  if (st.override === "open") return { open: true, text: st.message || "Open now" };
  const H = d.hours, today = H[n.day], prev = H[(n.day + 6) % 7];
  const spans = h => { if (h.closed) return null; const o = mins(h.open), c = mins(h.close); return c > o ? [o, c, false] : [o, c + 1440, true]; };
  const t = spans(today), p = spans(prev);
  if (p && p[2] && n.min < p[1] - 1440) return { open: true, text: "Open now, until " + fmt12(prev.close) };
  if (t && n.min >= t[0] && n.min < t[1]) {
    const left = t[1] - n.min;
    return { open: true, text: left <= 45 ? "Closing soon, at " + fmt12(today.close) : "Open now, until " + fmt12(today.close) };
  }
  if (t && n.min < t[0]) return { open: false, text: "Closed, opens today at " + fmt12(today.open) };
  for (let i = 1; i <= 7; i++) { const h = H[(n.day + i) % 7]; if (!h.closed) return { open: false, text: "Closed, opens " + (i === 1 ? "tomorrow" : h.day) + " at " + fmt12(h.open) }; }
  return { open: false, text: "Closed" };
}

/* ---------- render: business, status, hours ---------- */
function renderBusiness(d) {
  const b = d.business;
  document.title = b.name + " | " + b.tagline;
  $$("[data-biz=name]").forEach(e => e.textContent = b.name);
  const title = String(b.heroTitle || b.tagline).trim(), words = title.split(/\s+/), h1 = $("#heroTitle");
  h1.textContent = "";
  if (words.length > 1) { h1.append(words.slice(0, -1).join(" ") + " "); h1.appendChild(el("span", "hl", words[words.length - 1])); } else h1.textContent = title;
  $("#heroText").textContent = b.heroText || "";
  $$("[data-phone]").forEach(a => a.href = "tel:" + b.phoneLink);
  $$("[data-phone-text]").forEach(e => e.textContent = b.phoneDisplay);
  $("#addr").textContent = b.address;
  if (b.email) { $("#emailLabel").hidden = $("#emailRow").hidden = false; const a = $("#email"); a.textContent = b.email; a.href = "mailto:" + b.email; }
  const q = encodeURIComponent(b.mapQuery || (b.name + ", " + b.address));
  $("#mapFrame").src = "https://www.google.com/maps?q=" + q + "&output=embed";
  $("#mapLink").href = "https://www.google.com/maps/search/?api=1&query=" + q;
  $("#whereLink").href = $("#mapLink").href; $("#addrQuick").textContent = b.address;
  $("#foot").textContent = "© " + new Date().getFullYear() + " " + b.name + ". " + (b.footerText || "All rights reserved.");
  const m = $("#marquee"); m.textContent = "";
  for (let i = 0; i < 12; i++) m.appendChild(el("span", "", [b.tagline, "Call to order", b.name][i % 3]));
  const soc = $("#socials"); soc.textContent = "";
  [["Facebook", b.facebook], ["Instagram", b.instagram], ["TikTok", b.tiktok]].forEach(([n, u]) => { if (safeUrl(u)) { const a = el("a", "soc", n); a.href = u; a.target = "_blank"; a.rel = "noopener"; soc.appendChild(a); } });
  if (b.whatsapp) { const a = el("a", "soc wa", "WhatsApp"); a.href = "https://wa.me/" + b.whatsapp; a.target = "_blank"; a.rel = "noopener"; soc.appendChild(a); }
  const an = $("#announce");
  if (d.announcement && d.announcement.enabled && d.announcement.text) { an.textContent = d.announcement.text; an.hidden = false; } else an.hidden = true;
}
function renderStatus() {
  const s = openStatus(DATA);
  $("#statusText").textContent = s.text;
  $("#dot").className = s.open ? "on" : "off";
  const c = $("#cardStatus"); c.textContent = s.text; c.className = s.open ? "on" : "off";
}
function renderHours(d) {
  const t = $("#hoursTable"); t.textContent = "";
  const today = nowInZone(d.business.timezone).day, th = d.hours[today];
  $("#todayHours").textContent = th.closed ? "Closed today" : fmt12(th.open) + " to " + fmt12(th.close);
  d.hours.forEach((h, i) => {
    const tr = el("tr", i === today ? "today" : ""); tr.appendChild(el("td", "", h.day));
    tr.appendChild(el("td", "", h.closed ? "Closed" : fmt12(h.open) + " to " + fmt12(h.close))); t.appendChild(tr);
  });
}

/* ---------- render: popular picks + promotions ---------- */
function renderFavs(d) {
  const items = d.categories.flatMap(c => c.items.filter(i => i.popular && !i.hidden).map(i => ({ ...i, cat: c.name, ico: iconFor(c) })));
  $("#favs").hidden = !items.length;
  const box = $("#favList"); box.textContent = "";
  items.slice(0, 8).forEach(i => {
    const c = el("article", "fav");
    if (safeUrl(i.image)) { const im = el("img"); im.src = i.image; im.alt = i.name; im.loading = "lazy"; c.appendChild(im); }
    else { const w = el("span", "ico"); w.appendChild(ic(i.ico)); c.appendChild(w); }
    c.appendChild(el("small", "", i.cat)); c.appendChild(el("h3", "", i.name));
    if (i.desc) c.appendChild(el("p", "", i.desc));
    c.appendChild(priceNodes(i, d.business.currency));
    box.appendChild(c);
  });
}
function renderPromos(d) {
  const today = nowInZone(d.business.timezone).date;
  const list = d.promotions.filter(p => p.active && (!p.start || p.start <= today) && (!p.end || p.end >= today));
  $("#promos").hidden = !list.length; $$('[data-for="promos"]').forEach(a => a.hidden = !list.length);
  const box = $("#promoList"); box.textContent = "";
  list.forEach(p => {
    const c = el("article", "promo rv");
    if (safeUrl(p.image)) { const i = el("img"); i.src = p.image; i.alt = ""; i.loading = "lazy"; c.appendChild(i); }
    const body = el("div", "promo-body");
    if (p.badge) body.appendChild(el("span", "badge", p.badge));
    body.appendChild(el("h3", "", p.title)); body.appendChild(el("p", "", p.text));
    if (p.end) body.appendChild(el("small", "", "Until " + new Date(p.end + "T00:00:00").toLocaleDateString(undefined, { day: "numeric", month: "short" })));
    c.appendChild(body); box.appendChild(c);
  });
  reveal();
}

/* ---------- render: menu ---------- */
function renderMenu() {
  const cats = DATA.categories.map((c, ci) => ({ ...c, ci, items: c.items.filter(i => !i.hidden) })).filter(c => c.items.length);
  const tabs = $("#tabs"), grid = $("#menuGrid"), q = $("#q").value.trim().toLowerCase();
  tabs.textContent = ""; grid.textContent = "";
  if (!cats.length) { grid.appendChild(el("p", "note", "The menu is being updated. Please call us.")); return; }
  if (!cats.some(c => c.id === activeCat)) activeCat = cats[0].id;
  cats.forEach(c => {
    const b = el("button"); b.type = "button"; b.setAttribute("role", "tab"); b.setAttribute("aria-selected", String(!q && c.id === activeCat));
    b.appendChild(ic(iconFor(c))); b.appendChild(document.createTextNode(c.name));
    b.onclick = () => { activeCat = c.id; $("#q").value = ""; renderMenu(); }; tabs.appendChild(b);
  });
  const rows = q ? cats.flatMap(c => c.items.filter(i => (i.name + " " + i.desc + " " + c.name).toLowerCase().includes(q)).map(i => ({ i, c }))) : cats.find(c => c.id === activeCat).items.map(i => ({ i, c: cats.find(c => c.id === activeCat) }));
  if (!rows.length) { grid.appendChild(el("p", "note", "Nothing matches your search.")); return; }
  rows.forEach(({ i, c }, k) => {
    const a = el("article", "item t" + (c.ci % 4) + (i.soldOut ? " sold" : "")); a.style.setProperty("--i", Math.min(k, 14));
    if (safeUrl(i.image)) { const im = el("img", "thumb"); im.src = i.image; im.alt = i.name; im.loading = "lazy"; a.appendChild(im); }
    else { const t = el("span", "tile"); t.appendChild(ic(iconFor(c))); a.appendChild(t); }
    const txt = el("div", "txt"); if (q) txt.appendChild(el("small", "cat", c.name)); txt.appendChild(el("h3", "", i.name));
    if (i.desc) txt.appendChild(el("p", "", i.desc));
    txt.appendChild(priceNodes(i, DATA.business.currency));
    const tags = el("div", "tags");
    if (i.popular) tags.appendChild(el("span", "tag hot", "House favourite"));
    if (i.soldOut) tags.appendChild(el("span", "tag out", "Sold out today"));
    if (tags.children.length) txt.appendChild(tags);
    a.appendChild(txt); grid.appendChild(a);
  });
}

/* ---------- gallery (auto slide + viewer) ---------- */
let timer;
const lb = $("#lb");
function openViewer(g) { $("#lbImg").src = g.url; $("#lbImg").alt = g.caption || ""; $("#lbCap").textContent = g.caption || ""; lb.showModal(); }
$("#lbClose").onclick = () => lb.close();
lb.addEventListener("click", e => { if (e.target === lb) lb.close(); });
function renderGallery(d) {
  const sec = $("#gallery"), track = $("#galTrack"); track.textContent = "";
  sec.hidden = !d.gallery.length; $$('[data-for="gallery"]').forEach(a => a.hidden = !d.gallery.length);
  if (!d.gallery.length) return;
  d.gallery.forEach((g, i) => {
    const f = el("figure", "slide"), btn = el("button"), im = el("img");
    btn.type = "button"; btn.setAttribute("aria-label", "View photo " + (i + 1) + " larger"); btn.onclick = () => openViewer(g);
    im.src = g.url; im.alt = g.caption || "Photo " + (i + 1); im.loading = "lazy"; btn.appendChild(im); f.appendChild(btn);
    if (g.caption) f.appendChild(el("figcaption", "", g.caption)); track.appendChild(f);
  });
  const step = () => (track.firstElementChild ? track.firstElementChild.getBoundingClientRect().width + 16 : 300);
  const next = () => track.scrollLeft + track.clientWidth >= track.scrollWidth - 8 ? track.scrollTo({ left: 0, behavior: "smooth" }) : track.scrollBy({ left: step(), behavior: "smooth" });
  const prev = () => track.scrollLeft <= 4 ? track.scrollTo({ left: track.scrollWidth, behavior: "smooth" }) : track.scrollBy({ left: -step(), behavior: "smooth" });
  $("#next").onclick = next; $("#prev").onclick = prev;
  const play = () => { clearInterval(timer); if (!matchMedia("(prefers-reduced-motion: reduce)").matches) timer = setInterval(next, 3500); };
  const stop = () => clearInterval(timer);
  ["mouseenter", "focusin", "touchstart"].forEach(e => track.addEventListener(e, stop, { passive: true }));
  ["mouseleave", "focusout", "touchend"].forEach(e => track.addEventListener(e, play, { passive: true }));
  lb.addEventListener("close", play); lb.addEventListener("toggle", () => lb.open && stop());
  document.addEventListener("visibilitychange", () => document.hidden ? stop() : play());
  play();
}

/* ---------- boot ---------- */
fetch("/api/content", { cache: "no-store" }).then(r => { if (!r.ok) throw 0; return r.json(); }).then(d => {
  DATA = d;
  renderBusiness(d); renderStatus(); renderHours(d); renderFavs(d); renderPromos(d); renderMenu(); renderGallery(d);
  reveal();
  $("#q").addEventListener("input", renderMenu);
  setInterval(renderStatus, 60000);
}).catch(() => { $("#menuGrid").textContent = "Could not load the menu. Please call us to order."; });

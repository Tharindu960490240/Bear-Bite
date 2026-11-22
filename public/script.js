"use strict";
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
let DATA = null, activeCat = null;

/* ---------- theme ---------- */
$("#themeBtn").onclick = () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem("bb-theme", next); } catch (e) {}
};

/* ---------- helpers ---------- */
const money = (p, cur) => { p = String(p || "").trim(); if (!p) return ""; return isNaN(parseFloat(p)) ? p : (cur ? cur + " " : "") + parseFloat(p).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
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

/* ---------- render ---------- */
function renderBusiness(d) {
  const b = d.business;
  document.title = b.name + " | " + b.tagline;
  $$("[data-biz=name]").forEach(e => e.textContent = b.name);
  $("#heroTitle").textContent = b.heroTitle || b.tagline;
  $("#heroText").textContent = b.heroText || "";
  $$("[data-phone]").forEach(a => a.href = "tel:" + b.phoneLink);
  $$("[data-phone-text]").forEach(e => e.textContent = b.phoneDisplay);
  $("#addr").textContent = b.address;
  if (b.email) { $("#emailRow").hidden = false; const a = $("#email"); a.textContent = b.email; a.href = "mailto:" + b.email; }
  const q = encodeURIComponent(b.mapQuery || (b.name + ", " + b.address));
  $("#mapFrame").src = "https://www.google.com/maps?q=" + q + "&output=embed";
  $("#mapLink").href = "https://www.google.com/maps/search/?api=1&query=" + q;
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
}

function renderHours(d) {
  const t = $("#hoursTable"); t.textContent = "";
  const today = nowInZone(d.business.timezone).day;
  d.hours.forEach((h, i) => {
    const tr = el("tr", i === today ? "today" : ""); tr.appendChild(el("td", "", h.day));
    tr.appendChild(el("td", "", h.closed ? "Closed" : fmt12(h.open) + " to " + fmt12(h.close))); t.appendChild(tr);
  });
}

function renderPromos(d) {
  const today = nowInZone(d.business.timezone).date;
  const list = d.promotions.filter(p => p.active && (!p.start || p.start <= today) && (!p.end || p.end >= today));
  $("#promos").hidden = $("#navPromos").hidden = !list.length;
  const box = $("#promoList"); box.textContent = "";
  list.forEach(p => {
    const c = el("article", "promo" + (safeUrl(p.image) ? " has-img" : ""));
    if (safeUrl(p.image)) { const i = el("img"); i.src = p.image; i.alt = ""; i.loading = "lazy"; c.appendChild(i); }
    const body = el("div", "promo-body");
    if (p.badge) body.appendChild(el("span", "badge", p.badge));
    body.appendChild(el("h3", "", p.title)); body.appendChild(el("p", "", p.text));
    if (p.end) body.appendChild(el("small", "", "Until " + new Date(p.end + "T00:00:00").toLocaleDateString(undefined, { day: "numeric", month: "short" })));
    c.appendChild(body); box.appendChild(c);
  });
}

function renderMenu() {
  const cats = DATA.categories.map(c => ({ ...c, items: c.items.filter(i => !i.hidden) })).filter(c => c.items.length);
  const tabs = $("#tabs"), grid = $("#menuGrid"), q = $("#q").value.trim().toLowerCase();
  tabs.textContent = ""; grid.textContent = "";
  if (!cats.length) { grid.appendChild(el("p", "note", "The menu is being updated. Please call us.")); return; }
  if (!cats.some(c => c.id === activeCat)) activeCat = cats[0].id;
  cats.forEach(c => {
    const b = el("button", "", c.name); b.setAttribute("role", "tab"); b.setAttribute("aria-selected", String(!q && c.id === activeCat));
    b.onclick = () => { activeCat = c.id; $("#q").value = ""; renderMenu(); }; tabs.appendChild(b);
  });
  let items = q ? cats.flatMap(c => c.items.filter(i => (i.name + " " + i.desc).toLowerCase().includes(q))) : cats.find(c => c.id === activeCat).items;
  if (!items.length) { grid.appendChild(el("p", "note", "Nothing matches your search.")); return; }
  items.forEach(i => {
    const a = el("article", "item" + (i.soldOut ? " sold" : ""));
    if (safeUrl(i.image)) { const im = el("img", "item-img"); im.src = i.image; im.alt = i.name; im.loading = "lazy"; a.appendChild(im); }
    const row = el("div", "row"); row.appendChild(el("h3", "", i.name));
    const pr = money(i.price, DATA.business.currency); if (pr) row.appendChild(el("span", "price", pr));
    a.appendChild(row);
    if (i.desc) a.appendChild(el("p", "", i.desc));
    const tags = el("div", "tags");
    if (i.popular) tags.appendChild(el("span", "tag hot", "Popular"));
    if (i.soldOut) tags.appendChild(el("span", "tag out", "Sold out today"));
    if (tags.children.length) a.appendChild(tags);
    grid.appendChild(a);
  });
}

/* ---------- gallery (auto slide) ---------- */
let timer;
function renderGallery(d) {
  const sec = $("#gallery"), track = $("#galTrack"); track.textContent = "";
  sec.hidden = $("#navGal").hidden = !d.gallery.length; if (!d.gallery.length) return;
  d.gallery.forEach((g, i) => {
    const f = el("figure", "slide"), im = el("img"); im.src = g.url; im.alt = g.caption || "Photo " + (i + 1); im.loading = "lazy"; f.appendChild(im);
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
  document.addEventListener("visibilitychange", () => document.hidden ? stop() : play());
  play();
}

/* ---------- boot ---------- */
fetch("/api/content", { cache: "no-store" }).then(r => r.json()).then(d => {
  DATA = d;
  renderBusiness(d); renderStatus(); renderHours(d); renderPromos(d); renderMenu(); renderGallery(d);
  $("#q").addEventListener("input", renderMenu);
  setInterval(renderStatus, 60000);
}).catch(() => {
  $("#menuGrid").textContent = "Could not load the menu. Please call us to order.";
});

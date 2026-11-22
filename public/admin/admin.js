"use strict";
const app = document.getElementById("app");
const uid = () => Math.random().toString(16).slice(2, 12);
let content = null, dirty = false, tab = "menu";

/* ---------- tiny DOM helper (text only, never innerHTML) ---------- */
function h(tag, attrs, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === "class") e.className = v; else if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
    else if (k === "style") e.style.cssText = v; else e.setAttribute(k, v === true ? "" : v);
  }
  kids.flat().forEach(c => c != null && e.appendChild(typeof c === "string" ? document.createTextNode(c) : c));
  return e;
}
function toast(msg) { const t = document.getElementById("toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 2600); }
async function api(method, url, body) {
  const r = await fetch(url, { method, headers: { "Content-Type": "application/json", "X-Requested-With": "bb" }, body: body ? JSON.stringify(body) : undefined });
  const j = await r.json().catch(() => ({}));
  if (r.status === 401 && url.startsWith("/api/admin/")) { boot(); throw new Error("Session expired. Please log in again."); }
  if (!r.ok) throw new Error(j.error || "Something went wrong");
  return j;
}
const markDirty = () => { dirty = true; const s = document.getElementById("savebar"); if (s) s.classList.add("show"); };
window.addEventListener("beforeunload", e => { if (dirty) { e.preventDefault(); e.returnValue = ""; } });

/* bound inputs */
function field(label, obj, key, opts = {}) {
  const type = opts.type || "text";
  const input = opts.area ? h("textarea", { placeholder: opts.ph || "" }) : h("input", { type, placeholder: opts.ph || "", step: opts.step });
  input.value = obj[key] ?? "";
  input.addEventListener("input", () => { obj[key] = input.value; markDirty(); opts.onInput && opts.onInput(); });
  return h("label", {}, label, opts.hint ? h("small", {}, opts.hint) : null, input);
}
function check(label, obj, key, after) {
  const i = h("input", { type: "checkbox" }); i.checked = !!obj[key];
  i.addEventListener("change", () => { obj[key] = i.checked; markDirty(); after && after(); });
  return h("label", { class: "chk" }, i, label);
}
const move = (arr, i, d) => { const j = i + d; if (j < 0 || j >= arr.length) return; [arr[i], arr[j]] = [arr[j], arr[i]]; markDirty(); render(); };

/* image upload with client-side resize */
function resizeImage(file, max = 1400) {
  return new Promise((resolve, reject) => {
    const img = new Image(), url = URL.createObjectURL(file);
    img.onload = () => {
      const s = Math.min(1, max / Math.max(img.width, img.height)), c = document.createElement("canvas");
      c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
      resolve(c.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => reject(new Error("Could not read that image")); img.src = url;
  });
}
async function uploadFile(file) {
  const data = await resizeImage(file);
  return (await api("POST", "/api/admin/upload", { data })).url;
}
function imagePicker(obj, key) {
  const pic = h("div", { class: "pic" }, obj[key] ? "" : "No photo");
  const setPic = () => { pic.style.backgroundImage = obj[key] ? `url("${obj[key]}")` : ""; pic.textContent = obj[key] ? "" : "No photo"; };
  setPic();
  const fi = h("input", { type: "file", accept: "image/jpeg,image/png,image/webp", style: "display:none" });
  fi.addEventListener("change", async () => {
    if (!fi.files[0]) return;
    try { toast("Uploading..."); obj[key] = await uploadFile(fi.files[0]); setPic(); markDirty(); toast("Photo added"); } catch (e) { toast(e.message); }
    fi.value = "";
  });
  return h("div", { class: "thumb" }, pic, fi,
    h("button", { class: "btn ghost sm", type: "button", onclick: () => fi.click() }, obj[key] ? "Change" : "Add photo"),
    obj[key] ? h("button", { class: "btn ghost sm", type: "button", onclick: () => { obj[key] = ""; setPic(); markDirty(); render(); } }, "Remove") : null);
}

/* ---------- auth screens ---------- */
function authBox(title, intro, ...rest) {
  return h("div", { class: "center" }, h("form", { class: "box", onsubmit: e => e.preventDefault() }, h("img", { src: "/logo.png", alt: "" }), h("h1", {}, title), intro ? h("p", {}, intro) : null, ...rest));
}
function showRecovery(key, then) {
  app.replaceChildren(authBox("Save your recovery key", "This is the only way to reset your password if you forget it. Write it down or take a photo and keep it safe. It is shown only once.",
    h("div", { class: "key" }, key),
    h("button", { class: "btn", type: "button", onclick: () => { navigator.clipboard && navigator.clipboard.writeText(key).then(() => toast("Copied")); } }, "Copy key"),
    h("label", { class: "chk" }, h("input", { type: "checkbox", id: "saved" }), "I have saved this key"),
    h("button", { class: "btn", type: "button", onclick: () => { if (!document.getElementById("saved").checked) return toast("Please tick the box first"); then(); } }, "Continue")));
}
function setupScreen() {
  const err = h("div", { class: "err" }), code = h("input", { type: "text", autocomplete: "off" }), pw = h("input", { type: "password", autocomplete: "new-password" }), pw2 = h("input", { type: "password", autocomplete: "new-password" });
  app.replaceChildren(authBox("Set up admin", "First time here. Enter the ADMIN_SETUP_CODE you added in Cloudflare, then choose a password.",
    h("label", {}, "Setup code", code), h("label", {}, "New password", h("small", {}, "At least 8 characters"), pw), h("label", {}, "Repeat password", pw2), err,
    h("button", { class: "btn", type: "submit", onclick: async () => {
      if (pw.value !== pw2.value) return err.textContent = "Passwords do not match";
      try { const r = await api("POST", "/api/auth/setup", { code: code.value, password: pw.value }); showRecovery(r.recoveryKey, boot); } catch (e) { err.textContent = e.message; }
    } }, "Create admin")));
}
function loginScreen() {
  const err = h("div", { class: "err" }), pw = h("input", { type: "password", autocomplete: "current-password", autofocus: true });
  app.replaceChildren(authBox("Bear Bite Admin", "", h("label", {}, "Password", pw), err,
    h("button", { class: "btn", type: "submit", onclick: async () => { try { await api("POST", "/api/auth/login", { password: pw.value }); boot(); } catch (e) { err.textContent = e.message; } } }, "Log in"),
    h("button", { class: "link", type: "button", onclick: resetScreen }, "Forgot password?")));
}
function resetScreen() {
  const err = h("div", { class: "err" }), key = h("input", { type: "text", autocomplete: "off", placeholder: "XXXX-XXXX-XXXX-XXXX-XXXX" }), pw = h("input", { type: "password", autocomplete: "new-password" });
  app.replaceChildren(authBox("Reset password", "Enter the recovery key you saved when you set up the admin, then choose a new password.",
    h("label", {}, "Recovery key", key), h("label", {}, "New password", h("small", {}, "At least 8 characters"), pw), err,
    h("button", { class: "btn", type: "submit", onclick: async () => { try { const r = await api("POST", "/api/auth/reset", { recoveryKey: key.value, password: pw.value }); showRecovery(r.recoveryKey, loginScreen); } catch (e) { err.textContent = e.message; } } }, "Reset password"),
    h("button", { class: "link", type: "button", onclick: loginScreen }, "Back to log in"),
    h("p", {}, "Lost the key too? In Cloudflare, open Storage & Databases > KV > your namespace and delete the key named auth. Then open /admin to set up again. Menu and photos are kept.")));
}

/* ---------- panels ---------- */
function panelBusiness() {
  const b = content.business;
  return [
    h("div", { class: "card" }, h("h2", {}, "Business details"),
      h("div", { class: "cols" }, field("Business name", b, "name"), field("Tagline", b, "tagline")),
      field("Home page headline", b, "heroTitle"), field("Home page intro text", b, "heroText", { area: true })),
    h("div", { class: "card" }, h("h2", {}, "Contact"),
      h("div", { class: "cols" },
        field("Phone (shown on site)", b, "phoneDisplay", { ph: "+94 77 212 6006" }),
        field("Phone (for tap to call)", b, "phoneLink", { hint: "Digits only with country code, e.g. +94772126006" }),
        field("WhatsApp number", b, "whatsapp", { hint: "Optional. Digits with country code" }),
        field("Email", b, "email", { type: "email", hint: "Optional" })),
      field("Address", b, "address", { area: true }),
      field("Google Maps search text", b, "mapQuery", { hint: "Optional. If the map pin is wrong, type the exact place name, e.g. Bear Bite Boralesgamuwa" })),
    h("div", { class: "card" }, h("h2", {}, "Social links"),
      h("div", { class: "cols" }, field("Facebook", b, "facebook", { type: "url", ph: "https://" }), field("Instagram", b, "instagram", { type: "url", ph: "https://" }), field("TikTok", b, "tiktok", { type: "url", ph: "https://" }))),
    h("div", { class: "card" }, h("h2", {}, "Other"),
      h("div", { class: "cols" }, field("Currency label", b, "currency", { hint: "Shown before prices, e.g. Rs." }), field("Time zone", b, "timezone", { hint: "Used for open or closed status" })),
      field("Footer text", b, "footerText", { hint: "Optional" })),
  ];
}
function panelHours() {
  const s = content.status, statusNote = h("p", {});
  const sel = h("select", {}, ...[["auto", "Automatic (use opening hours)"], ["open", "Force OPEN"], ["closed", "Force CLOSED (sold out, holiday, emergency)"]].map(([v, t]) => h("option", { value: v, selected: s.override === v }, t)));
  sel.addEventListener("change", () => { s.override = sel.value; markDirty(); });
  return [
    h("div", { class: "card" }, h("h2", {}, "Open or closed"), h("p", {}, "Visitors see a live open or closed badge. Use the override for sudden closures."),
      h("label", {}, "Status", sel), field("Custom status message", s, "message", { hint: "Optional. Replaces the badge text, e.g. Closed today for a holiday" }), statusNote),
    h("div", { class: "card" }, h("h2", {}, "Opening hours"), ...content.hours.map(d =>
      h("div", { class: "hrow" }, h("strong", {}, d.day), field("", d, "open", { type: "time" }), field("", d, "close", { type: "time" }), check("Closed", d, "closed"))),
      h("p", {}, "If closing time is earlier than opening time it counts as after midnight.")),
    h("div", { class: "card" }, h("h2", {}, "Announcement bar"), h("p", {}, "A banner across the top of the site. Good for holiday hours or news."),
      check("Show announcement", content.announcement, "enabled"), field("Text", content.announcement, "text", { ph: "We are closed on Poya days" })),
  ];
}
function panelMenu() {
  const out = [];
  content.categories.forEach((cat, ci) => {
    out.push(h("div", { class: "card" },
      h("div", { class: "cat-head" }, field("", cat, "name"),
        h("button", { class: "btn ghost sm", type: "button", title: "Move up", onclick: () => move(content.categories, ci, -1) }, "Up"),
        h("button", { class: "btn ghost sm", type: "button", title: "Move down", onclick: () => move(content.categories, ci, 1) }, "Down"),
        h("button", { class: "btn danger sm", type: "button", onclick: () => { if (confirm(`Delete the whole "${cat.name}" category and its ${cat.items.length} items?`)) { content.categories.splice(ci, 1); markDirty(); render(); } } }, "Delete category")),
      ...cat.items.map((it, ii) => h("div", { class: "item" }, imagePicker(it, "image"),
        h("div", { class: "body" },
          h("div", { class: "cols" }, field("Item name", it, "name"), field("Price", it, "price", { hint: "Number only, or text like 'Ask us'" })),
          field("Description", it, "desc", { area: true }),
          h("div", { class: "row" }, check("Popular", it, "popular"), check("Sold out today", it, "soldOut"), check("Hide from menu", it, "hidden"), h("span", { class: "sp" }),
            h("button", { class: "btn ghost sm", type: "button", onclick: () => move(cat.items, ii, -1) }, "Up"),
            h("button", { class: "btn ghost sm", type: "button", onclick: () => move(cat.items, ii, 1) }, "Down"),
            h("button", { class: "btn danger sm", type: "button", onclick: () => { if (confirm(`Delete "${it.name}"?`)) { cat.items.splice(ii, 1); markDirty(); render(); } } }, "Delete"))))),
      cat.items.length ? null : h("div", { class: "empty" }, "No items yet"),
      h("div", { class: "row" }, h("button", { class: "btn sm", type: "button", onclick: () => { cat.items.push({ id: uid(), name: "New item", desc: "", price: "", image: "", popular: false, soldOut: false, hidden: false }); markDirty(); render(); } }, "+ Add item"))));
  });
  out.push(h("div", { class: "row" }, h("button", { class: "btn", type: "button", onclick: () => { content.categories.push({ id: uid(), name: "New category", items: [] }); markDirty(); render(); } }, "+ Add category")));
  return out;
}
function panelPromos() {
  const out = [h("div", { class: "card" }, h("h2", {}, "Promotions"), h("p", {}, "Active promotions appear on the site. Set dates and they switch on and off by themselves."))];
  content.promotions.forEach((p, i) => out.push(h("div", { class: "card" },
    h("div", { class: "item" }, imagePicker(p, "image"),
      h("div", { class: "body" }, h("div", { class: "cols" }, field("Title", p, "title"), field("Badge", p, "badge", { hint: "e.g. 20% OFF, New" })),
        field("Details", p, "text", { area: true }),
        h("div", { class: "cols" }, field("Starts", p, "start", { type: "date", hint: "Optional" }), field("Ends", p, "end", { type: "date", hint: "Optional" })),
        h("div", { class: "row" }, check("Active", p, "active"), h("span", { class: "sp" }),
          h("button", { class: "btn ghost sm", type: "button", onclick: () => move(content.promotions, i, -1) }, "Up"),
          h("button", { class: "btn ghost sm", type: "button", onclick: () => move(content.promotions, i, 1) }, "Down"),
          h("button", { class: "btn danger sm", type: "button", onclick: () => { if (confirm(`Delete "${p.title}"?`)) { content.promotions.splice(i, 1); markDirty(); render(); } } }, "Delete")))))));
  if (!content.promotions.length) out.push(h("div", { class: "empty" }, "No promotions yet"));
  out.push(h("div", { class: "row" }, h("button", { class: "btn", type: "button", onclick: () => { content.promotions.unshift({ id: uid(), title: "New promotion", text: "", badge: "", image: "", start: "", end: "", active: true }); markDirty(); render(); } }, "+ Add promotion")));
  return out;
}
function panelGallery() {
  const fi = h("input", { type: "file", accept: "image/jpeg,image/png,image/webp", multiple: true, style: "display:none" });
  fi.addEventListener("change", async () => {
    for (const f of fi.files) { try { toast("Uploading..."); content.gallery.push({ id: uid(), url: await uploadFile(f), caption: "" }); markDirty(); } catch (e) { toast(e.message); } }
    fi.value = ""; render();
  });
  return [h("div", { class: "card" }, h("h2", {}, "Gallery photos"), h("p", {}, "These slide automatically on the home page. Photos are resized for you."),
    fi, h("div", { class: "row" }, h("button", { class: "btn", type: "button", onclick: () => fi.click() }, "+ Add photos")),
    content.gallery.length ? h("div", { class: "gal" }, content.gallery.map((g, i) => h("div", { class: "g" }, h("img", { src: g.url, alt: "" }),
      h("div", {}, field("", g, "caption", { ph: "Caption (optional)" }), h("div", { class: "row" },
        h("button", { class: "btn ghost sm", type: "button", onclick: () => move(content.gallery, i, -1) }, "<"),
        h("button", { class: "btn ghost sm", type: "button", onclick: () => move(content.gallery, i, 1) }, ">"),
        h("button", { class: "btn danger sm", type: "button", onclick: () => { content.gallery.splice(i, 1); markDirty(); render(); } }, "Delete")))))) : h("div", { class: "empty" }, "No photos yet"))];
}
function panelAccount() {
  const cur = h("input", { type: "password", autocomplete: "current-password" }), n1 = h("input", { type: "password", autocomplete: "new-password" }), n2 = h("input", { type: "password", autocomplete: "new-password" });
  const cur2 = h("input", { type: "password", autocomplete: "current-password" }), keyBox = h("div", {});
  return [
    h("div", { class: "card" }, h("h2", {}, "Change password"),
      h("label", {}, "Current password", cur), h("label", {}, "New password", h("small", {}, "At least 8 characters"), n1), h("label", {}, "Repeat new password", n2),
      h("div", { class: "row" }, h("button", { class: "btn", type: "button", onclick: async () => {
        if (n1.value !== n2.value) return toast("New passwords do not match");
        try { await api("POST", "/api/admin/password", { current: cur.value, password: n1.value }); cur.value = n1.value = n2.value = ""; toast("Password changed"); } catch (e) { toast(e.message); }
      } }, "Change password"))),
    h("div", { class: "card" }, h("h2", {}, "Recovery key"), h("p", {}, "Make a new recovery key if you lost the old one. The old key stops working."),
      h("label", {}, "Your password", cur2), keyBox,
      h("div", { class: "row" }, h("button", { class: "btn ghost", type: "button", onclick: async () => {
        try { const r = await api("POST", "/api/admin/recovery", { current: cur2.value }); cur2.value = ""; keyBox.replaceChildren(h("p", {}, "Save this now. It is shown only once."), h("div", { class: "key" }, r.recoveryKey)); } catch (e) { toast(e.message); }
      } }, "Make new recovery key"))),
    h("div", { class: "card" }, h("h2", {}, "Backup"), h("p", {}, "Download all menu, promotions and details as a file. Do this now and then."),
      h("div", { class: "row" }, h("a", { class: "btn ghost", href: "/api/admin/backup", download: "bear-bite-backup.json" }, "Download backup"))),
  ];
}

/* ---------- shell ---------- */
const TABS = [["menu", "Menu", panelMenu], ["promos", "Promotions", panelPromos], ["hours", "Hours & status", panelHours], ["business", "Business details", panelBusiness], ["gallery", "Gallery", panelGallery], ["account", "Account", panelAccount]];
function render() {
  const y = window.scrollY, panel = TABS.find(t => t[0] === tab)[2];
  const save = h("button", { class: "btn", type: "button", onclick: saveAll }, "Save changes");
  app.replaceChildren(
    h("div", { class: "top" }, h("div", { class: "t" }, h("img", { src: "/logo.png", alt: "" }), "Bear Bite Admin"), h("span", { class: "sp" }),
      h("a", { class: "btn ghost sm", href: "/", target: "_blank", rel: "noopener" }, "View site"),
      h("button", { class: "btn ghost sm", type: "button", onclick: async () => { if (dirty && !confirm("You have unsaved changes. Log out anyway?")) return; dirty = false; await api("POST", "/api/auth/logout"); boot(); } }, "Log out")),
    h("div", { class: "tabs", role: "tablist" }, TABS.map(([id, label]) => h("button", { role: "tab", "aria-selected": String(id === tab), onclick: () => { tab = id; render(); window.scrollTo(0, 0); } }, label))),
    h("main", {}, panel()),
    h("div", { class: "savebar" + (dirty ? " show" : ""), id: "savebar" }, h("span", { class: "dirty" }, "You have unsaved changes"), save));
  window.scrollTo(0, y);
}
async function saveAll() {
  try { content = await api("PUT", "/api/admin/content", content); dirty = false; toast("Saved. Your website is updated."); render(); } catch (e) { toast(e.message); }
}
async function boot() {
  try {
    const s = await (await fetch("/api/auth/status", { cache: "no-store" })).json();
    if (!s.setup) return setupScreen();
    if (!s.loggedIn) return loginScreen();
    content = await (await fetch("/api/content", { cache: "no-store" })).json(); dirty = false; render();
  } catch (e) { app.replaceChildren(h("div", { class: "center" }, h("div", { class: "box" }, h("h1", {}, "Cannot reach the server"), h("p", {}, "Make sure the Bear Bite server is running."))));}
}
boot();

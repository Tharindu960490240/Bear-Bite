/* ===== EDITABLE BUSINESS DETAILS & MENU DATA ===== */
const BUSINESS = {
  phoneDisplay: "+94 77 212 6006",
  phoneLink: "+94772126006",
  address: "2E Abeyrathne Mawatha, Boralesgamuwa 10290, Sri Lanka",
  hours: "Mon - Sun: 10:00 AM - 9:00 PM",
  facebook: "https://www.facebook.com/p/Bear-Bite-61590313485135/",
  openHour: 10, // 10:00 AM
  closeHour: 21, // 9:00 PM
};

const MENU = {
  Burgers: [
    {
      name: "Classic Bear Burger",
      desc: "Juicy beef patty, melted cheddar cheese, fresh lettuce, tomato, and house special sauce.",
      price: "1200.00",
      tag: "Best Seller",
    },
    {
      name: "Double Grizzly Burger",
      desc: "Double beef patties, double cheese, crunchy pickles, caramelized onions, and smoky BBQ drizzle.",
      price: "1850.00",
      tag: "Chef's Special",
    },
    {
      name: "Crispy Chicken Burger",
      desc: "Golden fried crunchy chicken breast fillet, house coleslaw, spicy mayo on a toasted bun.",
      price: "1350.00",
      tag: "Popular",
    },
    {
      name: "Spicy Volcano Burger",
      desc: "Spiced patty with jalapeños, spicy mayo, pepper jack cheese, and crispy onion rings.",
      price: "1450.00",
      tag: "Spicy 🌶️",
    },
  ],
  Sides: [
    {
      name: "Golden Hot Chips",
      desc: "Hand-cut, crisp golden salted fries served hot.",
      price: "550.00",
      tag: "Crispy",
    },
    {
      name: "Crispy Onion Rings",
      desc: "Thick-cut sweet onion rings battered and fried to perfection.",
      price: "650.00",
      tag: "Vegetarian",
    },
    {
      name: "Chicken Nuggets (6 Pcs)",
      desc: "Tender chicken nuggets with your choice of dipping sauce.",
      price: "850.00",
      tag: "Kids Favorite",
    },
  ],
  Drinks: [
    {
      name: "Chilled Soft Drinks",
      desc: "Assorted carbonated sodas. Ask for today's flavors.",
      price: "250.00",
      tag: "Refreshing",
    },
    {
      name: "Thick Milkshake",
      desc: "Rich creamy milkshakes in Chocolate, Vanilla, or Strawberry.",
      price: "750.00",
      tag: "Customer Favorite",
    },
  ],
  Desserts: [
    {
      name: "Honey Butter Waffle",
      desc: "Warm Belgian waffle drizzled with pure honey and rich butter.",
      price: "800.00",
      tag: "Sweet",
    },
    {
      name: "Fudge Chocolate Brownie",
      desc: "Rich, gooey chocolate brownie served fresh.",
      price: "650.00",
      tag: "Gooey",
    },
  ],
};

const GALLERY = [
  "images/1.jpg",
  "images/2.jpg",
  "images/3.jpg",
  "images/4.jpg",
  "images/5.jpg",
  "images/6.jpg",
];

/* ===== DOM HELPERS ===== */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

const formatCurrency = (p) => {
  const num = parseFloat(p);
  if (isNaN(num) || num === 0) return "Rs. Ask for price";
  return (
    "Rs. " +
    num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
};

/* ===== DYNAMIC BUSINESS DATA BINDING ===== */
$$("[data-phone]").forEach((a) => (a.href = "tel:" + BUSINESS.phoneLink));
$$("[data-phone-text]").forEach((e) => (e.textContent = BUSINESS.phoneDisplay));
if ($("#addr")) $("#addr").textContent = BUSINESS.address;
if ($("#hours")) $("#hours").textContent = BUSINESS.hours;
if ($("#fb")) $("#fb").href = BUSINESS.facebook;
if ($("#yr")) $("#yr").textContent = new Date().getFullYear();

// Embed Google Maps Embed & Link
const mapQuery = encodeURIComponent("Bear Bite, " + BUSINESS.address);
if ($("#mapFrame")) {
  $("#mapFrame").src = `https://www.google.com/maps?q=${mapQuery}&output=embed`;
}
if ($("#mapLink")) {
  $("#mapLink").href =
    `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
}

/* ===== REAL-TIME OPEN STATUS BADGE ===== */
function updateStoreStatus() {
  const now = new Date();
  const currentHour = now.getHours();
  const isOpen =
    currentHour >= BUSINESS.openHour && currentHour < BUSINESS.closeHour;
  const statusBadge = $("#storeStatusBadge");
  const statusText = $("#statusText");

  if (statusBadge && statusText) {
    if (isOpen) {
      statusText.textContent = `Open Now • Closes at ${BUSINESS.closeHour % 12 || 12}:00 PM`;
      statusBadge.style.backgroundColor = "var(--green-bg)";
      statusBadge.style.color = "var(--green)";
    } else {
      statusText.textContent = `Closed Now • Opens at ${BUSINESS.openHour}:00 AM`;
      statusBadge.style.backgroundColor = "rgba(231, 76, 60, 0.15)";
      statusBadge.style.color = "#e74c3c";
      const dot = $(".status-dot", statusBadge);
      if (dot) dot.style.backgroundColor = "#e74c3c";
    }
  }
}
updateStoreStatus();

/* ===== MENU CATEGORY TAB SWITCHING ===== */
const tabsContainer = $("#tabs");
const menuGrid = $("#menuGrid");
function renderMenuCategory(category) {
  $$(".tab-btn", tabsContainer).forEach((btn) => {
    btn.setAttribute("aria-selected", btn.dataset.cat === category);
  });

  const items = MENU[category] || [];
  menuGrid.innerHTML = items
    .map(
      (item) => `
      <article class="menu-card">
        <div>
          <div class="menu-card-header">
            <h3>${item.name}</h3>
            <span class="price-tag">${formatCurrency(item.price)}</span>
          </div>
          <p>${item.desc || ""}</p>
        </div>
        <div class="menu-card-footer">
          <span class="item-tag">${item.tag || "Bear Bite"}</span>
          <a data-phone href="tel:${BUSINESS.phoneLink}" style="font-weight:700; font-size:0.85rem; color:var(--accent);">Order →</a>
        </div>
      </article>
    `,
    )
    .join("");
}

if (tabsContainer && menuGrid) {
  Object.keys(MENU).forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "tab-btn";
    btn.textContent = cat;
    btn.dataset.cat = cat;
    btn.setAttribute("role", "tab");
    btn.onclick = () => renderMenuCategory(cat);
    tabsContainer.appendChild(btn);
  });

  renderMenuCategory(Object.keys(MENU)[0]);
}

/* ===== THEME SWITCHER ===== */
const themeBtn = $("#themeBtn");
if (themeBtn) {
  themeBtn.onclick = () => {
    const currentTheme = document.documentElement.dataset.theme;
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    try {
      localStorage.setItem("bb-theme", nextTheme);
    } catch (e) {}
  };
}

/* ===== RESPONSIVE GALLERY SLIDER WITH INDICATORS ===== */
const track = $("#galTrack");
const dotsContainer = $("#galDots");

if (track) {
  GALLERY.forEach((src, i) => {
    const slide = document.createElement("div");
    slide.className = "gallery-slide";

    const img = document.createElement("img");
    img.src = src;
    img.alt = `Bear Bite food gallery item ${i + 1}`;
    img.loading = "lazy";

    img.onerror = () => {
      img.src = "logo.png";
      img.style.objectFit = "contain";
      img.style.padding = "2rem";
    };

    slide.appendChild(img);
    track.appendChild(slide);

    if (dotsContainer) {
      const dot = document.createElement("span");
      dot.className = `dot ${i === 0 ? "active" : ""}`;
      dotsContainer.appendChild(dot);
    }
  });

  const getStep = () => {
    const firstSlide = track.firstElementChild;
    return firstSlide ? firstSlide.getBoundingClientRect().width + 16 : 300;
  };

  const updateDots = () => {
    if (!dotsContainer) return;
    const scrollIndex = Math.round(track.scrollLeft / getStep());
    $$(".dot", dotsContainer).forEach((d, idx) => {
      d.classList.toggle("active", idx === scrollIndex);
    });
  };

  const nextSlide = () => {
    const isEnd =
      track.scrollLeft + track.clientWidth >= track.scrollWidth - 10;
    if (isEnd) {
      track.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      track.scrollBy({ left: getStep(), behavior: "smooth" });
    }
  };

  const prevSlide = () => {
    if (track.scrollLeft <= 5) {
      track.scrollTo({ left: track.scrollWidth, behavior: "smooth" });
    } else {
      track.scrollBy({ left: -getStep(), behavior: "smooth" });
    }
  };

  if ($("#next")) $("#next").onclick = nextSlide;
  if ($("#prev")) $("#prev").onclick = prevSlide;

  track.addEventListener("scroll", updateDots, { passive: true });

  let autoTimer;
  const startAutoPlay = () => {
    clearInterval(autoTimer);
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      autoTimer = setInterval(nextSlide, 4000);
    }
  };

  const stopAutoPlay = () => clearInterval(autoTimer);

  ["mouseenter", "touchstart", "focusin"].forEach((evt) =>
    track.addEventListener(evt, stopAutoPlay, { passive: true }),
  );
  ["mouseleave", "touchend", "focusout"].forEach((evt) =>
    track.addEventListener(evt, startAutoPlay, { passive: true }),
  );

  document.addEventListener("visibilitychange", () =>
    document.hidden ? stopAutoPlay() : startAutoPlay(),
  );

  startAutoPlay();
}

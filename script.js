/* ===== EDITABLE BUSINESS DETAILS & DATA ===== */
const BUSINESS = {
  phoneDisplay: "075 702 6004",
  phoneLink: "0757026004",
  address: "Boralesgamuwa, Sri Lanka",
  hours: "Mon - Sun: 06:30 AM - 11:00 PM",
  facebook: "https://www.facebook.com/p/Bear-Bite-61590313485135/",
  openHour: 6, // 06:30 AM
  closeHour: 23, // 11:00 PM
};

/* ===== SPECIAL OFFERS DATA ===== */
const OFFERS = [
  {
    title: "Chicken Fried Rice Sawan",
    sinhalaText: "චිකන් රයිස් කිලෝ එකම 1500/- ක් විතරයි",
    desc: "A generous 1KG Sawan pack of fresh, flavorful Chicken Fried Rice. Perfect for family gatherings and group meals.",
    price: "RS. 1,500",
    image: "images/chicken-fried-rice-sawan.jpeg",
    fallbackImg: "images/chicken-fried-rice-sawan.jpeg",
    badge: "1KG Sawan Deal",
    tag: "1KG Sawan Pack",
  },
  {
    title: "Kottu Sawan",
    sinhalaText: "කොත්තු කිලෝ එකම 1800/- ක් විතරයි",
    desc: "A massive 1KG Sawan pack of authentic, sizzling Kottu cooked fresh and hot to order.",
    price: "RS. 1,800",
    image: "images/kottu-sawan.jpeg",
    fallbackImg: "images/kottu-sawan.jpeg",
    badge: "1KG Sawan Deal",
    tag: "1KG Sawan Pack",
  },
];

/* ===== MENU DATA ACCORDING TO BEAR BITE MENU ===== */
const MENU = {
  "Rice & Curry": [
    {
      name: "Vege Rice & Curry",
      desc: "Traditional Sri Lankan rice served with delicious fresh vegetable curries.",
      price: "RS. 450",
      tag: "Vegetarian",
    },
    {
      name: "Egg Rice & Curry",
      desc: "Rice and curry served with seasoned cooked egg and flavorful sambols.",
      price: "RS. 500",
      tag: "Popular",
    },
    {
      name: "Chicken Rice & Curry",
      desc: "Authentic Sri Lankan rice accompanied by spiced chicken curry and delicious sides.",
      price: "RS. 550",
      tag: "Best Seller",
    },
    {
      name: "Pork Rice & Curry",
      desc: "Hearty rice and curry dish served with rich, flavorful Sri Lankan pork curry.",
      price: "RS. 900",
      tag: "Chef Special",
    },
  ],
  Rice: [
    {
      name: "Bear Bite Vegetable Rice",
      desc: "Aromatic fried rice mixed with fresh garden vegetables.",
      price: "S: RS. 700 / L: RS. 1,100",
      tag: "Vegetarian",
    },
    {
      name: "Bear Bite Chicken Rice",
      desc: "Our signature fried rice tossed with tender chicken pieces and spices.",
      price: "S: RS. 900 / L: RS. 1,300",
      tag: "Best Seller",
    },
    {
      name: "Bear Bite Seafood Rice",
      desc: "Flavorful fried rice loaded with seasoned seafood cuttlefish and prawns.",
      price: "S: RS. 1,300 / L: RS. 1,700",
      tag: "Seafood",
    },
    {
      name: "Egg & Onion Rice",
      desc: "Freshly cooked rice stir-fried with fluffy egg and sweet onions.",
      price: "S: RS. 850 / L: RS. 1,200",
      tag: "Tasty",
    },
    {
      name: "Mixed Chopsuey Rice",
      desc: "Rich wok-fried chopsuey served on a bed of fresh fried rice.",
      price: "RS. 2,300",
      tag: "Special",
    },
    {
      name: "Nasi Goreng",
      desc: "Indonesian-style fried rice with spices and fried egg topping.",
      price: "RS. 1,500",
      tag: "Popular",
    },
  ],
  Noodles: [
    {
      name: "Bear Bite Vegetable Noodles",
      desc: "Stir-fried noodle dish loaded with crisp vegetables and herbs.",
      price: "S: RS. 700 / L: RS. 1,050",
      tag: "Vegetarian",
    },
    {
      name: "Bear Bite Chicken Noodles",
      desc: "Hot, wok-tossed noodles packed with tender chicken and seasonings.",
      price: "S: RS. 950 / L: RS. 1,300",
      tag: "Customer Favorite",
    },
    {
      name: "Bear Bite Seafood Noodles",
      desc: "Rich noodles stir-fried with fresh seafood delicacies.",
      price: "S: RS. 1,300 / L: RS. 1,750",
      tag: "Seafood",
    },
    {
      name: "Chinese Mixed Noodles",
      desc: "Chinese style stir-fried noodles cooked with mixed meats and veggies.",
      price: "S: RS. 1,250 / L: RS. 1,650",
      tag: "Chef Special",
    },
  ],
  Kottu: [
    {
      name: "Bear Bite Vegetable Kottu",
      desc: "Chopped flatbread chopped fresh with mixed vegetables and spices.",
      price: "S: RS. 650 / L: RS. 1,000",
      tag: "Vegetarian",
    },
    {
      name: "Bear Bite Special Chicken Kottu",
      desc: "Sizzling kottu chopped with succulent chicken, vegetables, and hot gravy.",
      price: "S: RS. 950 / L: RS. 1,400",
      tag: "Best Seller",
    },
    {
      name: "Bear Bite Cheese Kottu",
      desc: "Creamy Kottu layered with melted cheese and seasonings.",
      price: "S: RS. 1,050 / L: RS. 1,600",
      tag: "Cheesy",
    },
    {
      name: "Bear Bite Cheese Chicken Kottu",
      desc: "Juicy chicken kottu drenched in melted gooey cheese.",
      price: "S: RS. 1,250 / L: RS. 1,750",
      tag: "Top Rated",
    },
    {
      name: "Bear Bite Nai Miris Kottu",
      desc: "Extra spicy Sri Lankan Kottu infused with fiery local Nai Miris chilies.",
      price: "S: RS. 900 / L: RS. 1,250",
      tag: "Spicy",
    },
    {
      name: "Mixed Kottu",
      desc: "Rich combination Kottu mixed with chicken, egg, and special spices.",
      price: "S: RS. 1,300 / L: RS. 1,850",
      tag: "Hearty",
    },
    {
      name: "Seafood Kottu",
      desc: "Sizzling kottu chopped with fresh cuttlefish, prawns, and herbs.",
      price: "S: RS. 1,300 / L: RS. 1,850",
      tag: "Seafood",
    },
    {
      name: "Egg Kottu",
      desc: "Classic street style Kottu chopped hot with fresh eggs.",
      price: "S: RS. 750 / L: RS. 1,100",
      tag: "Classic",
    },
    {
      name: "Idiyappam Chicken Kottu",
      desc: "Unique String Hopper (Idiyappam) Kottu cooked with spiced chicken.",
      price: "S: RS. 950 / L: RS. 1,300",
      tag: "Specialty",
    },
    {
      name: "Idiyappam Seafood Kottu",
      desc: "String Hopper Kottu stir-fried with fresh seafood.",
      price: "S: RS. 1,300 / L: RS. 1,850",
      tag: "Specialty",
    },
    {
      name: "Idiyappam Mixed Kottu",
      desc: "String Hopper Kottu cooked with chicken, egg, and vegetables.",
      price: "S: RS. 1,300 / L: RS. 1,850",
      tag: "Specialty",
    },
  ],
  Appetizer: [
    {
      name: "Chicken Spring Rolls (4 Pcs)",
      desc: "Crispy rolls filled with savory spiced chicken filling.",
      price: "RS. 300",
      tag: "Crispy",
    },
    {
      name: "Cuttlefish (3 Pcs)",
      desc: "Golden fried seasoned cuttlefish pieces.",
      price: "RS. 200",
      tag: "Seafood",
    },
    {
      name: "Egg Rolls",
      desc: "Crispy Sri Lankan fried snack stuffed with egg and spices.",
      price: "RS. 100",
      tag: "Snack",
    },
    {
      name: "Parata",
      desc: "Flaky, layered traditional flatbread served warm.",
      price: "RS. 60",
      tag: "Bread",
    },
    {
      name: "Egg Roti",
      desc: "Fresh pan-baked roti filled with egg.",
      price: "RS. 120",
      tag: "Bread",
    },
    {
      name: "Hopper",
      desc: "Crispy edged bowl-shaped Sri Lankan hopper.",
      price: "RS. 40",
      tag: "Traditional",
    },
    {
      name: "Egg Hopper",
      desc: "Hot hopper with a soft-cooked egg baked in the center.",
      price: "RS. 100",
      tag: "Traditional",
    },
  ],
  Omelette: [
    {
      name: "Plain Omelette",
      desc: "Pan-fried fresh eggs seasoned with salt and pepper.",
      price: "RS. 300",
      tag: "Classic",
    },
    {
      name: "Cheese Omelette",
      desc: "Soft fluffy omelette stuffed with rich melted cheese.",
      price: "RS. 500",
      tag: "Cheesy",
    },
    {
      name: "Cheese & Chicken Omelette",
      desc: "Omelette stuffed with tender chicken and gooey melted cheese.",
      price: "RS. 650",
      tag: "Hearty",
    },
    {
      name: "Bear Bite Spicy Sri Lankan Omelette",
      desc: "Local style omelette loaded with onions, green chilies, and spices.",
      price: "RS. 650",
      tag: "Spicy",
    },
  ],
  Chicken: [
    {
      name: "Black Pepper Chicken",
      desc: "Succulent chicken tossed in a spicy, aromatic black pepper sauce.",
      price: "RS. 1,350",
      tag: "Chef Special",
    },
    {
      name: "Chicken Devilled",
      desc: "Spicy Sri Lankan devilled chicken cooked with capsicums and onions.",
      price: "RS. 1,350",
      tag: "Spicy",
    },
    {
      name: "Chilli Chicken",
      desc: "Wok-fried chicken cooked with hot chili peppers and sauce.",
      price: "RS. 1,350",
      tag: "Spicy",
    },
    {
      name: "Bear Bite Chicken Set Menu",
      desc: "Complete chicken meal pack served with rice and side accompaniments.",
      price: "S: RS. 850 / L: RS. 1,000",
      tag: "Set Menu",
    },
    {
      name: "Chicken Fried Rice Budget Pack",
      desc: "Affordable single serving pack of delicious chicken fried rice.",
      price: "RS. 400",
      tag: "Budget Pack",
    },
  ],
  "Fish & Seafood": [
    {
      name: "Fish Devilled",
      desc: "Tender fish cooked in hot devilled sauce with vegetables.",
      price: "RS. 1,200",
      tag: "Spicy Seafood",
    },
    {
      name: "Fish Fry",
      desc: "Crispy fried fish slice seasoned with local herbs.",
      price: "RS. 400",
      tag: "Seafood",
    },
    {
      name: "Hot Butter Prawns",
      desc: "Prawns fried crisp and tossed in rich garlic butter sauce.",
      price: "RS. 1,500",
      tag: "Customer Favorite",
    },
    {
      name: "Prawns Devilled",
      desc: "Fiery devilled prawns cooked with green chilies and onions.",
      price: "RS. 1,600",
      tag: "Spicy Seafood",
    },
    {
      name: "Hot Butter Cuttlefish",
      desc: "Signature crispy fried cuttlefish tossed in spicy hot butter sauce.",
      price: "RS. 1,600",
      tag: "Top Favorite",
    },
    {
      name: "Cuttlefish Devilled",
      desc: "Cuttlefish rings tossed in spicy devilled gravy.",
      price: "RS. 1,600",
      tag: "Spicy Seafood",
    },
  ],
  Pork: [
    {
      name: "Black Pork Curry",
      desc: "Traditional Sri Lankan roasted dark pork curry cooked with black spices.",
      price: "RS. 1,700",
      tag: "Sri Lankan Classic",
    },
    {
      name: "Pork Devilled",
      desc: "Spicy devilled pork tossed with hot sauce, onions, and peppers.",
      price: "RS. 1,700",
      tag: "Spicy",
    },
    {
      name: "Black Pepper Pork",
      desc: "Pork cooked with crushed black pepper and aromatics.",
      price: "RS. 1,700",
      tag: "Flavorful",
    },
  ],
  Vegetable: [
    {
      name: "Chopsuey",
      desc: "Fresh, crisp mixed vegetables cooked in light stir-fry sauce.",
      price: "RS. 800",
      tag: "Vegetarian",
    },
    {
      name: "Boiled Vegetable",
      desc: "Freshly boiled garden vegetables lightly seasoned.",
      price: "RS. 600",
      tag: "Healthy Choice",
    },
  ],
};

/* ===== GALLERY DATA ===== */
const GALLERY = [
  "images/1.jpeg",
  "images/2.jpeg",
  "images/3.jpeg",
  "images/4.jpeg",
  "images/5.jpeg",
  "images/6.jpeg",
];

/* ===== DOM HELPERS ===== */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

/* ===== DYNAMIC BUSINESS DATA BINDING ===== */
$$("[data-phone]").forEach((a) => (a.href = "tel:" + BUSINESS.phoneLink));
$$("[data-phone-text]").forEach((e) => (e.textContent = BUSINESS.phoneDisplay));
if ($("#addr")) $("#addr").textContent = BUSINESS.address;
if ($("#hours")) $("#hours").textContent = BUSINESS.hours;
if ($("#fb")) $("#fb").href = BUSINESS.facebook;
if ($("#yr")) $("#yr").textContent = new Date().getFullYear();

// Embed Google Maps Link
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
      statusText.textContent = `Closed Now • Opens at ${BUSINESS.openHour}:30 AM`;
      statusBadge.style.backgroundColor = "rgba(231, 76, 60, 0.15)";
      statusBadge.style.color = "#e74c3c";
      const dot = $(".status-dot", statusBadge);
      if (dot) dot.style.backgroundColor = "#e74c3c";
    }
  }
}
updateStoreStatus();

/* ===== RENDER SPECIAL OFFERS ===== */
const offersGrid = $("#offersGrid");
function renderOffers() {
  if (!offersGrid) return;
  offersGrid.innerHTML = OFFERS.map(
    (offer) => `
    <article class="offer-card">
      <div class="offer-image-wrapper">
        <img
          src="${offer.image}"
          alt="${offer.title}"
          class="offer-image"
          onerror="this.onerror=null; this.src='${offer.fallbackImg || "logo.png"}';"
          loading="lazy"
        />
        <span class="offer-badge">${offer.badge}</span>
      </div>
      <div class="offer-content">
        <h3 class="offer-title">${offer.title}</h3>
        <p class="offer-sinhala">${offer.sinhalaText}</p>
        <p class="offer-desc">${offer.desc}</p>
        <div class="offer-price-row">
          <span class="offer-price">${offer.price}</span>
          <a class="btn btn-sm btn-primary" data-phone href="tel:${BUSINESS.phoneLink}">
            <span>Order Now</span>
          </a>
        </div>
      </div>
    </article>
  `,
  ).join("");
}
renderOffers();

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
            <span class="price-tag">${item.price}</span>
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

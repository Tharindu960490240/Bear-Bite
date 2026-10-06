/* ===== EDIT THIS SECTION: business details and menu ===== */
const BUSINESS = {
  phoneDisplay: "(000) 000-0000", // shown on the page
  phoneLink: "+10000000000", // used for tap-to-call, digits only with country code
  address: "Your street address, City",
  hours: "Mon to Sun: 10:00 AM to 9:00 PM",
  facebook: "https://www.facebook.com/p/Bear-Bite-61590313485135/",
};
const MENU = {
  Burgers: [
    {
      name: "Classic Bear Burger",
      desc: "Beef patty, cheese, lettuce, tomato, house sauce.",
      price: "0.00",
    },
    {
      name: "Double Grizzly",
      desc: "Two patties, double cheese, pickles.",
      price: "0.00",
    },
    {
      name: "Crispy Chicken Burger",
      desc: "Crunchy chicken, slaw, mayo.",
      price: "0.00",
    },
  ],
  Sides: [
    { name: "Hot Chips", desc: "Golden and salted.", price: "0.00" },
    { name: "Onion Rings", desc: "Crisp, thick cut.", price: "0.00" },
    { name: "Nuggets (6)", desc: "With a dipping sauce.", price: "0.00" },
  ],
  Drinks: [
    { name: "Soft Drink", desc: "Ask for today's flavours.", price: "0.00" },
    {
      name: "Milkshake",
      desc: "Chocolate, vanilla or strawberry.",
      price: "0.00",
    },
  ],
  Sweets: [
    {
      name: "Honey Waffle",
      desc: "Warm waffle drizzled with honey.",
      price: "0.00",
    },
    { name: "Choc Brownie", desc: "Rich and gooey.", price: "0.00" },
  ],
};
/* ===== end of editable section ===== */

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const money = (p) =>
  isNaN(parseFloat(p)) ? p : "$" + parseFloat(p).toFixed(2);

$$("[data-phone]").forEach((a) => (a.href = "tel:" + BUSINESS.phoneLink));
$$("[data-phone-text]").forEach((e) => (e.textContent = BUSINESS.phoneDisplay));
$("#addr").textContent = BUSINESS.address;
$("#hours").textContent = BUSINESS.hours;
$("#fb").href = BUSINESS.facebook;
$("#yr").textContent = new Date().getFullYear();

const tabs = $("#tabs"),
  grid = $("#menuGrid");
function show(cat) {
  $$("button", tabs).forEach((b) =>
    b.setAttribute("aria-selected", b.dataset.cat === cat),
  );
  grid.innerHTML = MENU[cat]
    .map(
      (i) =>
        `<article class="item"><div class="row"><h3>${i.name}</h3><span class="price">${money(i.price)}</span></div><p>${i.desc || ""}</p></article>`,
    )
    .join("");
}
Object.keys(MENU).forEach((cat) => {
  const b = document.createElement("button");
  b.textContent = cat;
  b.dataset.cat = cat;
  b.setAttribute("role", "tab");
  b.onclick = () => show(cat);
  tabs.appendChild(b);
});
show(Object.keys(MENU)[0]);

$("#themeBtn").onclick = () => {
  const next =
    document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem("bb-theme", next);
  } catch (e) {}
};

/* NOIRÉ ATELIER — vanilla JavaScript interactions */
(() => {
  "use strict";

  const WHATSAPP_NUMBER = "919000000000"; // Replace with the real business number.
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const products = {
    eclipse: {
      number: "SIGNATURE Nº 01", name: "Éclipse Noire", price: "₹1,850",
      description: "A study in depth and contrast: dark chocolate mousse layered with hazelnut praline and a delicate cocoa biscuit.",
      image: "assets/images/signature_eclipse_noire_1795507039674.jpg",
      layers: "Dark chocolate mousse · Hazelnut praline · Cocoa biscuit",
      allergens: "Contains dairy, gluten, hazelnuts and soy."
    },
    rose: {
      number: "SIGNATURE Nº 02", name: "Rosé Velours", price: "₹2,100",
      description: "A soft, fruit-led composition balancing bright raspberry crémeux with vanilla mousse and almond sponge.",
      image: "assets/images/signature_rose_velours_1795507040243.jpg",
      layers: "Raspberry crémeux · Vanilla mousse · Almond sponge",
      allergens: "Contains dairy, eggs and almonds."
    },
    opera: {
      number: "SIGNATURE Nº 03", name: "Opéra d'Or", price: "₹2,250",
      description: "An elegant meeting of roasted coffee, fine chocolate and almond sponge, finished with a delicate glaze.",
      image: "assets/images/signature_opera_dor_1795507040800.jpg",
      layers: "Espresso ganache · Almond joconde · Chocolate glaze",
      allergens: "Contains dairy, eggs, gluten, almonds and caffeine."
    },
    fleur: {
      number: "SIGNATURE Nº 04", name: "Fleur de Vanille", price: "₹1,950",
      description: "Madagascar vanilla and white chocolate meet seasonal fruit in a light, carefully balanced creation.",
      image: "assets/images/signature_fleur_vanille_1795507041238.jpg",
      layers: "Madagascar vanilla · White chocolate · Seasonal fruit",
      allergens: "Contains dairy and may contain tree nuts depending on seasonal garnish."
    }
  };

  const journal = [
    {
      id: "french", category: "CRAFT & CULTURE", title: "The Quiet Art of French Patisserie",
      meta: "06 MIN READ · NOTES FROM THE ATELIER",
      image: "assets/images/journal_french_patisserie_1795507045160.jpg",
      excerpt: "The most memorable details are often the quietest ones.",
      body: [
        "French patisserie is often associated with elaborate finishes and precise geometry. Yet its most enduring lesson is restraint: knowing when a flavour, texture or decorative detail has reached exactly the right point.",
        "A balanced dessert asks for patience at every stage. The sponge must carry without weighing down, the cream must soften without overwhelming, and the finish should bring the composition together rather than compete for attention.",
        "At the atelier, we return to this idea often. Make each element matter, and allow the whole to speak for itself."
      ]
    },
    {
      id: "chocolate", category: "INGREDIENT NOTES", title: "Understanding the Beauty of Dark Chocolate",
      meta: "04 MIN READ · INGREDIENT NOTES",
      image: "assets/images/journal_dark_chocolate_1795507044105.jpg",
      excerpt: "Depth is not simply a question of percentage. It is a question of balance.",
      body: [
        "Dark chocolate can move from bright fruit notes to roasted, earthy depth depending on its origin, fermentation and roast. Its character is shaped long before it reaches the pastry kitchen.",
        "In a finished dessert, bitterness can bring structure. It gives sweetness somewhere to go and allows textures such as praline, mousse and crisp biscuit to feel distinct.",
        "The aim is never to make chocolate louder. It is to let its character remain clear."
      ]
    },
    {
      id: "seasonal", category: "SEASONAL THINKING", title: "A Celebration of Seasonal Ingredients",
      meta: "05 MIN READ · SEASONAL THINKING",
      image: "assets/images/journal_seasonal_ingredients_1795507045928.jpg",
      excerpt: "Good ingredients have their own calendar. We think a dessert should listen to it.",
      body: [
        "Seasonality gives a kitchen a reason to keep looking. Fruit changes in sweetness, acidity and texture as the year moves, and those differences can shape an entirely new composition.",
        "Rather than forcing the same garnish into every season, we use what is at its best as a starting point. A dessert can then feel connected to a particular moment without needing to announce it.",
        "It is a simple approach: choose thoughtfully, use carefully and let the ingredient keep its voice."
      ]
    }
  ];

  const header = $("#siteHeader");
  const menuToggle = $("#menuToggle");
  const mobileNav = $("#mobileNav");
  const productModal = $("#productModal");
  const journalModal = $("#journalModal");
  const enquiryModal = $("#enquiryModal");
  let currentJournalIndex = 0;
  let lastFocusedElement = null;

  // Compact header on scroll.
  const updateHeader = () => header.classList.toggle("scrolled", window.scrollY > 24);
  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  // Mobile navigation.
  function closeMenu() {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    mobileNav.classList.remove("open");
    mobileNav.setAttribute("aria-hidden", "true");
    document.body.classList.remove("menu-open");
  }
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    mobileNav.classList.toggle("open", !isOpen);
    mobileNav.setAttribute("aria-hidden", String(isOpen));
  });
  $$("a", mobileNav).forEach(link => link.addEventListener("click", closeMenu));

  // Modal helpers.
  function openModal(modal) {
    lastFocusedElement = document.activeElement;
    $$(".modal.open").forEach(m => closeModal(m));
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    const focusable = $('button:not([disabled]),a[href],input,select,textarea', modal);
    if (focusable) setTimeout(() => focusable.focus(), 30);
  }
  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    if (!$(".modal.open")) document.body.classList.remove("modal-open");
    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") lastFocusedElement.focus();
  }
  $$("[data-close-modal]").forEach(el => el.addEventListener("click", () => closeModal(el.closest(".modal"))));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      const open = $(".modal.open");
      if (open) closeModal(open);
      closeMenu();
    }
    if (event.key === "Tab" && $(".modal.open")) {
      const modal = $(".modal.open");
      const items = $$('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled])', modal)
        .filter(el => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });

  // Product details.
  function showProduct(key) {
    const item = products[key];
    if (!item) return;
    $("#modalProductImage").src = item.image;
    $("#modalProductImage").alt = item.name;
    $("#modalProductNumber").textContent = item.number;
    $("#productModalTitle").textContent = item.name;
    $("#modalProductDescription").textContent = item.description;
    $("#modalProductPrice").textContent = item.price;
    $("#modalProductLayers").textContent = item.layers;
    $("#modalProductAllergens").textContent = item.allergens;
    $("#modalProductEnquire").dataset.productEnquiry = item.name;
    openModal(productModal);
  }
  $$("[data-product-open]").forEach(button => button.addEventListener("click", () => showProduct(button.dataset.productOpen)));
  $("#modalProductEnquire").addEventListener("click", event => {
    const name = event.currentTarget.dataset.productEnquiry || "";
    closeModal(productModal);
    openEnquiry("Signature creation — " + name);
  });

  // Journal reader.
  function showJournal(index) {
    currentJournalIndex = (index + journal.length) % journal.length;
    const item = journal[currentJournalIndex];
    $("#journalModalCategory").textContent = item.category;
    $("#journalModalTitle").textContent = item.title;
    $("#journalModalMeta").textContent = item.meta;
    $("#journalModalImage").src = item.image;
    $("#journalModalImage").alt = item.title;
    $("#journalModalExcerpt").textContent = item.excerpt;
    $("#journalModalBody").innerHTML = item.body.map(p => `<p>${escapeHTML(p)}</p>`).join("");
    openModal(journalModal);
  }
  $$("[data-journal]").forEach(button => button.addEventListener("click", () => {
    const index = journal.findIndex(item => item.id === button.dataset.journal);
    if (index >= 0) showJournal(index);
  }));
  $("#journalPrev").addEventListener("click", () => showJournal(currentJournalIndex - 1));
  $("#journalNext").addEventListener("click", () => showJournal(currentJournalIndex + 1));

  function escapeHTML(value) {
    return value.replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    }[char]));
  }

  // Enquiry form.
  function openEnquiry(occasion = "") {
    closeMenu();
    const form = $("#enquiryForm");
    form.hidden = false;
    $("#formSuccess").hidden = true;
    $("#formError").textContent = "";
    if (occasion) $("#occasionSelect").value = occasion;
    else $("#occasionSelect").value = "";
    openModal(enquiryModal);
  }
  $$("[data-open-enquiry]").forEach(button => button.addEventListener("click", () => {
    openEnquiry(button.dataset.occasion || "");
  }));

  $("#enquiryForm").addEventListener("submit", event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const occasion = String(data.get("occasion") || "").trim();
    const date = String(data.get("date") || "").trim();
    const guests = String(data.get("guests") || "").trim();
    const message = String(data.get("message") || "").trim();
    if (!name || !email || !occasion) {
      $("#formError").textContent = "Please complete your name, email and occasion.";
      return;
    }
    const lines = [
      "Hello NOIRÉ ATELIER, I would like to make an enquiry.",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Occasion: ${occasion}`,
      date ? `Preferred date: ${date}` : "",
      guests ? `Approximate guests: ${guests}` : "",
      message ? `Details: ${message}` : ""
    ].filter(Boolean);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
    $("#whatsappLaunch").href = url;
    form.hidden = true;
    $("#formSuccess").hidden = false;
    $("#formError").textContent = "";
  });
  $("#whatsappLaunch").addEventListener("click", () => {
    showToast("Review your enquiry in WhatsApp before sending.");
  });

  // Generic toast feedback.
  let toastTimer;
  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
  }

  // Close mobile menu when viewport returns to desktop.
  window.addEventListener("resize", () => {
    if (window.innerWidth > 700) closeMenu();
  });

  // Smooth anchor fallback for browsers with CSS scroll-behavior support.
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      if (link.closest(".mobile-nav")) closeMenu();
    });
  });

  // Mark the current year dynamically while retaining the brand's demo year.
  // Demo content intentionally uses 2026 as supplied in the original project.
})();
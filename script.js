const deadline = new Date("2026-11-01T23:59:59+01:00").getTime();
const countdown = document.querySelector("#countdown");

function updateCountdown() {
  const days = Math.max(0, Math.ceil((deadline - Date.now()) / 86400000));
  if (countdown) countdown.textContent = String(days);
}

updateCountdown();
window.setInterval(updateCountdown, 60000);

const copyButton = document.querySelector("#copy-sample");
const sample = document.querySelector("#sample-text");

copyButton?.addEventListener("click", async () => {
  const text = sample?.content.textContent?.trim() ?? "";
  try {
    await navigator.clipboard.writeText(text);
    copyButton.textContent = "Kopiert!";
    window.setTimeout(() => { copyButton.textContent = "Kopier hele tekstforslaget"; }, 1800);
  } catch {
    copyButton.textContent = "Kunne ikke kopiere";
  }
});

const tabs = [...document.querySelectorAll("[role='tab']")];
const panels = [...document.querySelectorAll("[role='tabpanel']")];

function activateTab(name, focus = false) {
  const activeTab = tabs.find((tab) => tab.dataset.tab === name);
  const activePanel = panels.find((panel) => panel.dataset.panel === name);
  if (!activeTab || !activePanel) return;

  tabs.forEach((tab) => {
    const selected = tab === activeTab;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  panels.forEach((panel) => { panel.hidden = panel !== activePanel; });
  activeTab.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  if (focus) activeTab.focus();
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => activateTab(tab.dataset.tab));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    let next = index;
    if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = tabs.length - 1;
    activateTab(tabs[next].dataset.tab, true);
  });
});

const menuToggle = document.querySelector(".menu-toggle");
const menu = document.querySelector("#main-menu");

function closeMenu() {
  menuToggle?.setAttribute("aria-expanded", "false");
  menu?.classList.remove("is-open");
  document.body.classList.remove("menu-open");
}

menuToggle?.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(open));
  menu?.classList.toggle("is-open", open);
  document.body.classList.toggle("menu-open", open);
});

document.querySelectorAll("[data-tab-target]").forEach((link) => {
  link.addEventListener("click", () => {
    activateTab(link.dataset.tabTarget);
    closeMenu();
  });
});

menu?.querySelectorAll("a:not([data-tab-target])").forEach((link) => link.addEventListener("click", closeMenu));

window.addEventListener("resize", () => {
  if (window.innerWidth > 1100) closeMenu();
});

// Add future campaign images here after placing the files in assets/.
// Example: { src: "assets/hero-1.jpg", alt: "Elever i språkundervisning", caption: "Valgfri bildetekst" }
const heroImages = [
  {
    src: "assets/markus-spiske-AAz715reF9s-unsplash.jpg",
    alt: "Elever som arbeider sammen i en språktime",
    caption: "Bilde av Markus Spiske på Unsplash"
  },
  {
    src: "assets/danique-veldhuis-ELJwt70SQtM-unsplash.jpg",
    alt: "Sagrada Familia i Barcelona",
    caption: "Bilde av Danique Veldhuis på Unsplash"
  },
  {
    src: "assets/tomas-nozina-nwT0Y-NaQ4Y-unsplash.jpg",
    alt: "Louvre i Paris",
    caption: "Bilde av Tomáš Nožina på Unsplash"
  }
];

document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  heroImages.forEach(({ src, alt, caption = "" }) => {
    const slide = document.createElement("figure");
    slide.className = "hero-slide hero-image-slide";
    slide.dataset.slide = "";
    slide.hidden = true;
    const image = document.createElement("img");
    image.src = src;
    image.alt = alt;
    slide.append(image);
    if (caption) {
      const figcaption = document.createElement("figcaption");
      figcaption.textContent = caption;
      slide.append(figcaption);
    }
    carousel.insertBefore(slide, carousel.querySelector(".carousel-controls"));
  });

  const slides = [...carousel.querySelectorAll("[data-slide]")];
  const controls = carousel.querySelector(".carousel-controls");
  const status = carousel.querySelector("[data-carousel-status]");
  let activeIndex = 0;

  function showSlide(index) {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.hidden = slideIndex !== activeIndex;
      slide.classList.toggle("is-active", slideIndex === activeIndex);
    });
    if (status) status.textContent = `${activeIndex + 1} / ${slides.length}`;
  }

  if (slides.length > 0) showSlide(0);

  if (slides.length > 1) {
    controls.hidden = false;

    const delay = 5000;
    let autoplay;

    function stopAutoplay() {
      window.clearInterval(autoplay);
    }

    function startAutoplay() {
      stopAutoplay();
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      autoplay = window.setInterval(() => {
        showSlide(activeIndex + 1);
      }, delay);
    }

    carousel.querySelector("[data-carousel-prev]")?.addEventListener("click", () => {
      showSlide(activeIndex - 1);
      startAutoplay();
    });

    carousel.querySelector("[data-carousel-next]")?.addEventListener("click", () => {
      showSlide(activeIndex + 1);
      startAutoplay();
    });

    carousel.addEventListener("mouseenter", stopAutoplay);
    carousel.addEventListener("mouseleave", startAutoplay);
    carousel.addEventListener("focusin", stopAutoplay);
    carousel.addEventListener("focusout", startAutoplay);

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopAutoplay();
      else startAutoplay();
    });

    startAutoplay();
  }
});

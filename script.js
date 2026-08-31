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

// script.js
document.addEventListener("DOMContentLoaded", () => {
  // Year
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // ===== Mobile Drawer Menu =====
  const toggle = document.getElementById("navToggle");
  const drawer = document.getElementById("navDrawer");
  const overlay = document.getElementById("navOverlay");
  const closeBtn = document.getElementById("navClose");

  const openMenu = () => {
    if (!drawer || !overlay || !toggle) return;
    overlay.hidden = false;
    drawer.setAttribute("aria-hidden", "false");
    toggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  };

  const closeMenu = () => {
    if (!drawer || !overlay || !toggle) return;
    overlay.hidden = true;
    drawer.setAttribute("aria-hidden", "true");
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  if (toggle && drawer && overlay) {
    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      isOpen ? closeMenu() : openMenu();
    });

    overlay.addEventListener("click", closeMenu);
    if (closeBtn) closeBtn.addEventListener("click", closeMenu);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });

    drawer.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
  }

  window.addEventListener("resize", () => {
    // evita glitch quando cambi viewport
    closeMenu();
  });

  // ===== Count-up Stats =====
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fmt = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  const animateCount = (el) => {
    const target = parseInt(el.getAttribute("data-count") || "0", 10);
    const suffix = el.getAttribute("data-suffix") || "";
    if (!target) { el.textContent = "0" + suffix; return; }

    if (reduceMotion) { el.textContent = fmt(target) + suffix; return; }

    const duration = 900;
    const start = performance.now();

    const tick = (t) => {
      const p = Math.min((t - start) / duration, 1);
      const value = Math.floor(target * p);
      el.textContent = fmt(value) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const counters = document.querySelectorAll("[data-count]");
  if (counters.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          animateCount(e.target);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.35 });

    counters.forEach((c) => io.observe(c));
  }
});
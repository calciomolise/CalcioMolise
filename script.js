// script.js
(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Safe focusable selector (for drawer focus trap)
  const FOCUSABLE =
    'a[href], area[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  const lockScroll = () => {
    // evita scroll + “salti” su mobile
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
  };

  const unlockScroll = () => {
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    document.body.style.touchAction = "";
  };

  const setYear = () => {
    const y = $("#year");
    if (y) y.textContent = String(new Date().getFullYear());
  };

  // ===== Mobile Drawer Menu =====
  const initDrawerMenu = () => {
    const toggle = $("#navToggle");
    const drawer = $("#navDrawer");
    const overlay = $("#navOverlay");
    const closeBtn = $("#navClose");

    if (!toggle || !drawer || !overlay) return;

    let isOpen = false;
    let lastFocused = null;

    const getFocusableInDrawer = () => $$(FOCUSABLE, drawer).filter((el) => el.offsetParent !== null);

    const openMenu = () => {
      if (isOpen) return;
      isOpen = true;

      lastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;

      overlay.hidden = false;
      drawer.setAttribute("aria-hidden", "false");
      toggle.setAttribute("aria-expanded", "true");

      lockScroll();

      // focus sul primo elemento utile nel drawer
      const focusables = getFocusableInDrawer();
      (focusables[0] || drawer).focus?.();
    };

    const closeMenu = () => {
      if (!isOpen) return;
      isOpen = false;

      overlay.hidden = true;
      drawer.setAttribute("aria-hidden", "true");
      toggle.setAttribute("aria-expanded", "false");

      unlockScroll();

      // ripristina focus per accessibilità
      if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
      lastFocused = null;
    };

    const toggleMenu = () => (isOpen ? closeMenu() : openMenu());

    // Click
    toggle.addEventListener("click", toggleMenu, { passive: true });
    overlay.addEventListener("click", closeMenu, { passive: true });
    if (closeBtn) closeBtn.addEventListener("click", closeMenu, { passive: true });

    // Chiudi quando clicchi un link nel drawer
    $$(".nav__link, a", drawer).forEach((a) => {
      a.addEventListener("click", closeMenu, { passive: true });
    });

    // Keyboard: ESC + focus trap
    document.addEventListener("keydown", (e) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        closeMenu();
        return;
      }

      if (e.key === "Tab") {
        const focusables = getFocusableInDrawer();
        if (!focusables.length) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        // trap
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    // Resize: chiudi per evitare stati “sporchi” tra breakpoints
    window.addEventListener(
      "resize",
      () => {
        if (isOpen) closeMenu();
      },
      { passive: true }
    );
  };

  // ===== Count-up Stats =====
  const initCounters = () => {
    const counters = $$("[data-count]");
    if (!counters.length) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const formatIt = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    const animateCount = (el) => {
      const raw = el.getAttribute("data-count");
      const target = Number.parseInt(raw || "0", 10);
      const suffix = el.getAttribute("data-suffix") || "";

      if (!Number.isFinite(target) || target <= 0) {
        el.textContent = "0" + suffix;
        return;
      }

      if (reduceMotion) {
        el.textContent = formatIt(target) + suffix;
        return;
      }

      const duration = 900;
      const start = performance.now();

      const tick = (t) => {
        const p = Math.min((t - start) / duration, 1);
        const value = Math.floor(target * p);
        el.textContent = formatIt(value) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    };

    // Fallback se IntersectionObserver non c’è
    if (!("IntersectionObserver" in window)) {
      counters.forEach(animateCount);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );

    counters.forEach((c) => io.observe(c));
  };

  document.addEventListener("DOMContentLoaded", () => {
    setYear();
    initDrawerMenu();
    initCounters();
  });
})();
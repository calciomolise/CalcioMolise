document.addEventListener("DOMContentLoaded", () => {
  // Year
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // ===== Mobile Drawer Menu (robusto + focus) =====
  const toggle = document.getElementById("navToggle");
  const drawer = document.getElementById("navDrawer");
  const overlay = document.getElementById("navOverlay");
  const closeBtn = document.getElementById("navClose");

  let lastFocus = null;

  const openMenu = () => {
    if (!drawer || !overlay || !toggle) return;
    lastFocus = document.activeElement;

    overlay.hidden = false;
    drawer.setAttribute("aria-hidden", "false");
    toggle.setAttribute("aria-expanded", "true");

    document.body.style.overflow = "hidden";

    // focus close
    if (closeBtn) closeBtn.focus();
  };

  const closeMenu = () => {
    if (!drawer || !overlay || !toggle) return;

    overlay.hidden = true;
    drawer.setAttribute("aria-hidden", "true");
    toggle.setAttribute("aria-expanded", "false");

    document.body.style.overflow = "";

    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    }
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

    drawer.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", closeMenu);
  }

  // ===== Count-up Stats =====
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const fmt = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  const animateCount = (el) => {
    const target = parseInt(el.getAttribute("data-count") || "0", 10);
    const suffix = el.getAttribute("data-suffix") || "";

    if (!target) {
      el.textContent = "0" + suffix;
      return;
    }

    if (reduceMotion) {
      el.textContent = fmt(target) + suffix;
      return;
    }

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
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animateCount(e.target);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.35 }
    );

    counters.forEach((c) => io.observe(c));
  }

  // ===== Contatti: template messaggio + preselect pkg =====
  const levelSelect = document.getElementById("levelSelect");
  const msgBox = document.getElementById("msgBox");
  const copyMsgBtn = document.getElementById("copyMsgBtn");
  const openEmailBtn = document.getElementById("openEmailBtn");

  const getPkgFromQuery = () => {
    try {
      const url = new URL(window.location.href);
      return (url.searchParams.get("pkg") || "").trim();
    } catch {
      return "";
    }
  };

  const buildMessage = (level) => {
    const lvl = level ? `Livello desiderato: ${level}\n` : "";
    return (
      "Ciao Calcio Molise,\n" +
      "sono [Nome - Azienda].\n" +
      "Settore: [settore]\n" +
      "Obiettivo: [visibilità / brand / altro]\n" +
      lvl +
      "\n" +
      "Potete inviarmi una proposta di collaborazione?"
    );
  };

  const buildEmailSubject = (level) => {
    const base = "Richiesta informazioni - Calcio Molise";
    return level ? `${base} (${level})` : base;
  };

  const refreshTemplate = () => {
    const level = levelSelect ? levelSelect.value : "";
    const msg = buildMessage(level);

    if (msgBox) msgBox.value = msg;

    if (openEmailBtn) {
      const subject = encodeURIComponent(buildEmailSubject(level));
      const body = encodeURIComponent(msg);
      openEmailBtn.href = `mailto:calciomolise1@gmail.com?subject=${subject}&body=${body}`;
    }
  };

  const copyToClipboard = async (text) => {
    // 1) moderno
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {}

    // 2) fallback compatibile (iOS/IG browser)
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "-9999px";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, ta.value.length);
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  };

  // init contatti
  if (levelSelect || msgBox) {
    const qPkg = getPkgFromQuery();
    if (levelSelect && qPkg) {
      const options = Array.from(levelSelect.options).map(o => o.value.toLowerCase());
      const idx = options.indexOf(qPkg.toLowerCase());
      if (idx >= 0) levelSelect.selectedIndex = idx;
    }

    refreshTemplate();

    if (levelSelect) levelSelect.addEventListener("change", refreshTemplate);

    if (copyMsgBtn) {
      copyMsgBtn.addEventListener("click", async () => {
        const ok = await copyToClipboard(msgBox ? msgBox.value : "");
        copyMsgBtn.textContent = ok ? "Copiato" : "Copia non riuscita";
        setTimeout(() => (copyMsgBtn.textContent = "Copia messaggio"), 1200);
      });
    }

    document.querySelectorAll("[data-copy]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const ok = await copyToClipboard(msgBox ? msgBox.value : "");
        btn.textContent = ok ? "Copiato" : "Copia non riuscita";
        setTimeout(() => (btn.textContent = "Copia testo email"), 1200);
      });
    });
  }
});
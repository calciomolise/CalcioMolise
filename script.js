(() => {
  const qs = (s, el = document) => el.querySelector(s);
  const qsa = (s, el = document) => Array.from(el.querySelectorAll(s));

  const EMAIL = "calciomolise1@gmail.com";
  const IG_DM = "https://ig.me/m/calciomolise_official";

  // Year
  document.addEventListener("DOMContentLoaded", () => {
    const y = qs("#year");
    if (y) y.textContent = new Date().getFullYear();
  });

  // Active nav by pathname (multi-page)
  const markActiveNav = () => {
    const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    qsa("[data-nav]").forEach(a => {
      const href = (a.getAttribute("href") || "").toLowerCase();
      if (!href) return;
      const is = href.endsWith(path);
      a.classList.toggle("is-active", is);
    });
  };
  markActiveNav();

  // Scroll progress + toTop
  const progress = qs("#progress");
  const toTop = qs("#toTop");

  const onScroll = () => {
    const doc = document.documentElement;
    const scrolled = doc.scrollTop || document.body.scrollTop;
    const height = doc.scrollHeight - doc.clientHeight;
    const p = height > 0 ? (scrolled / height) * 100 : 0;
    if (progress) progress.style.width = `${p}%`;

    if (toTop) {
      if (scrolled > 600) toTop.classList.add("is-visible");
      else toTop.classList.remove("is-visible");
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  // Drawer
  const navToggle = qs("#navToggle");
  const drawer = qs("#drawer");
  const overlay = qs("#drawerOverlay");
  const drawerClose = qs("#drawerClose");

  const openDrawer = () => {
    if (!drawer || !overlay || !navToggle) return;
    drawer.classList.add("is-open");
    overlay.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeDrawer = () => {
    if (!drawer || !overlay || !navToggle) return;
    drawer.classList.remove("is-open");
    overlay.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  if (navToggle) navToggle.addEventListener("click", () => {
    const isOpen = drawer?.classList.contains("is-open");
    isOpen ? closeDrawer() : openDrawer();
  });

  if (overlay) overlay.addEventListener("click", closeDrawer);
  if (drawerClose) drawerClose.addEventListener("click", closeDrawer);

  // Reveal on scroll
  const revealEls = qsa(".reveal");
  if (revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  }

  // Counters
  const fmt = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const counters = qsa("[data-count]");
  if (counters.length) {
    const animate = (el) => {
      const target = parseInt(el.getAttribute("data-count"), 10) || 0;
      const suffix = el.getAttribute("data-suffix") || "";
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

    const cIo = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animate(e.target);
          cIo.unobserve(e.target);
        }
      });
    }, { threshold: 0.35 });

    counters.forEach(c => cIo.observe(c));
  }

  // Accordion
  qsa(".acc").forEach(btn => {
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", open ? "false" : "true");
      const icon = qs(".acc__icon", btn);
      if (icon) icon.textContent = open ? "+" : "–";
    });
  });

  // Toast
  const toast = qs("#toast");
  let toastTimer = null;
  const showToast = (msg) => {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("is-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-show"), 1600);
  };

  // Print
  qsa("[data-print]").forEach(b => b.addEventListener("click", () => window.print()));

  // Email template
  const buildEmail = ({ pack = "Plus" } = {}) => {
    const subject = `Richiesta sponsor — Pacchetto ${pack}`;
    const body = [
      "Buongiorno,",
      "",
      `Sono interessato a una collaborazione con Calcio Molise (pacchetto: ${pack}).`,
      "",
      "Dettagli:",
      "- Attività/brand: [inserire]",
      "- Obiettivo: [inserire]",
      "- Durata desiderata: [inserire]",
      "- Canali preferiti: [Instagram / Telegram / entrambi]",
      "",
      "Richiedo una proposta con calendario output, placement e report.",
      "",
      "Grazie,",
      "[Nome e recapito]"
    ].join("\n");

    const mailto = `mailto:${encodeURIComponent(EMAIL)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    return { subject, body, mailto };
  };

  // Generic email links
  const applyEmailLinks = (pack = "Plus") => {
    const { mailto } = buildEmail({ pack });
    qsa("[data-email-link]").forEach(a => a.setAttribute("href", mailto));
  };
  applyEmailLinks("Plus");

  // Copy email (contatti page button)
  qsa("[data-copy-email]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const { body } = buildEmail({ pack: "Plus" });
      try {
        await navigator.clipboard.writeText(body);
        showToast("Testo email copiato.");
      } catch {
        showToast("Copia non riuscita (browser).");
      }
    });
  });

  // Brief builder (contatti)
  const briefFields = qsa("[data-brief]");
  const copyBrief = qs("#copyBrief");
  if (copyBrief && briefFields.length) {
    copyBrief.addEventListener("click", async () => {
      const data = {};
      briefFields.forEach(i => data[i.getAttribute("data-brief")] = (i.value || "").trim());
      const txt = [
        "BRIEF RAPIDO",
        `- Brand/attività: ${data.brand || "[inserire]"}`,
        `- Obiettivo: ${data.goal || "[inserire]"}`,
        `- Durata: ${data.duration || "[inserire]"}`,
        `- Canali: ${data.channels || "[inserire]"}`,
      ].join("\n");
      try {
        await navigator.clipboard.writeText(txt);
        showToast("Brief copiato.");
      } catch {
        showToast("Copia non riuscita (browser).");
      }
    });
  }

  // Modal system (only if modal exists in page)
  const modalOverlay = qs("#modalOverlay");
  const modalProposal = qs("#modalProposal");

  const closeModal = () => {
    if (!modalOverlay || !modalProposal) return;
    modalOverlay.classList.remove("is-open");
    modalOverlay.setAttribute("aria-hidden", "true");
    modalProposal.classList.remove("is-open");
    document.body.style.overflow = "";
  };

  const openModal = () => {
    if (!modalOverlay || !modalProposal) return;
    modalOverlay.classList.add("is-open");
    modalOverlay.setAttribute("aria-hidden", "false");
    modalProposal.classList.add("is-open");
    document.body.style.overflow = "hidden";
  };

  if (modalOverlay && modalProposal) {
    modalOverlay.addEventListener("click", closeModal);
    qsa("[data-close-modal]").forEach(b => b.addEventListener("click", closeModal));
    window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
  }

  // Proposal templates
  const proposalText = qs("#proposalText");
  const chip = qs("#selectedPackageChip");
  const copyProposal = qs("#copyProposal");
  const openEmail = qs("#openEmail");
  const openDm = qs("#openDm");

  const templates = {
    "Essential": [
      "Buongiorno,",
      "",
      "Sono interessato a una collaborazione con Calcio Molise.",
      "Pacchetto: ESSENTIAL.",
      "",
      "Richiedo una proposta con:",
      "- calendario output (formato core)",
      "- placement logo + menzione caption",
      "- durata consigliata per test",
      "- report mensile.",
      "",
      "Brand/attività: [inserire]",
      "Obiettivo: [inserire]",
      "Durata: [inserire]",
      "",
      "Grazie,",
      "[Nome]"
    ].join("\n"),
    "Plus": [
      "Buongiorno,",
      "",
      "Sono interessato a una collaborazione con Calcio Molise.",
      "Pacchetto: PLUS.",
      "",
      "Richiedo una proposta con:",
      "- presenza su più formati core",
      "- menzione fissa in caption",
      "- slot stories programmati",
      "- report mensile completo.",
      "",
      "Brand/attività: [inserire]",
      "Obiettivo: [inserire]",
      "Durata: [inserire]",
      "",
      "Grazie,",
      "[Nome]"
    ].join("\n"),
    "Premium": [
      "Buongiorno,",
      "",
      "Sono interessato a una collaborazione con Calcio Molise.",
      "Pacchetto: PREMIUM.",
      "",
      "Richiedo una proposta con:",
      "- logo su tutti i formati core (sobrio e coerente)",
      "- stories con slot regolari",
      "- slot Telegram dedicati",
      "- report + riepilogo output.",
      "",
      "Brand/attività: [inserire]",
      "Obiettivo: [inserire]",
      "Durata: [inserire]",
      "",
      "Grazie,",
      "[Nome]"
    ].join("\n"),
    "Telegram Focus": [
      "Buongiorno,",
      "",
      "Sono interessato a una collaborazione con Calcio Molise.",
      "Pacchetto: TELEGRAM FOCUS.",
      "",
      "Richiedo una proposta con:",
      "- slot programmati su Telegram (menzione + link)",
      "- frequenza e durata",
      "- report dove disponibile.",
      "",
      "Brand/attività: [inserire]",
      "Obiettivo: [inserire]",
      "Durata: [inserire]",
      "",
      "Grazie,",
      "[Nome]"
    ].join("\n"),
    "Evento": [
      "Buongiorno,",
      "",
      "Sono interessato a una collaborazione con Calcio Molise.",
      "Pacchetto: EVENTO.",
      "",
      "Richiedo una proposta con:",
      "- branding su contenuti evento",
      "- stories dedicate",
      "- post riepilogo",
      "- report a fine evento.",
      "",
      "Evento/periodo: [inserire]",
      "Brand/attività: [inserire]",
      "Obiettivo: [inserire]",
      "",
      "Grazie,",
      "[Nome]"
    ].join("\n")
  };

  let currentPackage = "Plus";

  const setPackage = (pack) => {
    currentPackage = templates[pack] ? pack : "Plus";

    qsa("[data-package-tab]").forEach(t => {
      const is = t.getAttribute("data-package-tab") === currentPackage;
      t.classList.toggle("is-active", is);
      t.setAttribute("aria-selected", is ? "true" : "false");
    });

    if (chip) chip.textContent = currentPackage;
    if (proposalText) proposalText.value = templates[currentPackage] || templates["Plus"];

    // DM
    if (openDm) openDm.setAttribute("href", IG_DM);

    // Email
    const email = buildEmail({ pack: currentPackage });
    if (openEmail) openEmail.setAttribute("href", email.mailto);

    // global email links
    applyEmailLinks(currentPackage);
  };

  // Open modal triggers
  qsa("[data-open-modal='proposal']").forEach(el => {
    el.addEventListener("click", () => {
      const pack = el.getAttribute("data-package") || "Plus";
      setPackage(pack);
      openModal();
    });
  });

  // Tabs in modal
  qsa("[data-package-tab]").forEach(tab => {
    tab.addEventListener("click", () => setPackage(tab.getAttribute("data-package-tab")));
  });

  // Copy proposal
  if (copyProposal) {
    copyProposal.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(proposalText?.value || "");
        showToast("Messaggio copiato.");
      } catch {
        showToast("Copia non riuscita (browser).");
      }
    });
  }

  // Default package if modal exists
  if (modalProposal) setPackage("Plus");
})();
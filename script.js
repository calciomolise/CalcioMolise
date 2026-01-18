/* =========================================================
   Calcio Molise — JS (nav, reveal, counters, contatti)
   ========================================================= */

(function () {
  "use strict";

  const qs = (s, root = document) => root.querySelector(s);
  const qsa = (s, root = document) => Array.from(root.querySelectorAll(s));

  // Year
  document.addEventListener("DOMContentLoaded", () => {
    const y = qs("#year");
    if (y) y.textContent = new Date().getFullYear();

    // Mobile nav
    const toggle = qs("#navToggle");
    const menu = qs("#navMenu");
    if (toggle && menu) {
      toggle.addEventListener("click", () => {
        const open = menu.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });

      qsa("a", menu).forEach(a => {
        a.addEventListener("click", () => {
          menu.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
        });
      });
    }

    // Reveal on scroll
    const revealEls = qsa(".reveal");
    if (revealEls.length) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.12 });
      revealEls.forEach(el => io.observe(el));
    }

    // Counters
    const counters = qsa("[data-count]");
    if (counters.length) {
      const fmt = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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

      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            animate(e.target);
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.30 });

      counters.forEach(c => io.observe(c));
    }

    // Contatti page logic
    initContatti();
  });

  function initContatti() {
    const msg = qs("#msg");
    const copyBtn = qs("#copyBtn");
    const emailBtn = qs("#emailBtn");
    const segs = qsa(".seg");

    // If not on contatti page, exit
    if (!msg || !emailBtn || !copyBtn || !segs.length) return;

    const EMAIL = "calciomolise1@gmail.com";
    const BRAND = "Calcio Molise";
    const IG_PROFILE = "https://www.instagram.com/calciomolise_official/";

    // Package presets
    const presets = {
      base: {
        label: "Base",
        subject: "Richiesta informazioni - Sponsor Base (Calcio Molise)",
        body:
          "Buongiorno,\n" +
          "sono interessato a una collaborazione con Calcio Molise (livello Base).\n\n" +
          "Settore azienda: \n" +
          "Obiettivo: \n" +
          "Periodo desiderato: \n" +
          "Budget indicativo (facoltativo): \n\n" +
          "Potete inviarmi una proposta con calendario output e modalità di integrazione del brand?\n" +
          "Grazie."
      },
      plus: {
        label: "Plus",
        subject: "Richiesta informazioni - Sponsor Plus (Calcio Molise)",
        body:
          "Buongiorno,\n" +
          "sono interessato a una collaborazione con Calcio Molise (livello Plus).\n\n" +
          "Settore azienda: \n" +
          "Obiettivo: \n" +
          "Periodo desiderato: \n" +
          "Budget indicativo (facoltativo): \n\n" +
          "Potete inviarmi una proposta con calendario output e distribuzione multi-canale?\n" +
          "Grazie."
      },
      premium: {
        label: "Premium",
        subject: "Richiesta informazioni - Sponsor Premium (Calcio Molise)",
        body:
          "Buongiorno,\n" +
          "sono interessato a una partnership con Calcio Molise (livello Premium).\n\n" +
          "Settore azienda: \n" +
          "Obiettivo: \n" +
          "Periodo desiderato: \n" +
          "Budget indicativo (facoltativo): \n\n" +
          "Potete inviarmi una proposta con piano completo, frequenze e reportistica?\n" +
          "Grazie."
      }
    };

    // Read query param ?pkg=
    const url = new URL(window.location.href);
    const pkgFromUrl = (url.searchParams.get("pkg") || "").toLowerCase();

    // Default package
    let current = presets[pkgFromUrl] ? pkgFromUrl : "plus";

    function setPressed(pkg) {
      segs.forEach(b => {
        const is = b.dataset.pkg === pkg;
        b.setAttribute("aria-pressed", is ? "true" : "false");
      });
    }

    function buildMailto(subject, body) {
      const s = encodeURIComponent(subject);
      const b = encodeURIComponent(body);
      return `mailto:${EMAIL}?subject=${s}&body=${b}`;
    }

    function updateUI() {
      const preset = presets[current];
      setPressed(current);

      // Message box content
      msg.value =
        `Ciao ${BRAND},\n` +
        `sono interessato a una collaborazione (livello ${preset.label}).\n\n` +
        `Settore azienda: \n` +
        `Obiettivo: \n` +
        `Periodo desiderato: \n` +
        `Budget indicativo (facoltativo): \n\n` +
        `Potete inviarmi una proposta con calendario output e modalità di integrazione del brand?`;

      // Email link uses full preset
      emailBtn.href = buildMailto(preset.subject, preset.body);

      // Keep IG button always reliable (profile). Prefill DM not guaranteed.
      const igBtn = qs("#igBtn");
      if (igBtn) igBtn.href = IG_PROFILE;
    }

    // Button events
    segs.forEach(b => {
      b.addEventListener("click", () => {
        const pkg = (b.dataset.pkg || "").toLowerCase();
        if (presets[pkg]) {
          current = pkg;
          // Update URL for shareability
          const u = new URL(window.location.href);
          u.searchParams.set("pkg", pkg);
          window.history.replaceState({}, "", u);
          updateUI();
        }
      });
    });

    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(msg.value);
        copyBtn.textContent = "Copiato";
        setTimeout(() => (copyBtn.textContent = "Copia testo"), 900);
      } catch {
        // Fallback
        msg.select();
        document.execCommand("copy");
        copyBtn.textContent = "Copiato";
        setTimeout(() => (copyBtn.textContent = "Copia testo"), 900);
      }
    });

    // Initialize
    updateUI();
  }
})();

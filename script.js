document.addEventListener("DOMContentLoaded", () => {
  // Year
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // Mobile menu
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");

  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Chiudi menu" : "Apri menu");
    });

    menu.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Apri menu");
      });
    });

    document.addEventListener("click", (e) => {
      const isOpen = menu.classList.contains("is-open");
      if (!isOpen) return;
      const target = e.target;
      if (target instanceof Node && !menu.contains(target) && !toggle.contains(target)) {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Apri menu");
      }
    });
  }

  // Accordion (single open)
  const accButtons = Array.from(document.querySelectorAll(".acc"));
  accButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const isOpen = btn.getAttribute("aria-expanded") === "true";

      accButtons.forEach(other => {
        other.setAttribute("aria-expanded", "false");
        const otherIcon = other.querySelector(".acc__icon");
        if (otherIcon) otherIcon.textContent = "+";
      });

      btn.setAttribute("aria-expanded", isOpen ? "false" : "true");
      const icon = btn.querySelector(".acc__icon");
      if (icon) icon.textContent = isOpen ? "+" : "–";
    });
  });

  // Count up stats
  const counters = document.querySelectorAll("[data-count]");
  const fmt = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  const animate = (el) => {
    const raw = el.getAttribute("data-count") || "0";
    const target = parseInt(raw, 10) || 0;
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

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animate(e.target);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });

    counters.forEach(c => io.observe(c));
  } else {
    counters.forEach(animate);
  }

  // Print button (if exists)
  const printBtn = document.getElementById("printBtn");
  if (printBtn) printBtn.addEventListener("click", () => window.print());
});
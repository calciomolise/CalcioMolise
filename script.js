document.addEventListener("DOMContentLoaded", () => {
  // anno footer
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // contatori
  const counters = document.querySelectorAll("[data-count]");
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const animate = (el) => {
    const target = parseInt(el.getAttribute("data-count"), 10) || 0;
    const suffix = el.getAttribute("data-suffix") || "";

    // se riduzione movimenti attiva, mostra subito
    if (prefersReduced) {
      el.textContent = target.toLocaleString("it-IT") + suffix;
      return;
    }

    let current = 0;
    const steps = 60;
    const step = Math.max(1, Math.ceil(target / steps));

    const tick = () => {
      current += step;

      if (current >= target) {
        el.textContent = target.toLocaleString("it-IT") + suffix;
      } else {
        el.textContent = current.toLocaleString("it-IT") + suffix;
        requestAnimationFrame(tick);
      }
    };

    tick();
  };

  // anima solo quando entrano in vista
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((c) => observer.observe(c));
});
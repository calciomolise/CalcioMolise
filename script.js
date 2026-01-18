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

// ===== Richiedi informazioni: precompila Email in base al pacchetto =====
const pkg = document.getElementById("pkg");
const mailLink = document.getElementById("mailLink");
const dmLink = document.getElementById("dmLink");

const buildEmail = (level) => {
  const subject =
    "Richiesta informazioni - Calcio Molise" +
    (level ? " (" + level + ")" : "");

  const bodyLines = [
    "Ciao Calcio Molise,",
    "",
    "Sono [Nome - Azienda].",
    "Settore: [settore]",
    "Obiettivo: [visibilità / brand / altro]",
    level ? "Livello desiderato: " + level : "",
    "",
    "Potete inviarmi una proposta di collaborazione?",
    "",
    "Grazie,",
    "[Firma]"
  ];

  const body = bodyLines.filter(Boolean).join("\n");

  return (
    "mailto:calciomolise1@gmail.com" +
    "?subject=" + encodeURIComponent(subject) +
    "&body=" + encodeURIComponent(body)
  );
};

const updateLinks = () => {
  const level = pkg ? pkg.value : "";

  if (mailLink) {
    mailLink.href = buildEmail(level);
  }

  // DM Instagram: link diretto (no testo precompilato, più affidabile)
  if (dmLink) {
    dmLink.href = "https://ig.me/m/calciomolise_official";
  }
};

if (pkg) {
  pkg.addEventListener("change", updateLinks);
  updateLinks();
}
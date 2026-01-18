document.addEventListener("DOMContentLoaded", () => {
  // anno footer
  document.getElementById("year").textContent = new Date().getFullYear();

  // contatori
  const counters = document.querySelectorAll("[data-count]");

  const animate = (el) => {
    const target = +el.dataset.count;
    let current = 0;
    const step = Math.ceil(target / 60);

    const tick = () => {
      current += step;
      if(current >= target){
        el.textContent = target.toLocaleString();
      } else {
        el.textContent = current.toLocaleString();
        requestAnimationFrame(tick);
      }
    };
    tick();
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:0.6});

  counters.forEach(c => observer.observe(c));
});

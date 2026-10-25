// Los elementos con .reveal entran con fundido + subida corta cuando aparecen en pantalla.
(() => {
  const io = new IntersectionObserver(
    (entradas) => entradas.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
})();

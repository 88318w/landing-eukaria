// Menú: marca en bold la página (o la sección de la landing) donde estás, le da fondo a la barra al bajar
// y maneja el menú a pantalla completa del celular.
(() => {
  const nombreDe = (ruta) => ruta.split("/").pop() || "index.html";
  const pagina = nombreDe(location.pathname);
  const enlaces = [...document.querySelectorAll(".nav ul a")];

  // elementos de esta misma página a los que apunta cada enlace del menú
  // (en la landing: Home = hero + presentación, Our work = #work; en las otras páginas queda el estado fijo del HTML)
  const destinos = (a) => {
    const u = new URL(a.href);
    if (nombreDe(u.pathname) !== pagina) return [];
    if (u.hash) return [document.querySelector(u.hash)].filter(Boolean);
    return pagina === "index.html" ? ["inicio", "intro"].map((id) => document.getElementById(id)).filter(Boolean) : [];
  };
  const pares = enlaces.flatMap((a) => destinos(a).map((el) => ({ a, el })));

  const activar = (a) =>
    enlaces.forEach((l) => {
      const on = l === a;
      l.classList.toggle("activo", on);
      on ? l.setAttribute("aria-current", "page") : l.removeAttribute("aria-current");
    });

  // la sección que cruza la línea del medio de la pantalla es la activa
  if (pares.length) {
    const io = new IntersectionObserver(
      (entradas) => entradas.forEach((e) => e.isIntersecting && activar(pares.find((p) => p.el === e.target).a)),
      { rootMargin: "-50% 0px -50% 0px" }
    );
    pares.forEach((p) => io.observe(p.el));
  }

  // la barra gana su fondo (degradé sólido) apenas se baja un poco; el centinela #tope mide 40px arriba de todo
  const barra = document.querySelector(".nav");
  const tope = document.getElementById("tope");
  if (tope) new IntersectionObserver(([e]) => barra.classList.toggle("con-fondo", !e.isIntersecting)).observe(tope);

  // menú móvil a pantalla completa (mismo esquema que el portfolio): body.menu-open lo abre
  const boton = barra.querySelector(".menu-btn");
  const t = window.t || ((k) => k);
  const etiquetaMenu = () => boton.setAttribute("aria-label", t(document.body.classList.contains("menu-open") ? "menu.cerrar" : "menu.abrir"));
  etiquetaMenu();
  addEventListener("idioma:cambio", etiquetaMenu);
  const setMenu = (abrir) => {
    document.body.classList.toggle("menu-open", abrir);
    boton.setAttribute("aria-expanded", String(abrir));
    etiquetaMenu();
  };
  boton.addEventListener("click", () => setMenu(!document.body.classList.contains("menu-open")));
  barra.addEventListener("click", (e) => e.target.closest("ul a") && setMenu(false)); // elegir un enlace cierra el menú
  addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.body.classList.contains("menu-open")) { setMenu(false); boton.focus(); }
  });
  // si se agranda la ventana a escritorio con el menú abierto, se cierra
  matchMedia("(max-width: 899px)").addEventListener("change", (e) => !e.matches && setMenu(false));
  // iOS Safari solo aplica :active si la página escucha touchstart (feedback al presionar botones)
  document.addEventListener("touchstart", () => {}, { passive: true });
})();

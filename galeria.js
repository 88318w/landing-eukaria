// Trabajo: carrusel infinito de portadas + página del proyecto al hacer clic.
// Cada proyecto abre SU propia galería: una composición de imágenes (anchas, verticales, cuadradas) que se recorre con scroll.
//
// Para usar imágenes reales: en index.html reemplazá el <span class="ph"> de la portada por un <img>
// y agregá data-galeria="ruta1.jpg, ruta2.jpg, ..." al botón .cover. Las imágenes ocupan los lugares del
// diseño del proyecto en orden (si hay de más, se agregan al final como imágenes anchas).
// Sin data-galeria se muestran placeholders con los colores del proyecto.
// El encabezado del proyecto sale de data-titulo, data-servicio (qué hicimos) y data-bajada (descripción corta).
(() => {
  const pista = document.querySelector(".pista");
  const dlg = document.getElementById("galeria");
  if (!dlg) return; // el carrusel (.pista) existe solo en la landing; la galería sirve para cualquier botón con data-abrir

  const t = window.t || ((k) => k); // textos traducidos (i18n.js)
  const contenido = dlg.querySelector(".g-contenido");
  const menosMovimiento = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- bucle infinito: se duplican las portadas y la pista corre la mitad de su ancho ----
  const originales = pista ? [...pista.children] : [];
  if (pista) {
    originales.forEach((li, i) => (li.dataset.i = i));
    originales.forEach((li) => {
      const clon = li.cloneNode(true);
      clon.classList.add("clon");
      clon.setAttribute("aria-hidden", "true");
      clon.querySelector("button").tabIndex = -1;
      pista.appendChild(clon);
    });
    pista.classList.add("corre");
  }

  // ---- el carrusel NUNCA se frena, y se puede agarrar:
  //      - con el mouse encima (o el foco de teclado) baja de velocidad con una curva suave
  //      - manteniendo el clic y arrastrando lo movés para donde quieras (derecha o izquierda); al soltarlo
  //        sigue de largo con el envión y vuelve suave a su marcha, y ahí sigue corriendo para el lado de siempre ----
  const VELOCIDAD_LENTA = 0.2; // 1 = normal; con el mouse encima corre al 20 %
  const SUAVIDAD = 2.5; // qué tan rápido se acerca a su velocidad meta (más alto = más rápido)
  const anim = pista && pista.getAnimations()[0];
  if (anim && !menosMovimiento()) {
    const dur = anim.effect.getComputedTiming().duration; // ms que tarda un ciclo
    const marquee = pista.parentElement;
    const largo = () => pista.scrollWidth / 2; // px que recorre un ciclo
    let meta = 1, ultimo = 0, corriendo = false, arrastrando = false, hayClicPendiente = false;

    // se deja el tiempo dentro de [dur, 2*dur): visualmente es lo mismo (el ciclo se repite) y queda margen para ir hacia atrás
    const normalizar = () => (anim.currentTime = ((((anim.currentTime % dur) + dur) % dur) + dur));
    const paso = (ts) => {
      const dt = Math.min((ts - ultimo) / 1000, 0.064);
      ultimo = ts;
      if (!arrastrando) {
        anim.playbackRate += (meta - anim.playbackRate) * (1 - Math.exp(-dt * SUAVIDAD));
        normalizar();
        if (Math.abs(meta - anim.playbackRate) < 0.003) { anim.playbackRate = meta; corriendo = false; return; }
      }
      requestAnimationFrame(paso);
    };
    const ir = (v) => {
      meta = v;
      if (corriendo) return;
      corriendo = true;
      ultimo = performance.now();
      requestAnimationFrame(paso);
    };
    const metaNormal = () => (marquee.matches(":hover") ? VELOCIDAD_LENTA : 1);

    marquee.addEventListener("pointerenter", (e) => e.pointerType === "mouse" && !arrastrando && ir(VELOCIDAD_LENTA));
    marquee.addEventListener("pointerleave", () => !arrastrando && ir(1));
    pista.addEventListener("focusin", (e) => e.target.matches(":focus-visible") && ir(VELOCIDAD_LENTA));
    pista.addEventListener("focusout", () => ir(1));

    // ---- arrastrar ----
    let id = null, inicioX = 0, ultimoX = 0, muestras = [];
    const agregar = (x) => {
      const t = performance.now();
      muestras.push({ x, t });
      while (muestras.length > 2 && t - muestras[0].t > 100) muestras.shift();
    };
    const velocidad = () => { // px/s sobre los últimos ~100 ms (derecha positivo)
      const a = muestras[0], b = muestras[muestras.length - 1];
      if (muestras.length < 2 || performance.now() - b.t > 80) return 0;
      const dt = (b.t - a.t) / 1000;
      return dt > 0 ? Math.max(-4000, Math.min(4000, (b.x - a.x) / dt)) : 0;
    };

    marquee.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      id = e.pointerId;
      inicioX = ultimoX = e.clientX;
      muestras = [];
      agregar(e.clientX);
      hayClicPendiente = false;
    });
    marquee.addEventListener("pointermove", (e) => {
      if (id !== e.pointerId) return;
      if (!arrastrando) {
        if (Math.abs(e.clientX - inicioX) < 6) return; // todavía es un clic
        arrastrando = true;
        hayClicPendiente = true; // el clic que sigue a este arrastre no debe abrir un proyecto
        marquee.setPointerCapture(id);
        marquee.classList.add("agarrando");
        anim.playbackRate = 0;
        normalizar();
        ultimoX = e.clientX;
      }
      anim.currentTime -= ((e.clientX - ultimoX) / largo()) * dur; // arrastrar a la derecha = el contenido va a la derecha
      normalizar();
      ultimoX = e.clientX;
      agregar(e.clientX);
    });
    const soltar = () => {
      if (id === null) return;
      id = null;
      if (!arrastrando) return;
      arrastrando = false;
      marquee.classList.remove("agarrando");
      // el envión: el contenido seguía a v px/s hacia la derecha, o sea que el ciclo avanza hacia atrás a esa velocidad
      anim.playbackRate = Math.max(-30, Math.min(30, (-velocidad() * (dur / 1000)) / largo()));
      ir(metaNormal());
    };
    marquee.addEventListener("pointerup", soltar);
    marquee.addEventListener("pointercancel", soltar);
    // si arrastraste, el clic de después no abre ninguna portada
    marquee.addEventListener("click", (e) => { if (hayClicPendiente) { e.preventDefault(); e.stopPropagation(); hayClicPendiente = false; } }, true);
  }

  // ---- diseños de galería: cada fila es una lista de proporciones (ancho / alto) que comparten la misma altura ----
  const W = 16 / 9, P = 473 / 637, S = 1; // ancha, vertical (la de las portadas), cuadrada
  const PLANOS = [
    [[W], [P, P], [W]],
    [[P, W], [W], [S, S, S]],
    [[W], [S, S], [P, P, P]],
    [[P, P, P], [W], [S, W]],
    [[S, S, S], [W], [P, W]],
    [[W], [P, S, P], [W]],
  ];
  // tonos del mismo color del proyecto, para que se note que las imágenes son de ese trabajo
  const TONOS = ["var(--proyecto)", "color-mix(in srgb, var(--proyecto) 62%, white)", "color-mix(in srgb, var(--proyecto) 78%, #11111d)"];

  let origen = null;

  const item = (r, indice, url, total) => {
    const el = document.createElement("div");
    el.className = "g-item reveal";
    el.style.setProperty("--r", r);
    el.style.setProperty("--d", `${(Math.min(indice, 6) + 2) * 60}ms`);
    if (url) {
      const img = document.createElement("img");
      img.src = url;
      img.alt = t("galeria.imagen", { i: indice + 1, n: total });
      img.draggable = false;
      el.appendChild(img);
    } else {
      const ph = document.createElement("div");
      ph.className = "ph";
      ph.setAttribute("role", "img");
      ph.setAttribute("aria-label", t("galeria.imagen", { i: indice + 1, n: total }) + t("galeria.muestra"));
      ph.style.setProperty("--c", TONOS[indice % TONOS.length]);
      el.appendChild(ph);
    }
    return el;
  };

  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.1 });

  // encabezado: título, servicio y bajada del proyecto
  const cabecera = ({ titulo, servicio, bajada }) => {
    const cab = document.createElement("header");
    cab.className = "g-cabecera reveal";
    const el = (tag, clase, texto) => {
      const e = document.createElement(tag);
      if (clase) e.className = clase;
      e.textContent = texto;
      return e;
    };
    if (titulo) {
      const h2 = el("h2", "", titulo);
      h2.id = "g-titulo";
      cab.appendChild(h2);
      dlg.setAttribute("aria-labelledby", "g-titulo");
    }
    const datos = document.createElement("div");
    datos.className = "g-datos";
    if (servicio) {
      const s = document.createElement("div");
      s.append(el("p", "g-etiqueta", t("galeria.servicio")), el("p", "g-servicio", servicio));
      datos.appendChild(s);
    }
    if (bajada) datos.appendChild(el("p", "g-bajada", bajada));
    if (datos.children.length) cab.appendChild(datos);
    return cab;
  };

  const construir = (i, boton) => {
    const urls = (boton.dataset.galeria || "").split(",").map((s) => s.trim()).filter(Boolean);
    const plano = PLANOS[i % PLANOS.length];
    const huecos = plano.flat().length;
    const total = Math.max(huecos, urls.length);
    contenido.replaceChildren();
    contenido.appendChild(cabecera(boton.dataset));
    contenido.style.setProperty("--proyecto", getComputedStyle(boton).getPropertyValue("--c") || "var(--color-indigo-900)");
    let n = 0;
    plano.forEach((fila) => {
      const f = document.createElement("div");
      f.className = "g-fila";
      fila.forEach((r) => f.appendChild(item(r, n, urls[n], total)) && n++);
      contenido.appendChild(f);
    });
    // imágenes de más: filas anchas al final
    for (; n < total; ) {
      const f = document.createElement("div");
      f.className = "g-fila";
      f.appendChild(item(W, n, urls[n], total));
      n++;
      contenido.appendChild(f);
    }
    contenido.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  };

  const abrir = (i, boton) => {
    origen = boton;
    // la galería crece desde el centro de la portada que tocaste
    const r = boton.getBoundingClientRect();
    dlg.style.setProperty("--ox", `${r.left + r.width / 2}px`);
    dlg.style.setProperty("--oy", `${r.top + r.height / 2}px`);
    construir(i, boton);
    dlg.scrollTop = 0;
    dlg.classList.remove("saliendo");
    dlg.showModal();
    document.body.classList.add("galeria-abierta");
    dlg.querySelector(".g-cerrar").focus();
  };
  const cerrar = () => {
    const fin = () => {
      dlg.close();
      document.body.classList.remove("galeria-abierta");
      origen && origen.focus({ preventScroll: true });
    };
    if (menosMovimiento()) return fin();
    dlg.classList.add("saliendo");
    setTimeout(fin, 200);
  };

  if (pista) pista.addEventListener("click", (e) => {
    const b = e.target.closest(".cover");
    if (b) abrir(Number(b.closest("li").dataset.i), b);
  });
  // los trabajos destacados abren la galería del proyecto que indica data-abrir (posición en el carrusel)
  document.querySelectorAll("[data-abrir]").forEach((b) => b.addEventListener("click", () => abrir(Number(b.dataset.abrir), b)));
  dlg.querySelector(".g-cerrar").addEventListener("click", cerrar);
  dlg.addEventListener("cancel", (e) => { e.preventDefault(); cerrar(); }); // Escape
})();

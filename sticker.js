// Etiquetas arrastrables (la de laboratorio y la cinta). La física de gestos está adaptada del portfolio (script.js, seguirYSoltar):
// sigue al dedo 1:1, se inclina hacia donde la llevás, se "levanta" al agarrarla, al soltarla
// sigue de largo con inercia, los bordes ceden como una goma y se puede volver a agarrar en vuelo.
// Un toque corto (sin arrastrar) la hace temblar.
(() => {
  const contenedor = document.querySelector(".hero");
  const etiquetas = [...document.querySelectorAll(".sticker")];
  if (!etiquetas.length || !contenedor) return;

  const menosMovimiento = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  const limitar = (v, a, b) => Math.max(a, Math.min(b, v));

  // Resorte con "respuesta" (segundos) y "amortiguación" (1 = sin rebote), como en Apple
  function resorte({ desde, hasta, velocidad = 0, respuesta = 0.45, amortiguacion = 0.8, alCambiar, alTerminar }) {
    const rigidez = ((2 * Math.PI) / respuesta) ** 2;
    const friccion = (4 * Math.PI * amortiguacion) / respuesta;
    let x = desde, v = velocidad, anterior = null;
    let id = requestAnimationFrame(paso);
    function paso(ts) {
      const dt = anterior === null ? 0 : Math.min((ts - anterior) / 1000, 0.064);
      anterior = ts;
      const pasos = Math.ceil(dt / 0.004);
      for (let i = 0; i < pasos; i++) {
        const h = dt / pasos;
        v += (-rigidez * (x - hasta) - friccion * v) * h;
        x += v * h;
      }
      if (Math.abs(x - hasta) < 0.5 && Math.abs(v) < 20) { alCambiar(hasta); alTerminar(); return; }
      alCambiar(x);
      id = requestAnimationFrame(paso);
    }
    return { parar: () => (cancelAnimationFrame(id), x) };
  }

  // Velocidad del dedo (px/s) sobre los últimos ~100 ms
  let muestras = [];
  const agregar = (x, y) => {
    const t = performance.now();
    muestras.push({ x, y, t });
    while (muestras.length > 2 && t - muestras[0].t > 100) muestras.shift();
  };
  const velocidad = () => {
    const a = muestras[0], b = muestras[muestras.length - 1];
    if (muestras.length < 2 || performance.now() - b.t > 80) return { x: 0, y: 0 };
    const dt = (b.t - a.t) / 1000;
    if (dt <= 0) return { x: 0, y: 0 };
    const tope = (n) => limitar(n, -4000, 4000);
    return { x: tope((b.x - a.x) / dt), y: tope((b.y - a.y) / dt) };
  };
  // hasta dónde llegaría lanzada a esa velocidad (la cuenta del scroll de iOS; 0.99 pesa más)
  const proyectar = (v, d = 0.99) => ((v / 1000) * d) / (1 - d);
  // goma: cuanto más te pasás del borde, menos te sigue
  const goma = (exceso, dim, c = 0.55) => (exceso * dim * c) / (dim + c * Math.abs(exceso));
  const conBorde = (v, min, max, dim) => {
    if (menosMovimiento()) return limitar(v, min, max);
    return v < min ? min - goma(min - v, dim) : v > max ? max + goma(v - max, dim) : v;
  };

  // cada etiqueta lleva su propio estado (posición, inercia, inclinación); los cálculos de arriba se comparten
  const iniciar = (el) => {
  let activo = false, movio = false, inercia = null;
  let inicioX = 0, inicioY = 0, ultimoX = 0, baseLeft = 0, baseTop = 0, tx = 0, ty = 0, inclinacion = 0;

  const limites = () => ({ maxX: contenedor.clientWidth - el.offsetWidth, maxY: contenedor.clientHeight - el.offsetHeight });
  const pintar = () => (el.style.translate = `${tx}px ${ty}px`);
  // al terminar, la posición pasa a left/top en %: sigue siendo proporcional si cambia la pantalla
  const fijar = () => {
    el.style.left = ((baseLeft + tx) / contenedor.clientWidth) * 100 + "%";
    el.style.top = ((baseTop + ty) / contenedor.clientHeight) * 100 + "%";
    tx = ty = 0;
    el.style.translate = "";
  };
  const frenarInercia = () => {
    if (!inercia) return;
    inercia.forEach((r) => r.parar());
    inercia = null;
    fijar();
  };

  el.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    const atrapada = !!inercia;
    frenarInercia(); // la agarraste en pleno vuelo: queda donde está y sigue al dedo
    activo = true;
    movio = atrapada;
    inclinacion = 0;
    inicioX = ultimoX = e.clientX;
    inicioY = e.clientY;
    baseLeft = el.offsetLeft;
    baseTop = el.offsetTop;
    muestras = [];
    agregar(e.clientX, e.clientY);
    el.setPointerCapture(e.pointerId);
    el.classList.add("is-dragging");
  });

  el.addEventListener("pointermove", (e) => {
    if (!activo) return;
    if (Math.abs(e.clientX - inicioX) > 5 || Math.abs(e.clientY - inicioY) > 5) movio = true;
    if (!movio) return;
    agregar(e.clientX, e.clientY);
    // se inclina hacia el lado al que la llevás, suavizado
    inclinacion += (limitar((e.clientX - ultimoX) * 0.5, -6, 6) - inclinacion) * 0.15;
    ultimoX = e.clientX;
    if (!menosMovimiento()) el.style.transform = `rotate(${inclinacion}deg)`;
    const { maxX, maxY } = limites();
    tx = conBorde(baseLeft + e.clientX - inicioX, 0, maxX, contenedor.clientWidth) - baseLeft;
    ty = conBorde(baseTop + e.clientY - inicioY, 0, maxY, contenedor.clientHeight) - baseTop;
    pintar();
  });

  function soltar(cancelado) {
    if (!activo) return;
    activo = false;
    if (cancelado) movio = true;
    el.classList.remove("is-dragging");
    el.style.transform = ""; // vuelve a su inclinación base con el transition del CSS
    if (!movio) return sacudir();

    const { maxX, maxY } = limites();
    const x = baseLeft + tx, y = baseTop + ty;
    if (menosMovimiento()) {
      tx = limitar(x, 0, maxX) - baseLeft;
      ty = limitar(y, 0, maxY) - baseTop;
      return fijar();
    }
    // sigue de largo según la velocidad y se asienta con un rebote chiquito
    const v = velocidad();
    let pendientes = 2;
    const terminar = () => {
      if (--pendientes > 0) return;
      inercia = null;
      fijar();
      // avisa dónde aterrizó: el logo 3D se hunde apenas de ese lado (hero3d.js)
      const r = el.getBoundingClientRect();
      dispatchEvent(new CustomEvent("sticker:aterrizo", { detail: { x: ((r.left + r.width / 2) / innerWidth) * 2 - 1, y: ((r.top + r.height / 2) / innerHeight) * 2 - 1 } }));
    };
    inercia = [
      resorte({ desde: x, hasta: limitar(x + proyectar(v.x), 0, maxX), velocidad: v.x, alCambiar: (p) => { tx = p - baseLeft; pintar(); }, alTerminar: terminar }),
      resorte({ desde: y, hasta: limitar(y + proyectar(v.y), 0, maxY), velocidad: v.y, alCambiar: (p) => { ty = p - baseTop; pintar(); }, alTerminar: terminar }),
    ];
  }
  el.addEventListener("pointerup", () => soltar(false));
  el.addEventListener("pointercancel", () => soltar(true));

  // un toque corto: tiembla de lado a lado y se va frenando, como un sticker que agitás
  function sacudir() {
    if (menosMovimiento()) return;
    el.getAnimations().forEach((a) => a.id === "sacudida" && a.cancel());
    const v = { easing: "ease-in-out" };
    el.animate([{ rotate: "0deg", ...v }, { rotate: "-8deg", ...v }, { rotate: "6deg", ...v }, { rotate: "-4deg", ...v }, { rotate: "2deg", ...v }, { rotate: "0deg" }], { duration: 480 }).id = "sacudida";
  }

  // teclado: las flechas la mueven (accesibilidad)
  el.addEventListener("keydown", (e) => {
    const d = { ArrowLeft: [-24, 0], ArrowRight: [24, 0], ArrowUp: [0, -24], ArrowDown: [0, 24] }[e.key];
    if (!d) return;
    e.preventDefault();
    const { maxX, maxY } = limites();
    baseLeft = limitar(el.offsetLeft + d[0], 0, maxX);
    baseTop = limitar(el.offsetTop + d[1], 0, maxY);
    tx = ty = 0;
    fijar();
  });
  };
  etiquetas.forEach(iniciar);
})();

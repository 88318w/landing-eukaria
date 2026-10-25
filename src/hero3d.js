// Logo 3D del hero. Se empaqueta con esbuild en hero3d.js (ver build.sh).
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import glbUrl from "../assets/logo3d.glb";
import hdrUrl from "../assets/studio.hdr"; // story_studio_03 (Poly Haven) a 1K

const stage = document.getElementById("stage");
const hero = stage.parentElement;
const mq = matchMedia("(prefers-reduced-motion: reduce)");
let reduce = mq.matches;

const BASE = { x: -0.55, y: -0.5, z: 0.1 }; // inclinación base del logo (rad)
const BAJAR = -0.2; // baja el logo (unidades del modelo, ~11% de su alto) para que la punta de arriba no toque el menú
const FOLLOW = 0.1; // seguimiento del mouse: solo un detalle sutil de fondo (rad)
const REFLEJO = 0.45; // cuánto gira el entorno con el mouse: los reflejos se deslizan por el cromo (rad)
const GIRO_X = 0.008; // rad por píxel al agarrar y arrastrar de izquierda a derecha (el control principal)
const GIRO_Y = 0.004; // rad por píxel en vertical: más suave
const TOPE_Y = 0.6; // máxima inclinación vertical al arrastrar (rad)

// Resorte con tiempo real (no depende de la tasa de cuadros): respuesta en segundos,
// amortiguación 1 = llega sin pasarse. El cromo pesa: sin rebote salvo el empujón de la etiqueta.
const nuevo = (x = 0) => ({ x, v: 0 });
const resorte = (s, hasta, dt, respuesta = 0.7, amort = 1) => {
  if (dt <= 0) return;
  const k = ((2 * Math.PI) / respuesta) ** 2;
  const c = (4 * Math.PI * amort) / respuesta;
  const n = Math.ceil(dt / 0.004);
  const h = dt / n;
  for (let i = 0; i < n; i++) {
    s.v += (-k * (s.x - hasta) - c * s.v) * h;
    s.x += s.v * h;
  }
};

try {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.setAttribute("role", "img");
  const etiquetaCanvas = () => renderer.domElement.setAttribute("aria-label", window.t ? window.t("hero.canvas") : "Eukaria 3D logo");
  etiquetaCanvas();
  addEventListener("idioma:cambio", etiquetaCanvas);
  stage.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50);
  const pivot = new THREE.Group();
  scene.add(pivot);

  const target = { x: 0, y: 0 }; // hacia dónde mira el mouse, -1..1
  const seg = { x: nuevo(), y: nuevo() }; // seguimiento suavizado
  const intro = nuevo(reduce ? 0 : 1); // entrada: de más girado y más chico hasta su lugar
  const giro = { x: nuevo(), y: nuevo(), z: nuevo() }; // vuelta completa al tocarlo: cabeceo, giro horizontal o rueda
  const giroMeta = { x: 0, y: 0, z: 0 };
  let giroResp = 0.9;
  const empuje = { x: nuevo(), y: nuevo() }; // sacudón cuando aterriza la etiqueta (rebota apenas)
  const arr = { x: nuevo(), y: nuevo() }; // giro que le das al agarrarlo (horizontal y vertical)
  let agarrado = false;

  let model = null, listo = false, visible = true, corriendo = false, last = 0;

  const fit = () => {
    const w = stage.clientWidth, h = stage.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    // el lienzo ocupa todo el hero (así nada se corta con un borde al girar), pero el logo se encuadra
    // en la zona de arriba: la franja de abajo (--zona-texto) queda libre para el texto
    const zona = (parseFloat(getComputedStyle(hero).getPropertyValue("--zona-texto")) || 0) * parseFloat(getComputedStyle(document.documentElement).fontSize);
    const util = Math.max(h - zona, 1);
    // el logo mide ~2.4 x 1.8 y conserva siempre su orientación. En pantallas verticales (celular) ocupa ~95% del ancho;
    // en horizontal, ~62% del ancho (o 84% del alto de la zona de arriba en pantallas bajas)
    const vertical = w / h < 0.85;
    const fov = THREE.MathUtils.degToRad(camera.fov);
    const distW = 2.4 / ((vertical ? 0.95 : 0.62) * 2 * Math.tan(fov / 2) * camera.aspect);
    const fraccion = !vertical && w / util > 2.6 ? 0.72 : 0.84; // en pantallas muy anchas y bajas se achica un poco para no tocar el menú
    const distH = 1.8 / (((fraccion * util) / h) * 2 * Math.tan(fov / 2));
    camera.position.set(0, 0, Math.max(distW, distH));
    camera.setViewOffset(w, h, 0, zona / 2, w, h); // sube el encuadre: el logo queda centrado en la zona de arriba
    camera.updateProjectionMatrix();
    draw(0);
  };

  const draw = (dt) => {
    if (!listo) return;
    resorte(seg.x, target.x, dt);
    resorte(seg.y, target.y, dt);
    resorte(intro, 0, dt, 0.9);
    for (const eje of ["x", "y", "z"]) resorte(giro[eje], giroMeta[eje], dt, giroResp);
    resorte(empuje.x, 0, dt, 0.5, 0.45);
    resorte(empuje.y, 0, dt, 0.5, 0.45);
    if (!agarrado) { // al soltarlo sigue de largo con el envión y vuelve suave a su pose
      resorte(arr.x, 0, dt, 1.1, 0.8);
      resorte(arr.y, 0, dt, 1.1, 0.8);
    }
    const t = performance.now() / 1000;
    const flota = reduce ? 0 : Math.sin(t * 0.8) * 0.04;
    pivot.rotation.set(
      BASE.x + seg.y.x * FOLLOW + flota + empuje.x.x + arr.y.x + giro.x.x,
      BASE.y + seg.x.x * FOLLOW + giro.y.x + intro.x + empuje.y.x + arr.x.x,
      BASE.z + giro.z.x
    );
    pivot.position.y = BAJAR + (reduce ? 0 : Math.sin(t * 0.6) * 0.04);
    pivot.scale.setScalar(1 - intro.x * 0.08);
    scene.environmentRotation.y = seg.x.x * REFLEJO;
    renderer.render(scene, camera);
  };

  // ---- detección del logo bajo el mouse (cursor de mano y giro al tocar) ----
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const sobreLogo = (cx, cy) => {
    const r = stage.getBoundingClientRect();
    ndc.set(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    return ray.intersectObject(model, true).length > 0;
  };
  let puntero = null;

  const loop = (ts) => {
    if (!visible || reduce) { corriendo = false; return; }
    const dt = Math.min((ts - last) / 1000, 0.064);
    last = ts;
    draw(dt);
    if (puntero) { // un solo chequeo por cuadro, y solo si el mouse se movió
      hero.classList.toggle("sobre-logo", !puntero.tapado && sobreLogo(puntero.x, puntero.y));
      puntero = null;
    }
    requestAnimationFrame(loop);
  };
  const arrancar = () => {
    if (corriendo || reduce || !listo || !visible) return;
    corriendo = true;
    last = performance.now();
    requestAnimationFrame(loop);
  };

  // se muestra recién cuando están el modelo Y el entorno: un metal sin entorno se ve negro
  const intentar = () => {
    if (listo || !model || !scene.environment) return;
    listo = true;
    fit();
    stage.classList.add("listo");
    arrancar();
  };

  new RGBELoader().load(hdrUrl, (hdr) => {
    hdr.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = pmrem.fromEquirectangular(hdr).texture;
    hdr.dispose();
    pmrem.dispose();
    intentar();
  });
  new GLTFLoader().load(glbUrl, (gltf) => {
    model = gltf.scene;
    const box = new THREE.Box3().setFromObject(model);
    model.position.sub(box.getCenter(new THREE.Vector3()));
    pivot.add(model);
    intentar();
  });

  // ---- agarrar y girar el logo (control principal) ----
  const lim = (v, a, b) => Math.max(a, Math.min(b, v));
  let mov = null, movio = false;
  hero.addEventListener("pointerdown", (e) => {
    if (e.button !== 0 || reduce || !listo || e.target.closest(".sticker, .nav")) return;
    if (!sobreLogo(e.clientX, e.clientY)) return;
    agarrado = true;
    movio = false;
    mov = { x: e.clientX, y: e.clientY, t: performance.now(), inicioX: e.clientX, inicioY: e.clientY, vx: 0, vy: 0 };
    arr.x.v = arr.y.v = 0;
    target.x = target.y = 0;
    hero.setPointerCapture(e.pointerId);
    hero.classList.add("agarrando");
    arrancar();
  });
  const soltar = () => {
    if (!agarrado) return;
    agarrado = false;
    hero.classList.remove("agarrando");
    if (performance.now() - mov.t > 80) mov.vx = mov.vy = 0; // si frenaste antes de soltar, no sale disparado
    // vuelve por el camino más corto: no desenrolla todas las vueltas
    arr.x.x = ((((arr.x.x + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) - Math.PI;
    arr.x.v = mov.vx;
    arr.y.v = mov.vy;
  };
  hero.addEventListener("pointerup", soltar);
  hero.addEventListener("pointercancel", soltar);

  // ---- seguimiento sutil del mouse ----
  addEventListener("pointermove", (e) => {
    if (agarrado) {
      if (Math.abs(e.clientX - mov.inicioX) > 5 || Math.abs(e.clientY - mov.inicioY) > 5) movio = true;
      const ahora = performance.now();
      const dt = (ahora - mov.t) / 1000;
      const dx = (e.clientX - mov.x) * GIRO_X;
      const dy = (e.clientY - mov.y) * GIRO_Y;
      arr.x.x += dx;
      arr.y.x = lim(arr.y.x + dy, -TOPE_Y, TOPE_Y);
      if (dt > 0) { // velocidad suavizada para el envión al soltar
        mov.vx = lim(mov.vx + (dx / dt - mov.vx) * 0.5, -12, 12);
        mov.vy = lim(mov.vy + (dy / dt - mov.vy) * 0.5, -6, 6);
      }
      Object.assign(mov, { x: e.clientX, y: e.clientY, t: ahora });
      return;
    }
    if (e.pointerType === "touch") return; // en el celular un toque no debe dejar el logo torcido
    puntero = { x: e.clientX, y: e.clientY, tapado: !!e.target.closest(".sticker, .nav") };
    if (reduce) return;
    if (document.querySelector(".sticker.is-dragging")) { target.x = target.y = 0; return; } // mientras movés la etiqueta, el logo se calma
    target.x = (e.clientX / innerWidth) * 2 - 1;
    target.y = (e.clientY / innerHeight) * 2 - 1;
  });
  document.documentElement.addEventListener("pointerleave", () => {
    target.x = target.y = 0;
    hero.classList.remove("sobre-logo");
  });
  // tocar el logo: casi siempre un balanceo suave hacia un lado al azar que vuelve solo, y de vez en
  // cuando (2 de 8) una vuelta completa de 360° sobre su eje, con la curva suave del giro original.
  // Regla: después de un movimiento no puede salir otro del mismo tipo (ni su versión hacia el otro lado).
  const AMP = { x: 0.28, y: 0.45, z: 0.18 }; // rad máximos por eje en los balanceos (~16°, ~26°, ~10°)
  const SUTILES = [[0, 1, 0], [0, -1, 0], [1, 0, 0], [-1, 0, 0], [0, 0, 1], [0.6, -1, 0]]; // [cabeceo, giro, rueda] en múltiplos de AMP
  const VUELTAS = [1, -1]; // 360° hacia cada lado
  const TIPOS = ["giro", "giro", "cabeceo", "cabeceo", "rueda", "mixto", "vuelta", "vuelta"]; // un tipo por movimiento, en el orden SUTILES + VUELTAS
  let ultimoTipo = "", volver = 0;
  const sortearGiro = () => {
    clearTimeout(volver);
    // las vueltas completas dejan el giro en múltiplos de 2π: se resta para no acumular ni desenrollar
    const w = Math.round(giroMeta.y / (2 * Math.PI)) * 2 * Math.PI;
    giroMeta.y -= w;
    giro.y.x -= w;
    let i;
    do i = Math.floor(Math.random() * TIPOS.length); while (TIPOS[i] === ultimoTipo);
    ultimoTipo = TIPOS[i];
    if (i < SUTILES.length) {
      const k = 0.7 + Math.random() * 0.4; // la intensidad también varía
      giroMeta.x = SUTILES[i][0] * AMP.x * k;
      giroMeta.y = SUTILES[i][1] * AMP.y * k;
      giroMeta.z = SUTILES[i][2] * AMP.z * k;
      giroResp = 0.55; // va hacia ahí con suavidad...
      volver = setTimeout(() => { // ...y después vuelve a su pose, más despacio
        giroMeta.x = giroMeta.y = giroMeta.z = 0;
        giroResp = 0.9;
        arrancar();
      }, 450);
    } else {
      giroMeta.x = giroMeta.z = 0;
      giroMeta.y = VUELTAS[i - SUTILES.length] * 2 * Math.PI;
      giroResp = 0.9;
    }
  };
  hero.addEventListener("click", (e) => {
    if (reduce || !listo || movio || e.target.closest(".sticker, .nav")) return; // si arrastraste, no cuenta como toque
    if (sobreLogo(e.clientX, e.clientY)) {
      sortearGiro();
      arrancar();
    }
  });
  // la etiqueta aterriza: el logo se hunde apenas del lado donde cayó
  addEventListener("sticker:aterrizo", (e) => {
    if (reduce) return;
    empuje.x.x += e.detail.y * 0.06;
    empuje.y.x += e.detail.x * 0.08;
    arrancar();
  });

  // pausa el render cuando el hero sale de pantalla
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    arrancar();
  }).observe(stage);

  mq.addEventListener("change", () => {
    reduce = mq.matches;
    if (reduce) target.x = target.y = 0;
    else arrancar();
  });

  new ResizeObserver(fit).observe(stage);
} catch (err) {
  console.warn("Logo 3D no disponible:", err);
}

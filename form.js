// Formulario de contacto: validación en el momento, mensajes claros debajo de cada campo y envío.
(() => {
  const form = document.getElementById("form");
  if (!form) return;

  const EMAIL = "proyectos@eukaria.com";
  // TODO (opcional): URL de un servicio de formularios (Formspree, Netlify Forms...) que reciba un POST con JSON.
  // Si queda vacío, al enviar se abre el programa de correo de la persona con el mensaje ya armado.
  const ENDPOINT = "";

  const t = window.t || ((k) => k); // textos traducidos (i18n.js)
  const MENSAJES = { valueMissing: "form.err.vacio", typeMismatch: "form.err.email", tooShort: "form.err.corto" };
  const estado = form.querySelector(".status");
  // el mensaje de estado cambia con un fundido corto + subida de 4px (en vez de aparecer de golpe)
  const decir = (texto) => {
    estado.textContent = texto;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    estado.animate([{ opacity: 0, translate: "0 4px" }, { opacity: 1, translate: "0 0" }], { duration: 250, easing: "cubic-bezier(0.23, 1, 0.32, 1)" });
  };
  const boton = form.querySelector("button[type=submit]");

  // muestra u oculta el error de un campo; devuelve si es válido
  const revisar = (campo) => {
    const v = campo.validity;
    const clave = v.valueMissing ? "valueMissing" : v.typeMismatch ? "typeMismatch" : v.tooShort ? "tooShort" : "";
    const error = document.getElementById(campo.id + "-error");
    error.textContent = clave ? t(MENSAJES[clave]) : "";
    error.hidden = !clave;
    campo.setAttribute("aria-invalid", String(!!clave));
    return !clave;
  };
  const campos = [...form.querySelectorAll("input, select, textarea")];
  // una vez que hay un error, se corrige en vivo mientras escribís
  campos.forEach((c) => {
    c.addEventListener("blur", () => c.value && revisar(c));
    c.addEventListener("input", () => c.getAttribute("aria-invalid") === "true" && revisar(c));
  });

  addEventListener("idioma:cambio", () => {
    campos.forEach((c) => c.getAttribute("aria-invalid") === "true" && revisar(c));
    estado.textContent = "";
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const invalidos = campos.filter((c) => !revisar(c));
    if (invalidos.length) {
      invalidos[0].focus();
      decir(t("form.revisar"));
      return;
    }
    const d = Object.fromEntries(new FormData(form));

    if (!ENDPOINT) {
      const asunto = encodeURIComponent(t("form.asunto", { tipo: d.tipo }));
      const cuerpo = encodeURIComponent(t("form.cuerpo", d));
      location.href = `mailto:${EMAIL}?subject=${asunto}&body=${cuerpo}`;
      decir(t("form.mailto"));
      return;
    }
    boton.disabled = true;
    decir(t("form.enviando"));
    try {
      const r = await fetch(ENDPOINT, { method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify(d) });
      if (!r.ok) throw new Error(r.status);
      form.reset();
      decir(t("form.ok"));
    } catch {
      decir(t("form.error", { email: EMAIL }));
    } finally {
      boton.disabled = false;
    }
  });
})();

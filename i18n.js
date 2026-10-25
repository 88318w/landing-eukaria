// Idioma: español / inglés en todo el sitio. Se elige con el botón ES / EN del menú y se recuerda en el navegador.
//
// Cómo funciona (mismo esquema que el portfolio):
//   data-i18n="clave"                      -> reemplaza el texto del elemento
//   data-i18n-attr="aria-label:clave;alt:clave2" -> reemplaza atributos
//   data-proyecto="0"                      -> carga título, servicio y bajada del proyecto 0 (ver proy.0.*)
// Los textos generados por JavaScript (formulario, galería, menú) usan window.t("clave", { variables }).
// Para sumar o corregir un texto: editá el diccionario TEXTOS de acá abajo, en las dos lenguas.
(() => {
  const TEXTOS = {
    es: {
      // ---- menú y estructura común ----
      "nav.label": "Principal",
      "nav.home": "Inicio",
      "nav.work": "Trabajo",
      "nav.about": "Nosotros",
      "nav.contact": "Contacto",
      "nav.cta": "Pedir presupuesto",
      "menu.abrir": "Abrir menú",
      "menu.cerrar": "Cerrar menú",
      "lang.label": "Cambiar idioma a inglés",
      "pie.cta": "Contanos de tu proyecto",
      "galeria.aria": "Galería del proyecto",
      "galeria.cerrar": "Cerrar galería",
      "galeria.servicio": "Servicio",
      "galeria.imagen": "Imagen {i} de {n} del proyecto",
      "galeria.muestra": " (de muestra)",
      "proy.abrir": "Abrir {titulo}",
      // ---- títulos de pestaña y descripciones ----
      "pag.index.titulo": "Eukaria | Agencia de diseño",
      "pag.index.desc": "Eukaria es una agencia de diseño que crea identidades, estrategias y sistemas visuales desde la escala microscópica.",
      "pag.about.titulo": "Sobre nosotros | Eukaria",
      "pag.about.desc": "Bienvenidos al laboratorio de Eukaria: una agencia de diseño que piensa como un laboratorio, y los servicios que ofrece.",
      "pag.contact.titulo": "Contacto | Eukaria",
      "pag.contact.desc": "Contanos de tu proyecto: identidad de marca, estrategia o sistema visual. Te respondemos a la brevedad.",
      "pag.proyectos.titulo": "Nuestro trabajo | Eukaria",
      "pag.proyectos.desc": "Proyectos de Eukaria: identidades, estrategias y sistemas visuales.",
      // ---- landing ----
      "index.h1": "Eukaria, agencia de diseño: donde nace el impulso",
      "index.etiqueta": "Etiqueta de laboratorio con el lema: Donde nace el impulso. Se puede arrastrar.",
      "index.cinta": "Cinta de embalaje negra con el texto ID: #EUK-0506 y EUKARIA tachado. Se puede arrastrar.",
      "index.hero": "Somos una agencia de diseño. Creamos identidades y sistemas visuales para marcas que evolucionan.",
      "index.chev": "Seguir bajando",
      "index.intro": "Concebimos la marca como un organismo vivo. Trabajamos desde la escala del detalle para lograr una comunicación precisa, con la solidez necesaria para adaptarse y perdurar. Creemos que una identidad no se decora: se diseña para evolucionar.",
      "index.trabajo": "Nuestro trabajo",
      "hero.canvas": "Logo de Eukaria en 3D. Se puede agarrar y girar, o tocar para que se mueva.",
      // ---- proyectos de muestra ----
      "proy.0.titulo": "Proyecto 01", "proy.0.servicio": "Identidad de marca", "proy.0.bajada": "Breve descripción del proyecto: el desafío, la idea y el resultado en dos o tres líneas.",
      "proy.1.titulo": "Proyecto 02", "proy.1.servicio": "Sistema visual", "proy.1.bajada": "Breve descripción del proyecto: qué necesitaba la marca y cómo lo resolvimos, en dos o tres líneas.",
      "proy.2.titulo": "Proyecto 03", "proy.2.servicio": "Estrategia y naming", "proy.2.bajada": "Breve descripción del proyecto: el punto de partida, la decisión clave y lo que logró.",
      "proy.3.titulo": "Proyecto 04", "proy.3.servicio": "Afiches y piezas gráficas", "proy.3.bajada": "Breve descripción del proyecto: el concepto y cómo se aplicó en cada pieza.",
      "proy.4.titulo": "Proyecto 05", "proy.4.servicio": "Merchandising", "proy.4.bajada": "Breve descripción del proyecto: la idea detrás de las piezas y dónde se usaron.",
      "proy.5.titulo": "Proyecto 06", "proy.5.servicio": "Identidad y packaging", "proy.5.bajada": "Breve descripción del proyecto: el desafío, el enfoque y el resultado final.",
      // ---- about ----
      "about.t1": "Bienvenidos", "about.t2": "al", "about.t3": "laboratorio",
      "about.texto": "Eukaria es una agencia que piensa como un laboratorio. Observamos cada marca al microscopio, descubrimos qué la hace única y la hacemos mutar hasta que evoluciona. Donde nace el impulso, empieza el diseño. Somos Verónica, Luna, Luz, Lautaro y Sofía.",
      "about.foto": "Foto del equipo (de muestra)",
      "about.servicios": "Servicios",
      "serv.1": "Identidad de marca", "serv.2": "Estrategia", "serv.3": "Sistemas visuales",
      "serv.4": "Papelería institucional", "serv.5": "Piezas promocionales", "serv.6": "Merchandising",
      // ---- contacto ----
      "contact.titulo": "Contanos de tu proyecto",
      "contact.lead": "Contanos qué querés trabajar y te respondemos a la brevedad.",
      "form.nombre": "Nombre",
      "form.email": "Email",
      "form.tipo": "Qué querés trabajar",
      "form.opcion0": "Elegí una opción",
      "form.opcion1": "Identidad de marca",
      "form.opcion2": "Estrategia",
      "form.opcion3": "Sistema visual (papelería, afiches, merchandising)",
      "form.opcion4": "Otra cosa",
      "form.mensaje": "Contanos más",
      "form.ayuda": "Una idea, el objetivo y, si las hay, las fechas.",
      "form.enviar": "Enviar consulta",
      "form.err.vacio": "Completá este campo.",
      "form.err.email": "Revisá el email, parece incompleto.",
      "form.err.corto": "Contanos un poco más (mínimo 20 caracteres).",
      "form.revisar": "Revisá los campos marcados.",
      "form.mailto": "Se abrió tu programa de correo con el mensaje listo. Enviálo desde ahí.",
      "form.enviando": "Enviando...",
      "form.ok": "Gracias, recibimos tu consulta. Te respondemos pronto.",
      "form.error": "No pudimos enviarlo. Probá de nuevo o escribinos a {email}.",
      "form.asunto": "Consulta: {tipo}",
      "form.cuerpo": "Nombre: {nombre}\nEmail: {email}\nProyecto: {tipo}\n\n{mensaje}",
    },
    en: {
      "nav.label": "Main",
      "nav.home": "Home",
      "nav.work": "Our work",
      "nav.about": "About",
      "nav.contact": "Contact",
      "nav.cta": "Request a quote",
      "menu.abrir": "Open menu",
      "menu.cerrar": "Close menu",
      "lang.label": "Switch language to Spanish",
      "pie.cta": "Tell us about your project",
      "galeria.aria": "Project gallery",
      "galeria.cerrar": "Close gallery",
      "galeria.servicio": "Service",
      "galeria.imagen": "Image {i} of {n} of the project",
      "galeria.muestra": " (sample)",
      "proy.abrir": "Open {titulo}",
      "pag.index.titulo": "Eukaria | Design agency",
      "pag.index.desc": "Eukaria is a design agency that creates identities, strategies and visual systems from the microscopic scale.",
      "pag.about.titulo": "About us | Eukaria",
      "pag.about.desc": "Welcome to Eukaria's laboratory: a design agency that thinks like a laboratory, and the services it offers.",
      "pag.contact.titulo": "Contact | Eukaria",
      "pag.contact.desc": "Tell us about your project: brand identity, strategy or visual system. We'll get back to you shortly.",
      "pag.proyectos.titulo": "Our work | Eukaria",
      "pag.proyectos.desc": "Eukaria projects: identities, strategies and visual systems.",
      "index.h1": "Eukaria, design agency: where the impulse begins",
      "index.etiqueta": "Lab label with the motto: Where the impulse begins (written in Spanish on the label). Draggable.",
      "index.cinta": "Black packing tape with the text ID: #EUK-0506 and EUKARIA crossed out. Draggable.",
      "index.hero": "We are a design agency. We create identities and visual systems for brands that evolve.",
      "index.chev": "Keep scrolling",
      "index.intro": "We see a brand as a living organism. We work at the scale of detail to achieve precise communication, with the solidity needed to adapt and endure. We believe an identity isn't decorated: it's designed to evolve.",
      "index.trabajo": "Our work",
      "hero.canvas": "Eukaria logo in 3D. Grab and rotate it, or tap it to make it move.",
      "proy.0.titulo": "Project 01", "proy.0.servicio": "Brand identity", "proy.0.bajada": "Short project description: the challenge, the idea and the result in two or three lines.",
      "proy.1.titulo": "Project 02", "proy.1.servicio": "Visual system", "proy.1.bajada": "Short project description: what the brand needed and how we solved it, in two or three lines.",
      "proy.2.titulo": "Project 03", "proy.2.servicio": "Strategy and naming", "proy.2.bajada": "Short project description: the starting point, the key decision and what it achieved.",
      "proy.3.titulo": "Project 04", "proy.3.servicio": "Posters and graphic pieces", "proy.3.bajada": "Short project description: the concept and how it was applied to each piece.",
      "proy.4.titulo": "Project 05", "proy.4.servicio": "Merchandising", "proy.4.bajada": "Short project description: the idea behind the pieces and where they were used.",
      "proy.5.titulo": "Project 06", "proy.5.servicio": "Identity and packaging", "proy.5.bajada": "Short project description: the challenge, the approach and the final result.",
      "about.t1": "Welcome", "about.t2": "to the", "about.t3": "laboratory",
      "about.texto": "Eukaria is an agency that thinks like a laboratory. We observe every brand under the microscope, find what makes it unique and make it mutate until it evolves. Where the impulse begins, design begins. We are Verónica, Luna, Luz, Lautaro and Sofía.",
      "about.foto": "Team photo (sample)",
      "about.servicios": "Services",
      "serv.1": "Brand identity", "serv.2": "Strategy", "serv.3": "Visual systems",
      "serv.4": "Institutional stationery", "serv.5": "Promotional pieces", "serv.6": "Merchandising",
      "contact.titulo": "Tell us about your project",
      "contact.lead": "Tell us what you'd like to work on and we'll get back to you shortly.",
      "form.nombre": "Name",
      "form.email": "Email",
      "form.tipo": "What would you like to work on",
      "form.opcion0": "Choose an option",
      "form.opcion1": "Brand identity",
      "form.opcion2": "Strategy",
      "form.opcion3": "Visual system (stationery, posters, merchandising)",
      "form.opcion4": "Something else",
      "form.mensaje": "Tell us more",
      "form.ayuda": "An idea, the goal and, if there are any, the dates.",
      "form.enviar": "Send inquiry",
      "form.err.vacio": "Please fill in this field.",
      "form.err.email": "Check the email, it looks incomplete.",
      "form.err.corto": "Tell us a bit more (at least 20 characters).",
      "form.revisar": "Please check the highlighted fields.",
      "form.mailto": "Your email app opened with the message ready. Send it from there.",
      "form.enviando": "Sending...",
      "form.ok": "Thanks, we got your inquiry. We'll reply soon.",
      "form.error": "We couldn't send it. Please try again or write to us at {email}.",
      "form.asunto": "Inquiry: {tipo}",
      "form.cuerpo": "Name: {nombre}\nEmail: {email}\nProject: {tipo}\n\n{mensaje}",
    },
  };

  // idioma inicial: el que elegiste la última vez; si no, el del navegador (español si es español, si no inglés)
  let guardado = null;
  try { guardado = localStorage.getItem("eukaria-idioma"); } catch {}
  let idioma = guardado === "es" || guardado === "en" ? guardado : /^es/i.test(navigator.language || "es") ? "es" : "en";

  const t = (clave, vars) => {
    let s = TEXTOS[idioma][clave] ?? TEXTOS.es[clave] ?? clave;
    if (vars) for (const k in vars) s = s.split(`{${k}}`).join(vars[k]);
    return s;
  };
  window.t = t;
  window.idioma = () => idioma;

  const aplicar = () => {
    document.documentElement.lang = idioma;
    document.querySelectorAll("[data-i18n]").forEach((e) => (e.textContent = t(e.dataset.i18n)));
    document.querySelectorAll("[data-i18n-attr]").forEach((e) =>
      e.dataset.i18nAttr.split(";").forEach((par) => {
        const [atributo, clave] = par.split(":");
        e.setAttribute(atributo.trim(), t(clave.trim()));
      })
    );
    // proyectos de muestra: botón (datos de la galería) y nombre debajo de la portada
    document.querySelectorAll("[data-proyecto]").forEach((e) => {
      const i = e.dataset.proyecto;
      e.dataset.titulo = t(`proy.${i}.titulo`);
      e.dataset.servicio = t(`proy.${i}.servicio`);
      e.dataset.bajada = t(`proy.${i}.bajada`);
      e.setAttribute("aria-label", t("proy.abrir", { titulo: e.dataset.titulo }));
    });
    document.querySelectorAll("[data-proyecto-nombre]").forEach((e) => (e.textContent = t(`proy.${e.dataset.proyectoNombre}.titulo`)));
    // pestaña y descripción
    const pagina = document.body.dataset.pagina;
    if (pagina) {
      document.title = t(`pag.${pagina}.titulo`);
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute("content", t(`pag.${pagina}.desc`));
    }
    document.querySelectorAll(".lang").forEach((b) => b.setAttribute("aria-label", t("lang.label")));
    dispatchEvent(new CustomEvent("idioma:cambio", { detail: idioma }));
  };

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".lang")) return;
    idioma = idioma === "es" ? "en" : "es";
    try { localStorage.setItem("eukaria-idioma", idioma); } catch {}
    aplicar();
  });

  aplicar();
})();

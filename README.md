# Eukaria: sitio de la agencia

Sitio estático (HTML, CSS y JavaScript sin dependencias en el navegador). Páginas: `index.html` (landing), `about.html`, `contact.html` y `proyectos.html`.

## Cómo verlo

Abrí `index.html` con doble clic, o levantá un servidor local en esta carpeta:

```bash
python -m http.server 5173
```

y entrá a http://localhost:5173.

## Idioma

El botón **ES / EN** del menú cambia todo el sitio. Todos los textos están en `i18n.js` (español e inglés lado a lado).

## Logo 3D

`hero3d.js` es el logo 3D ya empaquetado (Three.js + modelo + entorno de luz). Su código fuente está en `src/hero3d.js`. Para regenerarlo después de cambiar algo hace falta Node:

```bash
npm i three esbuild
npx esbuild src/hero3d.js --bundle --minify --format=iife --loader:.glb=dataurl --loader:.hdr=dataurl --outfile=hero3d.js
```

## Contenido para completar

- Mail y redes (hay comentarios `TODO` en el pie de las 4 páginas y en `form.js`).
- Proyectos: portadas y galerías reales (ver el comentario al inicio de `galeria.js`).
- Foto del equipo en `about.html`.

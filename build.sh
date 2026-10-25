# Reempaqueta el logo 3D (solo si cambias src/hero3d.js o assets/logo3d.glb).
# Requiere una carpeta con three y esbuild instalados: npm i three esbuild
BUILD="${1:-C:/Users/USUARIO/AppData/Local/Temp/claude/C--Users-USUARIO-OneDrive-Escritorio-landing-eukaria/99011e90-4fc2-4fdb-8be6-5298af71691c/scratchpad/build}"
NODE_PATH="$BUILD/node_modules" "$BUILD/node_modules/.bin/esbuild" src/hero3d.js --bundle --minify --format=iife --loader:.glb=dataurl --loader:.hdr=dataurl --outfile=hero3d.js

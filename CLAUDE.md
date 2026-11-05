# Alex Records — contexto para Claude Code

Landing de comercio electrónico para **Alex Records**: management e importación de discos de acetato de música africana.

## Stack
Next.js 15 (App Router) · React 19 · Tailwind CSS 3 · React Three Fiber 9 + drei · GSAP 3 (ScrollTrigger) · Framer Motion 11 · TypeScript.

## Comandos
- `npm install`
- `npm run dev` → http://localhost:3000
- `npm run build` → verificar que compila

## Estado actual
- Compila sin errores (`npm run build`) y funciona en `npm run dev`. Ya está optimizado: Lenis + ScrollTrigger, partículas en shader, dpr adaptativo, fuentes con `next/font`, entrada del titular en CSS.
- Existe una versión de referencia en un solo HTML (three.js + GSAP por CDN) que ya funciona y se ve bien en móvil: `preview/alex-records-preview.html`. Si hay dudas de cómo debe verse o comportarse algo, esa es la referencia.
- Catálogo, artistas y precios en `data/records.ts` son **ficticios** (placeholder).
- El botón "Finalizar compra" y el formulario de la lista privada no están conectados a nada.

## Diseño
- Paleta solo blanco hueso (`bone` #f4f1ea) y negro tinta (`ink` #0a0a0a). Nada de colores de acento.
- Tipografías: Anton (display, mayúsculas gigantes), Instrument Serif itálica (acentos), Inter Tight (texto), JetBrains Mono (etiquetas).
- Fondos con textura textil (patrones en `app/globals.css`), grano de película global.
- Todo debe funcionar bien en móvil: sin cursor personalizado ni efectos de hover en táctil; el scroll horizontal de la historia solo en escritorio.

## Mapa de archivos
- `components/VinylScene.tsx` — escena 3D del héroe (disco, vapor, especias, luces). Texturas generadas en canvas, sin assets externos.
- `components/Hero.tsx` — titular, carga diferida de la escena, ScrollTrigger del héroe.
- `components/Story.tsx` — narración por scroll (pin + horizontal en escritorio).
- `components/Products.tsx` — vitrina con inclinación 3D, disco que sale de la funda, reflejos.
- `components/Management.tsx`, `Footer.tsx`, `CartDrawer.tsx`, `Nav.tsx`, `Cursor.tsx`, `Magnetic.tsx`.
- `lib/cart.tsx` — contexto del carrito (cada acetato es pieza única, no se duplica).
- `lib/scroll.ts` — estado compartido entre GSAP y la escena 3D sin re-renders.

## Forma de trabajar
- Editar el código directamente en los archivos.
- No hacer commits salvo que el usuario lo pida: él revisa los cambios y decide.

## Flujo de Git (obligatorio)
Repositorio: https://github.com/eliansito4/Alex-Records (privado).

- **Nunca se trabaja directamente en `main`.** `main` solo recibe trabajo ya terminado y revisado.
- Antes de tocar código, crear una rama desde `main` actualizado:
  ```bash
  git checkout main && git pull
  git checkout -b tipo/descripcion-corta
  ```
- Nombres de rama (minúsculas, guiones):
  - `feature/…` — funcionalidad nueva (`feature/checkout-stripe`)
  - `fix/…` — corrección de errores (`fix/nav-movil`)
  - `perf/…` — rendimiento (`perf/escena-3d`)
  - `style/…` — cambios visuales sin lógica nueva
  - `chore/…` — dependencias, configuración, documentación
- Commits pequeños y en español, en imperativo: `Añade carrito persistente`, `Corrige color del menú en móvil`.
- Antes de integrar: `npm run build` debe pasar sin errores.
- Integrar en `main` y subir:
  ```bash
  git push -u origin tipo/descripcion-corta   # subir la rama
  git checkout main && git pull
  git merge --no-ff tipo/descripcion-corta
  git push origin main
  git branch -d tipo/descripcion-corta
  ```
- Si Claude detecta que está en `main` al empezar una tarea, debe crear la rama primero.

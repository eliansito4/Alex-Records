# Alex Records — contexto para Claude Code

Landing de comercio electrónico para **Alex Records**: management e importación de discos de acetato de música africana.

## Stack
Next.js 15 (App Router) · React 19 · Tailwind CSS 3 · React Three Fiber 9 + drei · GSAP 3 (ScrollTrigger) · Framer Motion 11 · TypeScript.

## Comandos
- `npm install`
- `npm run dev` → http://localhost:3000
- `npm run build` → verificar que compila

## Estado actual
- Compila sin errores (`npm run build`) y funciona en `npm run dev`. Optimizado: Lenis + ScrollTrigger, partículas en shader, dpr adaptativo, fuentes con `next/font`, entrada del titular en CSS, tarjetas sin animaciones.
- Sitio dividido en páginas: `/` (inicio con el disco 3D), `/historia`, `/tienda`, `/tienda/[id]` (ficha), `/carrito`, `/management`, `/contacto`.
- La tienda es un listado tipo mercado de discos: filtros con contadores, búsqueda, orden y paginación, todo en la URL.
- Precios en **EUR**; conversión aproximada a **COP** con la tasa de `/api/fx` (caché 12 h, respaldo en `lib/currency-config.ts`). Se cobra en EUR.
- Catálogo (`data/catalog.ts`), artistas y precios son **ficticios**. Fotos de stock de Unsplash revisadas sin marcas reales (`data/photos.ts`); se sustituyen por fotos propias en el campo `image`.
- **Pendiente:** "Finalizar compra" desactivado (sin pasarela de pago); el formulario de la lista privada no envía nada; la "reserva de 30 minutos" que menciona el texto no existe todavía (necesita servidor y base de datos).
- Referencia visual original en un solo HTML: `preview/alex-records-preview.html`.

## Diseño
- Paleta solo blanco hueso (`bone` #f4f1ea) y negro tinta (`ink` #0a0a0a). Nada de colores de acento.
- Tipografías: Anton (display, mayúsculas gigantes), Instrument Serif itálica (acentos), Inter Tight (texto), JetBrains Mono (etiquetas).
- Fondos con textura textil (patrones en `app/globals.css`), grano de película global.
- Todo debe funcionar bien en móvil: sin cursor personalizado ni efectos de hover en táctil; el scroll horizontal de la historia solo en escritorio.

## Mapa de archivos
- `app/layout.tsx` + `components/SiteShell.tsx` — lo común a todas las páginas: moneda, carrito, Lenis, cursor, menú, pie, carrito lateral.
- `app/template.tsx` — fundido al cambiar de página (no en la primera carga).
- `components/VinylScene.tsx` — escena 3D del héroe (disco, vapor, especias, luces). Texturas en canvas, sin assets externos.
- `components/Hero.tsx` — titular, carga diferida de la escena, ScrollTrigger del héroe. Solo en `/`.
- `components/Story.tsx` — narración por scroll (pin + horizontal en escritorio).
- `components/shop/` — tienda: `ShopView` (listado), `Filters`, `ResultRow`, `AddToCart`, `CartView` (página del carrito).
- `components/Price.tsx` — precio en la moneda elegida y selector EUR/COP. `components/DiscImage.tsx` — foto del disco optimizada.
- `components/Nav.tsx` (menú + menú móvil), `Footer.tsx`, `CartDrawer.tsx`, `Cursor.tsx`, `Magnetic.tsx`, `Management.tsx`, `ContactSection.tsx`.
- `data/catalog.ts` (discos y escala de estados), `data/photos.ts`, `data/story.ts`.
- `lib/shop.ts` — filtros, búsqueda, orden y paginación (funciones puras, estado en la URL).
- `lib/cart.tsx` — carrito (pieza única, se guarda en el navegador por id). `lib/currency.tsx` — moneda y tasa.
- `lib/nav.ts` — lista de páginas. `lib/lenis-instance.ts` — acceso a Lenis sin cargar GSAP. `lib/scroll.ts` — estado GSAP ↔ escena 3D.

## Forma de trabajar
- Editar el código directamente en los archivos.
- Trabajo por módulos, una rama por módulo. Claude hace los commits en la rama y, con el visto bueno del usuario, fusiona en `main` y hace push.

## Flujo de Git (obligatorio)
Repositorio: https://github.com/eliansito4/Alex-Records (**público**). `main` está protegida en GitHub: no se puede borrar ni hacer push forzado.

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

## Secretos y `.gitignore` (el repo es público)
Todo lo que se sube queda visible para cualquiera, y en el historial de git aunque luego se borre.
- **Nunca subir** `.env`, `.env.local`, claves de API, tokens ni contraseñas. Los secretos van en `.env.local`, que ya está en `.gitignore` (`.env*`).
- Por cada variable nueva, añadir su nombre (sin valor) a `.env.example`, que sí se sube.
- Solo las variables `NEXT_PUBLIC_*` llegan al navegador: **nunca** poner un secreto con ese prefijo.
- Antes de cada commit, revisar `git status` y `git diff --cached` buscando `.env*` o claves (`sk_`, `pk_live`, `service_role`, `secret`, `token`, `password`). Claude debe avisar si aparece algo.
- Al crear archivos nuevos de configuración o credenciales, comprobar que `.gitignore` los cubre.
- Si se sube un secreto por error: **rotarlo (generar uno nuevo) de inmediato**; borrarlo del repo no basta.

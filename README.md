# Alex Records — Landing de comercio electrónico

Next.js 15 · Tailwind CSS · React Three Fiber · GSAP ScrollTrigger · Framer Motion

## Arrancar

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start   # producción
```

Requiere Node 18.18 o superior.

## Qué hay en cada archivo

| Archivo | Qué hace |
|---|---|
| `components/VinylScene.tsx` | Héroe 3D: disco de acetato con surcos y sello generados en canvas, material físico con clearcoat (reflejos tipo vidrio), vapor, partículas de especias e iluminación que se mueve sola y con el ratón. Reflejos de estudio con `Lightformer` (no descarga HDRIs). |
| `components/Hero.tsx` | Titular gigante, entrada animada, parallax y conexión del scroll con la escena 3D. |
| `components/Story.tsx` | Narración por scroll: sección fijada con capítulos en horizontal (escritorio) y revelado vertical (móvil). |
| `components/Products.tsx` | Vitrina: inclinación 3D al pasar el ratón, el disco sale de la funda, reflejo de vidrio y reflejo en el suelo. |
| `components/Management.tsx` | Contadores animados y titular revelado palabra por palabra. |
| `components/CartDrawer.tsx` | Carrito lateral (cada acetato es pieza única: no se duplica). |
| `components/Cursor.tsx`, `Magnetic.tsx` | Cursor personalizado y botones magnéticos. |
| `data/records.ts` | Catálogo y textos de la historia — **datos de ejemplo**, cámbialos por los reales. |

## Personalizar

- **Colores:** `tailwind.config.ts` (`ink`, `bone`) y las variables en `app/globals.css`.
- **Tipografías:** se cargan desde Google Fonts en `app/layout.tsx` (Anton, Instrument Serif, Inter Tight, JetBrains Mono).
- **Fotos reales de los discos:** sustituye los patrones de `sleevePatterns` en `Products.tsx` por `<Image>` de Next.
- **Pago:** el botón "Finalizar compra" está listo para conectar con Stripe, Shopify Storefront o similar.

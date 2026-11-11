// Páginas del sitio: una sola lista para el menú, el menú móvil, el pie y el índice de inicio.
export const pages = [
  { href: "/historia", label: "Historia", blurb: "Del surco a tus manos: cómo encontramos cada acetato." },
  { href: "/tienda", label: "Tienda", blurb: "Acetatos, test pressings y primeras prensas. Piezas únicas." },
  { href: "/management", label: "Management", blurb: "Representamos la música y a quienes la hicieron." },
  { href: "/contacto", label: "Contacto", blurb: "Lista privada: los nuevos acetatos 48 h antes." },
] as const;

export type PageHref = (typeof pages)[number]["href"];

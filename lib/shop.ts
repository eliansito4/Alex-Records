// Lógica de la tienda: filtros, búsqueda, orden, paginación y contadores.
// Sin React: funciones puras que leen y escriben el estado en la URL
// (?q=…&formato=LP,EP&orden=precio-asc&pagina=2), así una búsqueda se puede compartir.
import { discs, GRADES, type Disc, type Grade } from "@/data/catalog";

/* ---------- Facetas (grupos de filtros) ---------- */

export const PRICE_BUCKETS = [
  { id: "0-50", min: 0, max: 50 },
  { id: "50-150", min: 50, max: 150 },
  { id: "150-300", min: 150, max: 300 },
  { id: "300+", min: 300, max: Infinity },
] as const;

const decadeOf = (year: number) => `${Math.floor(year / 10) * 10}s`;
const priceBucketOf = (price: number) => PRICE_BUCKETS.find((b) => price >= b.min && price < b.max)!.id;

export const FACETS = [
  { key: "formato", title: "Formato", value: (d: Disc) => d.format },
  { key: "genero", title: "Género", value: (d: Disc) => d.genre },
  { key: "pais", title: "País de origen", value: (d: Disc) => d.country },
  { key: "estado", title: "Estado del disco", value: (d: Disc) => d.media },
  { key: "decada", title: "Década", value: (d: Disc) => decadeOf(d.year) },
  { key: "precio", title: "Precio", value: (d: Disc) => priceBucketOf(d.price) },
] as const;

export type FacetKey = (typeof FACETS)[number]["key"];

/* ---------- Orden ---------- */

export const SORTS = [
  { id: "recientes", label: "Añadido más reciente" },
  { id: "precio-asc", label: "Precio: menor a mayor" },
  { id: "precio-desc", label: "Precio: mayor a menor" },
  { id: "artista", label: "Artista (A–Z)" },
  { id: "titulo", label: "Título (A–Z)" },
  { id: "anio-asc", label: "Año: más antiguo" },
  { id: "estado", label: "Mejor estado" },
] as const;
export type SortId = (typeof SORTS)[number]["id"];

export const PAGE_SIZES = [10, 25, 50] as const;
const DEFAULT_SORT: SortId = "recientes";
const DEFAULT_SIZE = 10;

/* ---------- Estado de la tienda ---------- */

export type ShopState = {
  q: string;
  filters: Record<FacetKey, string[]>;
  sort: SortId;
  page: number;
  size: number;
};

const emptyFilters = (): Record<FacetKey, string[]> =>
  Object.fromEntries(FACETS.map((f) => [f.key, [] as string[]])) as unknown as Record<FacetKey, string[]>;

export function parseState(params: URLSearchParams): ShopState {
  const filters = emptyFilters();
  for (const f of FACETS) {
    const raw = params.get(f.key);
    if (raw) filters[f.key] = raw.split(",").filter(Boolean);
  }
  const sort = SORTS.some((s) => s.id === params.get("orden")) ? (params.get("orden") as SortId) : DEFAULT_SORT;
  const size = Number(params.get("mostrar"));
  const page = Math.max(1, Math.floor(Number(params.get("pagina")) || 1));
  return {
    q: params.get("q") ?? "",
    filters,
    sort,
    page,
    size: (PAGE_SIZES as readonly number[]).includes(size) ? size : DEFAULT_SIZE,
  };
}

export function toQuery(s: ShopState): string {
  const p = new URLSearchParams();
  if (s.q.trim()) p.set("q", s.q.trim());
  for (const f of FACETS) if (s.filters[f.key].length) p.set(f.key, s.filters[f.key].join(","));
  if (s.sort !== DEFAULT_SORT) p.set("orden", s.sort);
  if (s.size !== DEFAULT_SIZE) p.set("mostrar", String(s.size));
  if (s.page > 1) p.set("pagina", String(s.page));
  const str = p.toString();
  return str ? `?${str}` : "";
}

export const activeCount = (s: ShopState) => FACETS.reduce((n, f) => n + s.filters[f.key].length, 0);

/* ---------- Búsqueda ---------- */

// Sin tildes ni mayúsculas: "etiopia" encuentra "Etiopía"
const norm = (t: string) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const searchIndex = new Map(
  discs.map((d) => [d.id, norm([d.artist, d.title, d.label, d.catNo, d.genre, d.city, d.country, d.format, String(d.year)].join(" "))])
);

const matchesQuery = (d: Disc, q: string) => {
  const words = norm(q).split(/\s+/).filter(Boolean);
  const hay = searchIndex.get(d.id)!;
  return words.every((w) => hay.includes(w));
};

/* ---------- Filtrar, contar, ordenar, paginar ---------- */

// skip: faceta que no se aplica (para que sus propios contadores muestren las alternativas)
function filterDiscs(s: ShopState, skip?: FacetKey) {
  return discs.filter((d) => {
    if (s.q && !matchesQuery(d, s.q)) return false;
    return FACETS.every((f) => f.key === skip || !s.filters[f.key].length || s.filters[f.key].includes(f.value(d)));
  });
}

export type FacetOption = { value: string; count: number; selected: boolean };

// Contadores tipo "LP 14": cuántos resultados habría al marcar cada opción,
// respetando el resto de filtros activos.
export function facetOptions(s: ShopState, key: FacetKey): FacetOption[] {
  const facet = FACETS.find((f) => f.key === key)!;
  const base = filterDiscs(s, key);
  const counts = new Map<string, number>();
  for (const d of base) counts.set(facet.value(d), (counts.get(facet.value(d)) ?? 0) + 1);
  // Las opciones seleccionadas se muestran aunque ahora den 0
  for (const v of s.filters[key]) if (!counts.has(v)) counts.set(v, 0);

  const order = (a: string, b: string) => {
    if (key === "estado") return GRADES.indexOf(a as Grade) - GRADES.indexOf(b as Grade);
    if (key === "precio") return PRICE_BUCKETS.findIndex((p) => p.id === a) - PRICE_BUCKETS.findIndex((p) => p.id === b);
    if (key === "decada") return a.localeCompare(b);
    return (counts.get(b)! - counts.get(a)!) || a.localeCompare(b, "es");
  };
  return [...counts.keys()].sort(order).map((v) => ({ value: v, count: counts.get(v)!, selected: s.filters[key].includes(v) }));
}

const sorters: Record<SortId, (a: Disc, b: Disc) => number> = {
  recientes: (a, b) => b.addedAt.localeCompare(a.addedAt) || a.id.localeCompare(b.id),
  "precio-asc": (a, b) => a.price - b.price,
  "precio-desc": (a, b) => b.price - a.price,
  artista: (a, b) => a.artist.localeCompare(b.artist, "es"),
  titulo: (a, b) => a.title.localeCompare(b.title, "es"),
  "anio-asc": (a, b) => a.year - b.year,
  estado: (a, b) => GRADES.indexOf(a.media) - GRADES.indexOf(b.media) || b.price - a.price,
};

// Discos relacionados para la ficha: primero mismo género, luego mismo país
export function relatedDiscs(d: Disc, n = 4): Disc[] {
  const score = (o: Disc) => (o.genre === d.genre ? 2 : 0) + (o.country === d.country ? 1 : 0);
  return discs
    .filter((o) => o.id !== d.id && score(o) > 0)
    .sort((a, b) => score(b) - score(a) || b.addedAt.localeCompare(a.addedAt))
    .slice(0, n);
}

export function runQuery(s: ShopState) {
  const results = filterDiscs(s).sort(sorters[s.sort]);
  const total = results.length;
  const pages = Math.max(1, Math.ceil(total / s.size));
  const page = Math.min(s.page, pages);
  const from = (page - 1) * s.size;
  return { total, pages, page, from, items: results.slice(from, from + s.size) };
}

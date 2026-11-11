"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { PAGE_SIZES, SORTS, activeCount, parseState, runQuery, toQuery, type FacetKey, type ShopState, type SortId } from "@/lib/shop";
import { getLenis } from "@/lib/lenis-instance";
import Filters from "./Filters";
import ResultRow from "./ResultRow";

// Atajos de orden encima del listado ("Ordenar por: Añadido, Estado, Artista…")
const QUICK_SORTS: { id: SortId; label: string }[] = [
  { id: "recientes", label: "Añadido" },
  { id: "estado", label: "Estado" },
  { id: "artista", label: "Artista" },
  { id: "titulo", label: "Título" },
  { id: "precio-asc", label: "Precio" },
];

export default function ShopView() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const state = useMemo(() => parseState(new URLSearchParams(params.toString())), [params]);
  const result = useMemo(() => runQuery(state), [state]);
  const listTop = useRef<HTMLDivElement>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Todo cambio va a la URL (sin recargar ni saltar arriba)
  const go = (next: Partial<ShopState>, resetPage = true) => {
    const merged: ShopState = { ...state, ...next, page: resetPage ? 1 : next.page ?? state.page };
    router.replace(`${pathname}${toQuery(merged)}`, { scroll: false });
  };

  const toggle = (key: FacetKey, value: string) => {
    const cur = state.filters[key];
    go({ filters: { ...state.filters, [key]: cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value] } });
  };
  const clearAll = () => go({ filters: parseState(new URLSearchParams()).filters });

  const goPage = (page: number) => {
    go({ page }, false);
    const el = listTop.current;
    if (!el) return;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(el, { offset: -110 });
    else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 110 });
  };

  // Búsqueda: se escribe libre y se aplica 300 ms después de dejar de teclear
  const [q, setQ] = useState(state.q);
  useEffect(() => setQ(state.q), [state.q]);
  useEffect(() => {
    if (q === state.q) return;
    const t = setTimeout(() => go({ q }), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  // Panel de filtros en móvil: la página de fondo no se mueve mientras está abierto
  useEffect(() => {
    const lenis = getLenis();
    if (filtersOpen) {
      lenis?.stop();
      document.documentElement.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.documentElement.style.overflow = "";
    }
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
    };
  }, [filtersOpen]);

  const nActive = activeCount(state);
  const first = result.total ? result.from + 1 : 0;
  const last = result.from + result.items.length;

  return (
    <section className="textile min-h-screen px-5 pb-24 pt-28 md:px-10 md:pt-32">
      {/* Cabecera */}
      <div className="flex flex-col gap-6 border-b border-bone/15 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-bone/60">Mercado de piezas únicas</p>
          <h1 className="mt-3 whitespace-nowrap font-display text-6xl uppercase leading-[0.85] md:text-7xl xl:text-8xl">
            Tienda <span className="font-serif-i text-4xl normal-case md:text-5xl xl:text-6xl">de acetatos</span>
          </h1>
        </div>
        <label className="flex w-full items-center gap-3 rounded-full border border-bone/30 px-5 py-3 focus-within:border-bone lg:max-w-md">
          <span className="sr-only">Buscar en la tienda</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar artista, título, sello, país…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-bone/35"
          />
          <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-bone/60">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </label>
      </div>

      <div className="mt-10 grid gap-10 md:grid-cols-[240px_1fr] lg:grid-cols-[260px_1fr] lg:gap-14">
        {/* Filtros (escritorio) */}
        <aside className="hidden md:block" aria-label="Filtros">
          <Filters state={state} toggle={toggle} clearAll={clearAll} />
        </aside>

        {/* Resultados */}
        <div ref={listTop} className="min-w-0">
          <h2 className="font-display text-3xl uppercase md:text-4xl">Comprar acetatos y vinilos</h2>

          {/* Barra: conteo, páginas, orden, tamaño */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.15em]">
              <span className="text-bone">
                {first} – {last} de {result.total}
              </span>
              <PrevNext page={result.page} pages={result.pages} goPage={goPage} />
            </div>
            <div className="flex flex-wrap items-center gap-4 font-mono text-[11px] uppercase tracking-[0.15em] text-bone/70">
              <button
                onClick={() => setFiltersOpen(true)}
                className="rounded-full border border-bone/40 px-4 py-2 text-bone md:hidden"
              >
                Filtros{nActive ? ` (${nActive})` : ""}
              </button>
              <label className="flex items-center gap-2">
                <span className="hidden sm:inline">Clasificar</span>
                <select
                  value={state.sort}
                  onChange={(e) => go({ sort: e.target.value as SortId })}
                  className="cursor-pointer border border-bone/30 bg-ink px-3 py-2 text-bone outline-none focus:border-bone"
                >
                  {SORTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-2">
                <span className="hidden sm:inline">Mostrar</span>
                <select
                  value={state.size}
                  onChange={(e) => go({ size: Number(e.target.value) })}
                  className="cursor-pointer border border-bone/30 bg-ink px-3 py-2 text-bone outline-none focus:border-bone"
                >
                  {PAGE_SIZES.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {/* Cabecera de columnas con atajos de orden */}
          <div className="mt-6 hidden grid-cols-[128px_1fr_190px] gap-x-6 bg-bone/[0.06] px-3 py-3 font-mono text-[11px] uppercase tracking-[0.15em] md:grid">
            <span className="text-bone/50">Ordenar por:</span>
            <span className="flex flex-wrap gap-x-4 gap-y-1">
              {QUICK_SORTS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => go({ sort: s.id })}
                  className={`underline-offset-4 hover:underline ${state.sort === s.id ? "text-bone underline" : "text-bone/60"}`}
                >
                  {s.label}
                </button>
              ))}
            </span>
            <span className="text-right text-bone/50">Precio</span>
          </div>

          {result.total === 0 ? (
            <div className="border-b border-bone/15 py-20 text-center">
              <p className="font-display text-3xl uppercase">Ningún disco coincide</p>
              <p className="mt-2 text-sm text-bone/60">Prueba con menos filtros u otra búsqueda.</p>
              <button
                onClick={() => go({ q: "", filters: parseState(new URLSearchParams()).filters })}
                className="mt-6 rounded-full border border-bone px-6 py-3 font-mono text-[10px] uppercase tracking-[0.2em] hover:bg-bone hover:text-ink"
              >
                Ver todo el catálogo
              </button>
            </div>
          ) : (
            <ul>
              {result.items.map((d, i) => (
                <ResultRow key={d.id} d={d} priority={i < 2} />
              ))}
            </ul>
          )}

          {/* Paginación inferior */}
          {result.pages > 1 && (
            <nav aria-label="Páginas" className="mt-10 flex flex-wrap items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em]">
              {Array.from({ length: result.pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => goPage(p)}
                  aria-current={p === result.page ? "page" : undefined}
                  className={`grid h-10 w-10 place-items-center border ${
                    p === result.page ? "border-bone bg-bone text-ink" : "border-bone/30 text-bone/70 hover:border-bone hover:text-bone"
                  }`}
                >
                  {p}
                </button>
              ))}
            </nav>
          )}
        </div>
      </div>

      {/* Filtros (móvil): panel a pantalla completa */}
      {filtersOpen && (
        <div className="fixed inset-0 z-[75] flex flex-col bg-ink md:hidden" role="dialog" aria-modal="true" aria-label="Filtros">
          <div className="flex items-center justify-between border-b border-bone/15 px-5 py-5">
            <p className="font-display text-3xl uppercase">Filtros</p>
            <button onClick={() => setFiltersOpen(false)} className="font-mono text-[11px] uppercase tracking-[0.2em]">
              Cerrar ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-6" data-lenis-prevent>
            <Filters state={state} toggle={toggle} clearAll={clearAll} />
          </div>
          <div className="border-t border-bone/15 p-5">
            <button
              onClick={() => setFiltersOpen(false)}
              className="w-full rounded-full bg-bone py-4 font-mono text-[11px] uppercase tracking-[0.2em] text-ink"
            >
              Ver {result.total} {result.total === 1 ? "disco" : "discos"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function PrevNext({ page, pages, goPage }: { page: number; pages: number; goPage: (p: number) => void }) {
  return (
    <span className="flex items-center gap-3">
      <button
        disabled={page <= 1}
        onClick={() => goPage(page - 1)}
        className="text-bone/70 hover:text-bone disabled:opacity-30"
      >
        ‹ Anterior
      </button>
      <button
        disabled={page >= pages}
        onClick={() => goPage(page + 1)}
        className="text-bone hover:underline disabled:opacity-30"
      >
        Siguiente ›
      </button>
    </span>
  );
}

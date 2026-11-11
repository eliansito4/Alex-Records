"use client";
import { discs, type Disc } from "@/data/catalog";
import { useCart } from "@/lib/cart";
import DiscImage from "./DiscImage";
import { CurrencySwitch, Price } from "./Price";

// Tarjeta estática: sin animaciones (antes había entrada, inclinación 3D, reflejo
// y disco deslizante en cada tarjeta, y con 40 discos la página iba lenta).
function Card({ r, i }: { r: Disc; i: number }) {
  const { add, items, setOpen } = useCart();
  const inCart = items.some((p) => p.id === r.id);

  return (
    <article>
      <div className="relative aspect-square overflow-hidden border border-bone/20 bg-ink">
        <DiscImage
          disc={r}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
          priority={i < 3}
        />
        <div className="absolute inset-x-0 bottom-0 bg-ink p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone/60">
            {r.genre} · {r.year} · {r.format}
          </p>
          <p className="mt-1 font-display text-2xl uppercase leading-none">{r.title}</p>
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm text-bone/90">{r.artist}</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone/50">
            {r.city}, {r.country} — {r.label} · {r.catNo}
          </p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-bone/50">
            Disco {r.media} · Funda {r.sleeve}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <Price eur={r.price} className="block font-display text-2xl" />
          <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-bone/50">
            + <Price eur={r.shipping} /> envío
          </p>
          <button
            onClick={() => (inCart ? setOpen(true) : add(r))}
            data-cursor={inCart ? "ver" : "+"}
            className={`mt-2 rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors duration-200 ${
              inCart ? "border-bone bg-bone text-ink" : "border-bone/40 hover:border-bone hover:bg-bone hover:text-ink"
            }`}
          >
            {inCart ? "En el carrito ✓" : "Añadir"}
          </button>
        </div>
      </div>
    </article>
  );
}

// Catálogo de la tienda. La versión completa (filtros, búsqueda, paginación) llega en el módulo 3.
export default function Products() {
  return (
    <section className="textile relative px-5 pb-28 pt-36 md:px-10 md:pb-40 md:pt-48">
      <div className="mb-16 flex flex-col justify-between gap-6 md:mb-24 md:flex-row md:items-end">
        <h1 className="font-display text-[17vw] uppercase leading-[0.82] tracking-tightest md:text-[10vw]">
          Tienda
          <br />
          <span className="font-serif-i normal-case tracking-normal">acetatos únicos</span>
        </h1>
        <div className="flex max-w-xs flex-col gap-6">
          <p className="text-sm leading-relaxed text-bone/70">
            Cada acetato existe una sola vez. Al añadirlo, queda reservado 30 minutos para ti con certificado de procedencia incluido.
          </p>
          <CurrencySwitch />
        </div>
      </div>
      <div className="grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
        {discs.map((r, i) => (
          <Card key={r.id} r={r} i={i} />
        ))}
      </div>
    </section>
  );
}

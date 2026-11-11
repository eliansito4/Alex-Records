"use client";
import { GRADE_INFO, type Disc, type SleeveGrade } from "@/data/catalog";
import { useCart } from "@/lib/cart";
import DiscImage from "../DiscImage";
import { Price } from "../Price";

const sleeveText = (s: SleeveGrade) => (s in GRADE_INFO ? GRADE_INFO[s as keyof typeof GRADE_INFO].label : s);

// Fila del listado: foto · datos del disco · precio y botón.
export default function ResultRow({ d, priority = false }: { d: Disc; priority?: boolean }) {
  const { add, items, setOpen } = useCart();
  const inCart = items.some((p) => p.id === d.id);

  return (
    <li className="grid grid-cols-[88px_1fr] gap-x-4 gap-y-4 border-b border-bone/15 py-6 sm:grid-cols-[112px_1fr] md:grid-cols-[128px_1fr_190px] md:gap-x-6">
      {/* Foto */}
      <div>
        <div className="relative aspect-square overflow-hidden bg-ink">
          <DiscImage disc={d} sizes="(min-width: 768px) 128px, 112px" priority={priority} />
        </div>
        <p className="mt-2 hidden font-mono text-[9px] uppercase leading-relaxed tracking-[0.12em] text-bone/45 sm:block">
          Pieza única
          <br />
          {d.format === "Acetato" || d.format === "Test pressing" ? "Con certificado" : "Revisado"}
        </p>
      </div>

      {/* Datos */}
      <div className="min-w-0">
        <h2 className="text-base font-medium leading-snug text-bone md:text-lg">
          {d.artist} — {d.title} <span className="text-bone/55">({d.formatDetail})</span>
        </h2>
        <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[13px] leading-relaxed">
          <dt className="text-bone/50">Sello:</dt>
          <dd className="text-bone/85">{d.label}</dd>
          <dt className="text-bone/50">Cat. n.º:</dt>
          <dd className="font-mono text-[12px] text-bone/85">{d.catNo}</dd>
          <dt className="text-bone/50">Estado del disco:</dt>
          <dd className="text-bone/85">
            {GRADE_INFO[d.media].label}{" "}
            <abbr title={GRADE_INFO[d.media].detail} className="cursor-help font-mono text-[11px] text-bone/50 no-underline">
              ⓘ
            </abbr>
          </dd>
          <dt className="text-bone/50">Funda:</dt>
          <dd className="text-bone/85">{sleeveText(d.sleeve)}</dd>
          <dt className="text-bone/50">Origen:</dt>
          <dd className="text-bone/85">
            {d.city}, {d.country} · {d.year} · {d.genre}
          </dd>
        </dl>
        {d.notes && <p className="mt-2 max-w-xl text-[13px] italic leading-relaxed text-bone/65">{d.notes}</p>}
      </div>

      {/* Precio y compra */}
      <div className="col-span-2 flex items-center justify-between gap-4 md:col-span-1 md:flex-col md:items-end md:justify-start md:text-right">
        <div>
          <Price eur={d.price} className="block font-display text-3xl leading-none" />
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-bone/55">
            + <Price eur={d.shipping} /> envío
          </p>
        </div>
        <button
          onClick={() => (inCart ? setOpen(true) : add(d))}
          data-cursor={inCart ? "ver" : "+"}
          className={`shrink-0 rounded-full border px-5 py-3 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors duration-200 md:mt-3 ${
            inCart ? "border-bone bg-transparent text-bone" : "border-bone bg-bone text-ink hover:bg-transparent hover:text-bone"
          }`}
        >
          {inCart ? "En el carrito ✓" : "Añadir al carrito"}
        </button>
      </div>
    </li>
  );
}

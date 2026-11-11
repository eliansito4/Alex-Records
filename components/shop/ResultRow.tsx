"use client";
import Link from "next/link";
import { GRADE_INFO, type Disc, type SleeveGrade } from "@/data/catalog";
import DiscImage from "../DiscImage";
import { Price } from "../Price";
import AddToCart from "./AddToCart";

const sleeveText = (s: SleeveGrade) => (s in GRADE_INFO ? GRADE_INFO[s as keyof typeof GRADE_INFO].label : s);

// Fila del listado: foto · datos del disco · precio y botón. Foto y título llevan a la ficha.
export default function ResultRow({ d, priority = false }: { d: Disc; priority?: boolean }) {
  const href = `/tienda/${d.id}`;

  return (
    <li className="grid grid-cols-[88px_1fr] gap-x-4 gap-y-4 border-b border-bone/15 py-6 sm:grid-cols-[112px_1fr] md:grid-cols-[128px_1fr_190px] md:gap-x-6">
      {/* Foto */}
      <div>
        <Link href={href} tabIndex={-1} aria-hidden className="relative block aspect-square overflow-hidden bg-ink" data-cursor="ver">
          <DiscImage disc={d} sizes="(min-width: 768px) 128px, 112px" priority={priority} />
        </Link>
        <p className="mt-2 hidden font-mono text-[9px] uppercase leading-relaxed tracking-[0.12em] text-bone/45 sm:block">
          Pieza única
          <br />
          {d.format === "Acetato" || d.format === "Test pressing" ? "Con certificado" : "Revisado"}
        </p>
      </div>

      {/* Datos */}
      <div className="min-w-0">
        <h2 className="text-base font-medium leading-snug text-bone md:text-lg">
          <Link href={href} className="underline-offset-4 hover:underline" data-cursor="ver">
            {d.artist} — {d.title}
          </Link>{" "}
          <span className="text-bone/55">({d.formatDetail})</span>
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
        <Link
          href={href}
          className="mt-2 inline-block text-[13px] text-bone/70 underline underline-offset-4 hover:text-bone"
          data-cursor="ver"
        >
          Ver ficha del disco
        </Link>
      </div>

      {/* Precio y compra */}
      <div className="col-span-2 flex items-center justify-between gap-4 md:col-span-1 md:flex-col md:items-end md:justify-start md:text-right">
        <div>
          <Price eur={d.price} className="block font-display text-3xl leading-none" />
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-bone/55">
            + <Price eur={d.shipping} /> envío
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 md:mt-3">
          <AddToCart disc={d} />
          <Link href={href} className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-bone/70 hover:text-bone md:block" data-cursor="ver">
            Detalles →
          </Link>
        </div>
      </div>
    </li>
  );
}

"use client";
import Link from "next/link";
import { pages } from "@/lib/nav";

// Pie común a todas las páginas. El formulario de la lista privada vive en /contacto.
export default function Footer() {
  return (
    <footer className="textile relative overflow-hidden border-t border-bone/15 px-5 pb-10 pt-20 md:px-10 md:pt-28">
      <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
        <nav className="flex flex-col gap-2" aria-label="Páginas">
          {pages.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              data-cursor="ir"
              className="w-fit font-display text-4xl uppercase leading-none text-bone/80 transition-colors hover:text-bone md:text-5xl"
            >
              {p.label}
            </Link>
          ))}
        </nav>
        <p className="max-w-xs text-sm leading-relaxed text-bone/60">
          Management e importación de <span className="font-serif-i text-base text-bone">acetatos africanos</span>. Envíos
          asegurados a todo el mundo con certificado de procedencia.
        </p>
      </div>

      <div className="mt-20 select-none font-display text-[27vw] uppercase leading-[0.75] tracking-tightest" aria-hidden>
        Alex<span className="outline-text">Rec</span>
      </div>
      <div className="mt-8 flex flex-col justify-between gap-4 border-t border-bone/15 pt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-bone/50 md:flex-row">
        <span>© 2026 Alex Records</span>
        <span>Instagram · Discogs · Bandcamp</span>
        <span>Envíos asegurados a todo el mundo</span>
      </div>
    </footer>
  );
}

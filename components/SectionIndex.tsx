"use client";
import Link from "next/link";
import { pages } from "@/lib/nav";

// Índice de secciones en la página de inicio: cada fila lleva a su página.
export default function SectionIndex() {
  return (
    <section data-nav="light" className="textile-light px-5 py-24 text-ink md:px-10 md:py-32">
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink/60">Explora</p>
      <ul className="mt-10 border-t border-ink/15">
        {pages.map((p, i) => (
          <li key={p.href} className="border-b border-ink/15">
            <Link
              href={p.href}
              data-cursor="ir"
              className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 py-6 md:grid-cols-[6rem_1fr_minmax(0,22rem)_auto] md:gap-10 md:py-8"
            >
              <span className="font-mono text-[11px] text-ink/50">0{i + 1}</span>
              <span className="font-display text-5xl uppercase leading-none transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] md:text-8xl md:group-hover:translate-x-4">
                {p.label}
              </span>
              <span className="hidden text-sm leading-relaxed text-ink/70 md:block">{p.blurb}</span>
              <span className="font-display text-3xl md:text-5xl">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

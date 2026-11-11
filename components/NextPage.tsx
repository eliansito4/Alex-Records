"use client";
import Link from "next/link";

// Bloque al final de cada página que invita a la siguiente sección.
export default function NextPage({ href, label, light = false }: { href: string; label: string; light?: boolean }) {
  return (
    <section
      data-nav={light ? "light" : undefined}
      className={`${light ? "textile-light text-ink" : "textile text-bone"} px-5 py-24 md:px-10 md:py-32`}
    >
      <Link href={href} data-cursor="ir" className="group block">
        <span className={`font-mono text-[11px] uppercase tracking-[0.3em] ${light ? "text-ink/60" : "text-bone/60"}`}>Siguiente</span>
        <span className="mt-4 flex items-end justify-between gap-6">
          <span className="font-display text-[18vw] uppercase leading-[0.82] tracking-tightest md:text-[11vw]">{label}</span>
          <span className="mb-[2vw] font-display text-[10vw] leading-none transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-3 md:text-[6vw]">
            →
          </span>
        </span>
      </Link>
    </section>
  );
}

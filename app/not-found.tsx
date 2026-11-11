import Link from "next/link";

// Página 404: dirección que no existe o disco retirado del catálogo
export default function NotFound() {
  return (
    <section className="textile flex min-h-screen flex-col items-center justify-center px-5 py-32 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-bone/60">Error 404</p>
      <h1 className="mt-6 font-display text-[28vw] leading-[0.8] tracking-tightest md:text-[16vw]">
        4<span className="outline-text">0</span>4
      </h1>
      <p className="mt-6 font-serif-i text-3xl md:text-4xl">Este surco está vacío.</p>
      <p className="mt-3 max-w-sm text-sm text-bone/60">
        La página no existe o el disco ya encontró dueño. Cada acetato es una pieza única.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link href="/tienda" className="rounded-full bg-bone px-8 py-4 font-mono text-[11px] uppercase tracking-[0.2em] text-ink">
          Ir a la tienda
        </Link>
        <Link href="/" className="rounded-full border border-bone/40 px-8 py-4 font-mono text-[11px] uppercase tracking-[0.2em] hover:border-bone">
          Volver al inicio
        </Link>
      </div>
    </section>
  );
}

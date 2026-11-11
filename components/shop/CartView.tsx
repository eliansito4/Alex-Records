"use client";
import Link from "next/link";
import { GRADE_INFO } from "@/data/catalog";
import { useCart } from "@/lib/cart";
import { formatEUR, useCurrency } from "@/lib/currency";
import DiscImage from "../DiscImage";
import { CurrencySwitch, Price } from "../Price";

export default function CartView() {
  const { items, ready, remove, clear, subtotal, shipping, total } = useCart();
  const { currency } = useCurrency();

  return (
    <section className="textile min-h-screen px-5 pb-24 pt-28 md:px-10 md:pt-32">
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-bone/15 pb-8">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-bone/60">Tu selección</p>
          <h1 className="mt-3 font-display text-6xl uppercase leading-[0.85] md:text-8xl">Carrito</h1>
        </div>
        {ready && items.length > 0 && (
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone/60">
            {items.length} {items.length === 1 ? "pieza única" : "piezas únicas"}
          </p>
        )}
      </div>

      {!ready ? (
        <div className="py-24" aria-busy="true" />
      ) : items.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-display text-4xl uppercase md:text-5xl">Tu carrito está vacío</p>
          <p className="mt-3 text-sm text-bone/60">Cada acetato existe una sola vez. Cuando encuentres el tuyo, aparecerá aquí.</p>
          <Link
            href="/tienda"
            className="mt-8 inline-block rounded-full bg-bone px-8 py-4 font-mono text-[11px] uppercase tracking-[0.2em] text-ink"
          >
            Ir a la tienda
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-16">
          {/* Piezas */}
          <div>
            <ul>
              {items.map((d) => (
                <li key={d.id} className="grid grid-cols-[88px_1fr_auto] gap-4 border-b border-bone/15 py-6 sm:grid-cols-[112px_1fr_auto] sm:gap-6">
                  <Link href={`/tienda/${d.id}`} className="relative block aspect-square overflow-hidden bg-ink" tabIndex={-1} aria-hidden>
                    <DiscImage disc={d} sizes="112px" />
                  </Link>
                  <div className="min-w-0">
                    <p className="text-sm text-bone/70">{d.artist}</p>
                    <Link href={`/tienda/${d.id}`} className="font-display text-2xl uppercase leading-tight underline-offset-4 hover:underline md:text-3xl">
                      {d.title}
                    </Link>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-bone/50">
                      {d.formatDetail} · {d.label} {d.catNo}
                    </p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-bone/50">
                      Disco {GRADE_INFO[d.media].label} · Envío <Price eur={d.shipping} />
                    </p>
                  </div>
                  <div className="flex flex-col items-end justify-between gap-3 text-right">
                    <Price eur={d.price} className="font-display text-2xl md:text-3xl" />
                    <button
                      onClick={() => remove(d.id)}
                      className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone/50 underline-offset-4 hover:text-bone hover:underline"
                    >
                      Quitar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <Link href="/tienda" className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone/70 hover:text-bone">
                ← Seguir comprando
              </Link>
              <button onClick={clear} className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone/50 hover:text-bone">
                Vaciar carrito
              </button>
            </div>
          </div>

          {/* Resumen */}
          <aside className="h-fit border border-bone/20 p-6 md:p-8 lg:sticky lg:top-28" aria-label="Resumen del pedido">
            <h2 className="font-display text-3xl uppercase">Resumen</h2>
            <CurrencySwitch className="mt-5" />
            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-bone/60">Subtotal ({items.length})</dt>
                <dd><Price eur={subtotal} /></dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-bone/60">
                  Envío asegurado
                  <span className="block text-[11px] text-bone/40">Todo en un solo paquete</span>
                </dt>
                <dd><Price eur={shipping} /></dd>
              </div>
            </dl>
            <div className="mt-6 flex items-end justify-between gap-4 border-t border-bone/20 pt-6">
              <span className="font-display text-2xl uppercase">Total</span>
              <Price eur={total} className="font-display text-4xl leading-none" />
            </div>
            {currency === "COP" && (
              <p className="mt-2 text-right font-mono text-[10px] uppercase tracking-[0.15em] text-bone/50">Se cobra en euros: {formatEUR(total)}</p>
            )}
            <button
              disabled
              className="mt-8 w-full cursor-not-allowed rounded-full bg-bone py-5 font-mono text-[11px] uppercase tracking-[0.25em] text-ink opacity-40"
            >
              Finalizar compra
            </button>
            <p className="mt-3 text-center text-[12px] text-bone/50">El pago en línea estará disponible muy pronto.</p>
            <ul className="mt-8 space-y-2 border-t border-bone/15 pt-6 text-[12px] text-bone/60">
              <li>✶ Certificado de procedencia en acetatos y test pressings</li>
              <li>✶ Embalaje rígido y seguro por el valor total</li>
              <li>✶ Cada pieza digitalizada antes del envío</li>
            </ul>
          </aside>
        </div>
      )}
    </section>
  );
}

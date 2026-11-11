"use client";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useCart } from "@/lib/cart";
import { CurrencySwitch, Price } from "./Price";
import DiscImage from "./DiscImage";
import { getLenis } from "./SmoothScroll";

// Carrito lateral (vista rápida). El detalle completo está en /carrito.
export default function CartDrawer() {
  const { items, open, setOpen, remove, subtotal, shipping, total } = useCart();
  const pathname = usePathname();

  // Se cierra al cambiar de página
  useEffect(() => setOpen(false), [pathname, setOpen]);

  // La página de fondo no se desplaza mientras el carrito está abierto
  useEffect(() => {
    if (!open) return;
    const lenis = getLenis();
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            // En móvil, solo oscurecido (el desenfoque de fondo es muy costoso allí)
            className="fixed inset-0 z-[80] bg-ink/80 md:bg-ink/70 md:backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Carrito"
            className="fixed right-0 top-0 z-[90] flex h-full w-full max-w-md flex-col bg-bone p-6 text-ink md:p-8"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 34 }}
          >
            <div className="flex items-center justify-between">
              <h4 className="font-display text-4xl uppercase">Carrito</h4>
              <button onClick={() => setOpen(false)} className="font-mono text-[11px] uppercase tracking-[0.2em]" data-cursor="cerrar">
                Cerrar ✕
              </button>
            </div>
            <div className="mt-8 flex-1 space-y-5 overflow-y-auto overscroll-contain" data-lenis-prevent>
              {items.length === 0 && (
                <div>
                  <p className="text-ink/60">Aún no has elegido ningún acetato.</p>
                  <Link href="/tienda" className="mt-4 inline-block font-mono text-[11px] uppercase tracking-[0.2em] underline underline-offset-4">
                    Ir a la tienda →
                  </Link>
                </div>
              )}
              <AnimatePresence initial={false}>
                {items.map((r) => (
                  <motion.div
                    key={r.id}
                    layout
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    className="flex items-center gap-4 border-b border-ink/15 pb-5"
                  >
                    <Link href={`/tienda/${r.id}`} className="relative h-16 w-16 shrink-0 overflow-hidden bg-ink" tabIndex={-1} aria-hidden>
                      <DiscImage disc={r} sizes="64px" />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link href={`/tienda/${r.id}`} className="font-display text-xl uppercase leading-none hover:underline">
                        {r.title}
                      </Link>
                      <p className="mt-1 text-xs text-ink/60">{r.artist}</p>
                      <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.15em] text-ink/40">
                        {r.formatDetail} · {r.catNo}
                      </p>
                    </div>
                    <div className="text-right">
                      <Price eur={r.price} className="block font-display text-lg" />
                      <button onClick={() => remove(r.id)} className="font-mono text-[10px] uppercase tracking-widest text-ink/50 hover:text-ink">
                        Quitar
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div className="border-t border-ink pt-6">
              <CurrencySwitch tone="light" className="mb-6" />
              {items.length > 0 && (
                <dl className="mb-3 space-y-1 font-mono text-[11px] uppercase tracking-[0.15em] text-ink/60">
                  <div className="flex justify-between">
                    <dt>Subtotal</dt>
                    <dd><Price eur={subtotal} /></dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Envío (un solo paquete)</dt>
                    <dd><Price eur={shipping} /></dd>
                  </div>
                </dl>
              )}
              <div className="flex justify-between font-display text-3xl">
                <span>Total</span>
                <Price eur={total} />
              </div>
              {items.length > 0 ? (
                <Link
                  href="/carrito"
                  className="mt-6 block w-full rounded-full bg-ink py-5 text-center font-mono text-[11px] uppercase tracking-[0.25em] text-bone"
                >
                  Ver carrito y pagar
                </Link>
              ) : (
                <span className="mt-6 block w-full rounded-full bg-ink py-5 text-center font-mono text-[11px] uppercase tracking-[0.25em] text-bone opacity-30">
                  Ver carrito y pagar
                </span>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

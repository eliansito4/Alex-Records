"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/lib/cart";
import { CurrencySwitch, Price } from "./Price";
import DiscImage from "./DiscImage";

export default function CartDrawer() {
  const { items, open, setOpen, remove, subtotal, shipping, total } = useCart();
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
            className="fixed right-0 top-0 z-[90] flex h-full w-full max-w-md flex-col bg-bone p-8 text-ink"
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
            <div className="mt-10 flex-1 space-y-5 overflow-y-auto">
              {items.length === 0 && <p className="text-ink/60">Aún no has elegido ningún acetato.</p>}
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
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-ink">
                      <DiscImage disc={r} sizes="64px" />
                    </div>
                    <div className="flex-1">
                      <p className="font-display text-xl uppercase leading-none">{r.title}</p>
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
              <button
                disabled={!items.length}
                className="mt-6 w-full rounded-full bg-ink py-5 font-mono text-[11px] uppercase tracking-[0.25em] text-bone transition-opacity disabled:opacity-30"
              >
                Finalizar compra
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";

export default function Nav() {
  const { items, setOpen } = useCart();
  // En móvil no hay mix-blend-difference (es caro de componer): el color del texto
  // cambia a tinta cuando la barra pasa sobre una sección clara.
  const [onLight, setOnLight] = useState(false);

  useEffect(() => {
    // IntersectionObserver sobre una franja de 1px a la altura de la barra (y = 40px):
    // no guarda posiciones, así que no se descuadra si cambian las alturas.
    const els = document.querySelectorAll("[data-nav='light']");
    let io: IntersectionObserver | null = null;
    const active = new Set<Element>();
    const build = () => {
      io?.disconnect();
      active.clear();
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => (e.isIntersecting ? active.add(e.target) : active.delete(e.target)));
          setOnLight(active.size > 0);
        },
        { rootMargin: `-40px 0px -${Math.max(window.innerHeight - 41, 0)}px 0px` }
      );
      els.forEach((el) => io!.observe(el));
    };
    build();
    window.addEventListener("resize", build);
    return () => {
      window.removeEventListener("resize", build);
      io?.disconnect();
    };
  }, []);

  return (
    <header
      className={`intro-nav fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-5 transition-colors duration-300 md:px-10 md:text-bone md:mix-blend-difference ${
        onLight ? "text-ink" : "text-bone"
      }`}
    >
      <a href="#" className="font-display text-xl uppercase tracking-wide" data-cursor="inicio">
        Alex<span className="font-serif-i normal-case"> Records</span>
      </a>
      <nav className="hidden gap-8 font-mono text-[11px] uppercase tracking-[0.2em] md:flex">
        {[
          ["Historia", "#historia"],
          ["Catálogo", "#catalogo"],
          ["Management", "#management"],
          ["Contacto", "#contacto"],
        ].map(([l, h]) => (
          <a key={h} href={h} className="group relative" data-cursor="ir">
            {l}
            <span className="absolute -bottom-1 left-0 h-px w-0 bg-bone transition-all duration-500 group-hover:w-full" />
          </a>
        ))}
      </nav>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em]"
        data-cursor="ver"
      >
        Carrito
        <span className="relative grid h-6 w-6 place-items-center overflow-hidden rounded-full border border-current">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={items.length}
              initial={{ y: 14 }}
              animate={{ y: 0 }}
              exit={{ y: -14 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {items.length}
            </motion.span>
          </AnimatePresence>
        </span>
      </button>
    </header>
  );
}

"use client";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState } from "react";
import { records, type Record } from "@/data/records";
import { useCart } from "@/lib/cart";

// Portadas generativas en blanco y negro — cada una con un patrón geométrico distinto
const sleevePatterns = [
  "repeating-linear-gradient(45deg,#0a0a0a 0 14px,#f4f1ea 14px 28px)",
  "repeating-radial-gradient(circle at 30% 70%,#0a0a0a 0 10px,#f4f1ea 10px 20px)",
  "conic-gradient(from 45deg,#0a0a0a 0 25%,#f4f1ea 0 50%,#0a0a0a 0 75%,#f4f1ea 0) 0 0/56px 56px",
  "repeating-linear-gradient(0deg,#0a0a0a 0 6px,#f4f1ea 6px 9px,#0a0a0a 9px 22px,#f4f1ea 22px 40px)",
  "radial-gradient(circle,#0a0a0a 28%,transparent 30%) 0 0/34px 34px,#f4f1ea",
  "repeating-linear-gradient(-60deg,#f4f1ea 0 3px,#0a0a0a 3px 18px)",
];

function Card({ r, i }: { r: Record; i: number }) {
  const { add, items, setOpen } = useCart();
  const inCart = items.some((p) => p.id === r.id);
  const [hover, setHover] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  // Springs críticamente amortiguados: la inclinación sigue al puntero sin rebote
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 28 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 200, damping: 28 });
  const glare = useTransform(
    mx,
    (v) => `linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.35) ${(v + 0.5) * 100}%, transparent 70%)`
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay: (i % 3) * 0.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <motion.div
        data-cursor={inCart ? "en carrito" : "girar"}
        // Inclinación, reflejo y disco que sale: solo con ratón (en táctil no hay hover)
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse") return;
          const b = e.currentTarget.getBoundingClientRect();
          mx.set((e.clientX - b.left) / b.width - 0.5);
          my.set((e.clientY - b.top) / b.height - 0.5);
        }}
        onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
        onPointerLeave={() => {
          setHover(false);
          mx.set(0);
          my.set(0);
        }}
        style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
        className="relative aspect-square"
      >
        {/* Disco que sale de la funda */}
        <motion.div
          className="vinyl absolute inset-[6%]"
          animate={{ x: hover ? "34%" : "0%", rotate: hover ? 200 : 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 22 }}
        >
          <div className="absolute inset-[34%] grid place-items-center rounded-full bg-bone text-center">
            <span className="font-display text-[10px] leading-tight text-ink">
              ALEX
              <br />
              RECORDS
            </span>
          </div>
        </motion.div>

        {/* Funda */}
        <div className="absolute inset-0 overflow-hidden border border-bone/20 shadow-2xl" style={{ background: sleevePatterns[i % sleevePatterns.length] }}>
          <div className="absolute inset-x-0 bottom-0 bg-ink p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone/60">{r.genre} · {r.year}</p>
            <p className="mt-1 font-display text-2xl uppercase leading-none">{r.title}</p>
          </div>
          {/* Reflejo de vidrio que sigue al puntero */}
          <motion.div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: glare }}
          />
        </div>
      </motion.div>

      {/* Reflejo en el suelo */}
      <div
        aria-hidden
        className="h-16 scale-y-[-1] opacity-25 blur-[1px] [mask-image:linear-gradient(to_top,black,transparent)]"
        style={{ background: sleevePatterns[i % sleevePatterns.length] }}
      />

      <div className="-mt-10 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm text-bone/90">{r.artist}</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone/50">{r.origin} — {r.pressing}</p>
        </div>
        <div className="text-right">
          <p className="font-display text-2xl">US${r.price}</p>
          <motion.button
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 500, damping: 45 }}
            onClick={() => (inCart ? setOpen(true) : add(r))}
            data-cursor={inCart ? "ver" : "+"}
            className={`mt-2 rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors duration-300 ${
              inCart ? "border-bone bg-bone text-ink" : "border-bone/40 hover:border-bone hover:bg-bone hover:text-ink"
            }`}
          >
            {inCart ? "En el carrito ✓" : "Añadir"}
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}

export default function Products() {
  return (
    <section id="catalogo" className="textile relative px-5 py-28 md:px-10 md:py-40">
      <div className="mb-16 flex flex-col justify-between gap-6 md:mb-24 md:flex-row md:items-end">
        <h2 className="font-display text-[17vw] uppercase leading-[0.82] tracking-tightest md:text-[10vw]">
          Piezas
          <br />
          <span className="font-serif-i normal-case tracking-normal">únicas</span>
        </h2>
        <p className="max-w-xs text-sm leading-relaxed text-bone/70">
          Cada acetato existe una sola vez. Al añadirlo, queda reservado 30 minutos para ti con certificado de procedencia incluido.
        </p>
      </div>
      <div className="grid gap-x-10 gap-y-20 sm:grid-cols-2 lg:grid-cols-3">
        {records.map((r, i) => (
          <Card key={r.id} r={r} i={i} />
        ))}
      </div>
    </section>
  );
}

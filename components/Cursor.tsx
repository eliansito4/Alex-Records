"use client";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { scrollState } from "@/lib/scroll";

// Springs críticamente amortiguados (damping = 2·√stiffness): llegan sin rebote.
const follow = { stiffness: 500, damping: 45 };
const grow = { type: "spring" as const, stiffness: 300, damping: 35 };

export default function Cursor() {
  // En táctil no existe: ni se monta ni escucha eventos
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine) and (min-width: 768px)");
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return fine ? <CursorDot /> : null;
}

function CursorDot() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, follow);
  const sy = useSpring(y, follow);
  const [hover, setHover] = useState<string | null>(null);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      scrollState.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      scrollState.mouseY = (e.clientY / window.innerHeight) * 2 - 1;
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor]");
      const next = el ? el.dataset.cursor || "" : null;
      // Solo re-renderiza cuando cambia la etiqueta, no en cada movimiento
      setHover((prev) => (prev === next ? prev : next));
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);

  return (
    <motion.div
      aria-hidden
      // z-[100]: por encima de todo (carrito z-90, menús y paneles); con mix-blend-difference
      // se ve claro sobre fondos oscuros y oscuro sobre el blanco hueso del carrito
      className="pointer-events-none fixed left-0 top-0 z-[100] flex items-center justify-center rounded-full bg-bone font-mono text-[10px] uppercase tracking-widest text-ink mix-blend-difference"
      style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
      animate={{ width: hover !== null ? 88 : 12, height: hover !== null ? 88 : 12 }}
      transition={grow}
    >
      {hover ? <span className="text-ink">{hover}</span> : null}
    </motion.div>
  );
}

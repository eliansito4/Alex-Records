"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import Magnetic from "./Magnetic";

export default function Footer() {
  const [sent, setSent] = useState(false);
  return (
    <footer id="contacto" className="textile relative overflow-hidden px-5 pb-10 pt-28 md:px-10 md:pt-40">
      <div className="grid gap-16 md:grid-cols-2">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-bone/60">Lista privada</p>
          <h3 className="mt-6 font-display text-6xl uppercase leading-[0.9] md:text-8xl">
            Primero
            <br />
            <span className="font-serif-i normal-case">en escuchar</span>
          </h3>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="flex flex-col justify-end gap-6"
        >
          <p className="max-w-sm text-sm text-bone/70">
            Recibe los nuevos acetatos 48 horas antes de que lleguen al catálogo público.
          </p>
          <div className="flex items-center gap-4 border-b border-bone/30 pb-3 focus-within:border-bone">
            <input
              type="email"
              required
              placeholder="tu@correo.com"
              className="w-full bg-transparent text-xl outline-none placeholder:text-bone/30 md:text-2xl"
            />
            <Magnetic>
              <motion.button whileTap={{ scale: 0.9 }} transition={{ type: "spring", stiffness: 500, damping: 45 }} data-cursor="enviar" className="grid h-14 w-14 place-items-center rounded-full bg-bone text-xl text-ink">
                {sent ? "✓" : "→"}
              </motion.button>
            </Magnetic>
          </div>
          {sent && <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone/70">Estás dentro. Te escribiremos pronto.</p>}
        </form>
      </div>

      <div className="mt-32 select-none font-display text-[27vw] uppercase leading-[0.75] tracking-tightest">
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

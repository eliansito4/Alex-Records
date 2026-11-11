"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import Magnetic from "./Magnetic";

// Formulario de la lista privada (aún no conectado a ningún servicio).
export default function ContactSection() {
  const [sent, setSent] = useState(false);
  return (
    <section className="textile relative overflow-hidden px-5 pb-24 pt-36 md:px-10 md:pb-32 md:pt-48">
      <div className="grid gap-16 md:grid-cols-2">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-bone/60">Lista privada</p>
          <h1 className="mt-6 font-display text-6xl uppercase leading-[0.9] md:text-8xl">
            Primero
            <br />
            <span className="font-serif-i normal-case">en escuchar</span>
          </h1>
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
              aria-label="Correo electrónico"
              className="w-full bg-transparent text-xl outline-none placeholder:text-bone/30 md:text-2xl"
            />
            <Magnetic>
              <motion.button
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 500, damping: 45 }}
                data-cursor="enviar"
                aria-label="Enviar"
                className="grid h-14 w-14 place-items-center rounded-full bg-bone text-xl text-ink"
              >
                {sent ? "✓" : "→"}
              </motion.button>
            </Magnetic>
          </div>
          {sent && <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone/70">Estás dentro. Te escribiremos pronto.</p>}
        </form>
      </div>

      <div className="mt-24 grid gap-10 border-t border-bone/15 pt-10 font-mono text-[11px] uppercase tracking-[0.2em] text-bone/60 md:grid-cols-3">
        <div>
          <p className="text-bone/40">Escríbenos</p>
          <p className="mt-2 text-bone">hola@alexrecords.example</p>
        </div>
        <div>
          <p className="text-bone/40">Envíos</p>
          <p className="mt-2 text-bone">Asegurados a todo el mundo</p>
        </div>
        <div>
          <p className="text-bone/40">Artistas y herederos</p>
          <p className="mt-2 text-bone">Management y derechos</p>
        </div>
      </div>
    </section>
  );
}

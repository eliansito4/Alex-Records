"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollState } from "@/lib/scroll";
import Magnetic from "./Magnetic";

// La escena 3D se pide en cuanto se ejecuta este módulo, en paralelo a la entrada del titular.
const loadScene = () => import("./VinylScene");

const VinylScene = dynamic(loadScene, {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center">
      <div className="vinyl h-64 w-64 animate-spin [animation-duration:4s]" />
    </div>
  ),
});

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    loadScene();
  }, []);

  // Pausa el render 3D cuando el héroe sale de pantalla
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (s) => (scrollState.hero = s.progress),
      });
      gsap.to(".hero-title", {
        yPercent: -40,
        opacity: 0.15,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="textile relative h-[100svh] min-h-[640px] w-full overflow-hidden">
      {/* Titular gigante detrás del disco — la entrada es CSS (ver .intro-line en globals.css) */}
      <div className="hero-title pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        {["ALEX", "RECORDS"].map((w, i) => (
          <div key={w} className="overflow-hidden">
            <h1
              style={{ animationDelay: `${0.2 + i * 0.12}s` }}
              className={`intro-line font-display text-[24vw] leading-[0.82] tracking-tightest md:text-[19vw] ${i ? "outline-text" : ""}`}
            >
              {w}
            </h1>
          </div>
        ))}
      </div>

      <div className="scene-in absolute inset-0">
        <VinylScene active={visible} />
      </div>

      {/* Pie del héroe */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-6 px-5 pb-8 md:flex-row md:items-end md:justify-between md:px-10 md:pb-10">
        <p style={{ animationDelay: "1.1s" }} className="intro-fade max-w-sm text-sm leading-relaxed text-bone/80">
          Management e importación de <span className="font-serif-i text-lg text-bone">acetatos africanos</span> —
          primeros cortes, test pressings y grabaciones que nunca llegaron a las tiendas.
        </p>
        <div style={{ animationDelay: "1.3s" }} className="intro-fade flex items-center gap-6">
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.25em] text-bone/60 md:block">
            Lagos · Accra · Addis · Bamako
          </span>
          <Magnetic>
            <a
              href="#catalogo"
              data-cursor="abrir"
              className="group relative inline-flex overflow-hidden rounded-full bg-bone px-7 py-4 font-mono text-[11px] uppercase tracking-[0.2em] text-ink"
            >
              <span className="relative z-10 transition-colors duration-500 group-hover:text-bone">Explorar catálogo</span>
              <span className="absolute inset-0 translate-y-full rounded-full bg-ink transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-y-0" />
            </a>
          </Magnetic>
        </div>
      </div>

      <div className="absolute left-1/2 top-24 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-bone/50">
        Est. 2026 — Acetato N.º 001
      </div>
    </section>
  );
}

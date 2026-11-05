"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Scroll suave con Lenis, conducido por el ticker de GSAP para que
// ScrollTrigger y Lenis compartan el mismo frame (sin desfases ni tirones).
export default function SmoothScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    // En móvil la barra de direcciones cambia la altura: no recalcular por eso.
    ScrollTrigger.config({ ignoreMobileResize: true });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.1,
      anchors: true, // los enlaces #catalogo, #historia… también se desplazan suave
      // En táctil se deja el scroll nativo (más fluido y sin conflictos con el pin)
      syncTouch: false,
    });

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}

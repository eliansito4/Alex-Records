"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Instancia compartida (por ejemplo, el menú móvil la detiene mientras está abierto)
let instance: Lenis | null = null;
export const getLenis = () => instance;

// Scroll suave con Lenis, conducido por el ticker de GSAP para que
// ScrollTrigger y Lenis compartan el mismo frame (sin desfases ni tirones).
export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    // En móvil la barra de direcciones cambia la altura: no recalcular por eso.
    ScrollTrigger.config({ ignoreMobileResize: true });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.1,
      anchors: true, // los enlaces #ancla dentro de una página también se desplazan suave
      // En táctil se deja el scroll nativo (más fluido y sin conflictos con el pin)
      syncTouch: false,
    });
    instance = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      instance = null;
    };
  }, []);

  // Al cambiar de página: arriba del todo al instante y recalcular los ScrollTrigger
  useEffect(() => {
    instance?.scrollTo(0, { immediate: true, force: true });
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}

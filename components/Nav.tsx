"use client";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { pages } from "@/lib/nav";
import { getLenis } from "./SmoothScroll";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Nav() {
  const { items, setOpen } = useCart();
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);
  // En móvil no hay mix-blend-difference (es caro de componer): el color del texto
  // cambia a tinta cuando la barra pasa sobre una sección clara.
  const [onLight, setOnLight] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  // Cada página tiene sus propias secciones claras: se vuelven a observar al navegar
  useEffect(() => {
    // IntersectionObserver sobre una franja de 1px a la altura de la barra (y = 40px):
    // no guarda posiciones, así que no se descuadra si cambian las alturas.
    const els = document.querySelectorAll("[data-nav='light']");
    let io: IntersectionObserver | null = null;
    const active = new Set<Element>();
    const build = () => {
      io?.disconnect();
      active.clear();
      setOnLight(false);
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
  }, [pathname]);

  // El menú móvil se cierra al cambiar de página
  useEffect(() => setMenu(false), [pathname]);

  // Mientras el menú está abierto, la página de fondo no se desplaza
  useEffect(() => {
    const lenis = getLenis();
    if (menu) {
      lenis?.stop();
      document.documentElement.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.documentElement.style.overflow = "";
    }
  }, [menu]);

  return (
    <>
      <header
        className={`intro-nav fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-5 transition-colors duration-300 md:px-10 md:text-bone md:mix-blend-difference ${
          onLight && !menu ? "text-ink" : "text-bone"
        }`}
      >
        <Link href="/" className="font-display text-xl uppercase tracking-wide" data-cursor="inicio" aria-label="Alex Records — inicio">
          Alex<span className="font-serif-i normal-case"> Records</span>
        </Link>

        <nav className="hidden gap-8 font-mono text-[11px] uppercase tracking-[0.2em] md:flex" aria-label="Principal">
          {pages.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="group relative"
              data-cursor="ir"
              aria-current={isActive(p.href) ? "page" : undefined}
            >
              {p.label}
              <span
                className={`absolute -bottom-1 left-0 h-px bg-bone transition-all duration-500 ${
                  isActive(p.href) ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em]"
            data-cursor="ver"
          >
            Carrito
            <span className="relative grid h-6 w-6 place-items-center overflow-hidden rounded-full border border-current">
              <AnimatePresence mode="popLayout">
                <motion.span key={items.length} initial={{ y: 14 }} animate={{ y: 0 }} exit={{ y: -14 }} transition={{ duration: 0.3, ease }}>
                  {items.length}
                </motion.span>
              </AnimatePresence>
            </span>
          </button>

          {/* Menú móvil */}
          <button
            onClick={() => setMenu((m) => !m)}
            className="relative h-6 w-7 md:hidden"
            aria-label={menu ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menu}
            aria-controls="menu-movil"
          >
            <span className={`absolute left-0 top-[7px] h-px w-7 bg-current transition-transform duration-300 ${menu ? "translate-y-[4px] rotate-45" : ""}`} />
            <span className={`absolute left-0 top-[15px] h-px w-7 bg-current transition-transform duration-300 ${menu ? "-translate-y-[4px] -rotate-45" : ""}`} />
          </button>
        </div>
      </header>

      {/* Fuera del <header>: su animación de entrada usa transform y atraparía el position: fixed */}
      <AnimatePresence>
        {menu && (
          <motion.div
            id="menu-movil"
            className="textile fixed inset-0 z-40 flex flex-col justify-between px-5 pb-10 pt-28 md:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease }}
          >
            <nav className="flex flex-col gap-3" aria-label="Menú móvil">
              {[{ href: "/", label: "Inicio" }, ...pages].map((p, i) => (
                <div key={p.href} className="overflow-hidden">
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    transition={{ delay: 0.15 + i * 0.05, duration: 0.6, ease }}
                  >
                    <Link
                      href={p.href}
                      onClick={() => setMenu(false)}
                      aria-current={pathname === p.href ? "page" : undefined}
                      className={`font-display text-6xl uppercase leading-none ${pathname === p.href ? "text-bone" : "text-bone/50"}`}
                    >
                      {p.label}
                    </Link>
                  </motion.div>
                </div>
              ))}
            </nav>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone/50">Lagos · Accra · Addis · Bamako</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const stats = [
  { n: 1240, s: "+", l: "Acetatos importados" },
  { n: 38, s: "", l: "Artistas representados" },
  { n: 14, s: "", l: "Países de origen" },
  { n: 100, s: "%", l: "Regalías trazables" },
];

export default function Management() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".stat-num").forEach((el) => {
        const end = Number(el.dataset.n);
        const o = { v: 0 };
        gsap.to(o, {
          v: end,
          duration: 2,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
          onUpdate: () => (el.textContent = Math.round(o.v).toLocaleString("es")),
        });
      });
      gsap.from(".mgmt-word", {
        yPercent: 100,
        stagger: 0.06,
        ease: "power4.out",
        duration: 1.1,
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="management" ref={root} data-nav="light" className="textile-light px-5 py-28 text-ink md:px-10 md:py-40">
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink/60">Management de artistas</p>
      <h2 className="mt-6 max-w-6xl font-display text-[12vw] uppercase leading-[0.88] tracking-tightest md:text-[7vw]">
        {"Representamos la música y a quienes la hicieron".split(" ").map((w, i) => (
          <span key={i} className="mr-[0.25em] inline-block overflow-hidden align-bottom">
            <span className={`mgmt-word inline-block ${i === 2 ? "font-serif-i normal-case tracking-normal" : ""}`}>{w}</span>
          </span>
        ))}
      </h2>
      <div className="mt-20 grid grid-cols-2 gap-px border border-ink/15 bg-ink/15 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.l} className="bg-bone p-6 transition-colors duration-500 hover:bg-ink hover:text-bone md:p-10" data-cursor="✶">
            <p className="font-display text-5xl md:text-7xl">
              <span className="stat-num" data-n={s.n}>0</span>
              {s.s}
            </p>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] opacity-60">{s.l}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

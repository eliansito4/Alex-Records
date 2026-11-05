"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { chapters } from "@/data/records";

// Narración por scroll: sección fijada con capítulos en desplazamiento horizontal
// y un disco que gira y se revela a medida que avanzas.
export default function Story() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add("(min-width: 768px)", () => {
        const dist = () => track.current!.scrollWidth - window.innerWidth;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${dist()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        tl.to(track.current, { x: () => -dist(), ease: "none" }, 0)
          .to(".story-disc", { rotate: 720, ease: "none" }, 0)
          .to(".story-progress", { scaleX: 1, ease: "none" }, 0);

        gsap.utils.toArray<HTMLElement>(".chapter").forEach((el) => {
          gsap.from(el.querySelectorAll(".reveal"), {
            y: 60,
            opacity: 0,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: el, containerAnimation: tl, start: "left 75%", toggleActions: "play none none reverse" },
          });
        });
      });

      mm.add("(max-width: 767px)", () => {
        gsap.utils.toArray<HTMLElement>(".chapter").forEach((el) => {
          gsap.from(el.querySelectorAll(".reveal"), {
            y: 40,
            opacity: 0,
            stagger: 0.08,
            scrollTrigger: { trigger: el, start: "top 80%" },
          });
        });
      });
    }, root);
    return () => {
      ctx.revert();
      mm.revert();
    };
  }, []);

  return (
    <section id="historia" ref={root} data-nav="light" className="textile-light relative overflow-hidden text-ink md:h-screen">
      <div className="pointer-events-none absolute right-[-18vw] top-1/2 hidden -translate-y-1/2 md:block">
        <div className="story-disc vinyl relative h-[70vh] w-[70vh] opacity-90">
          <div className="absolute inset-[34%] grid place-items-center rounded-full bg-bone">
            <span className="font-display text-2xl text-ink">AR</span>
          </div>
        </div>
      </div>

      <div ref={track} className="relative flex h-full flex-col md:w-max md:flex-row md:items-center">
        <div className="chapter flex shrink-0 flex-col justify-center px-5 py-24 md:h-full md:w-[60vw] md:px-16">
          <p className="reveal font-mono text-[11px] uppercase tracking-[0.3em] text-ink/60">Nuestra historia</p>
          <h2 className="reveal mt-6 font-display text-[16vw] uppercase leading-[0.85] tracking-tightest md:text-[9vw]">
            Del surco
            <br />
            <span className="font-serif-i normal-case tracking-normal">a tus manos</span>
          </h2>
        </div>

        {chapters.map((c) => (
          <article key={c.n} className="chapter flex shrink-0 flex-col justify-center border-t border-ink/15 px-5 py-16 md:h-full md:w-[42vw] md:border-l md:border-t-0 md:px-14">
            <span className="reveal outline-text-dark font-display text-[28vw] leading-none md:text-[14vw]">{c.n}</span>
            <h3 className="reveal mt-4 font-display text-4xl uppercase md:text-6xl">{c.title}</h3>
            <p className="reveal mt-5 max-w-md text-base leading-relaxed text-ink/75 md:text-lg">{c.body}</p>
          </article>
        ))}
        <div className="hidden shrink-0 md:block md:w-[30vw]" />
      </div>

      <div className="absolute inset-x-16 bottom-10 hidden h-px bg-ink/15 md:block">
        <div className="story-progress h-full origin-left scale-x-0 bg-ink" />
      </div>
    </section>
  );
}

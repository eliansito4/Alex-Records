import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { discs, getDisc, GRADES, GRADE_INFO, type SleeveGrade } from "@/data/catalog";
import { relatedDiscs } from "@/lib/shop";
import DiscImage from "@/components/DiscImage";
import { CurrencySwitch, Price } from "@/components/Price";
import AddToCart from "@/components/shop/AddToCart";

type Params = { params: Promise<{ id: string }> };

// Las 40 fichas se generan como páginas estáticas al compilar
export function generateStaticParams() {
  return discs.map((d) => ({ id: d.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const d = getDisc((await params).id);
  if (!d) return { title: "Disco no encontrado" };
  return {
    title: `${d.artist} — ${d.title}`,
    description: `${d.formatDetail} · ${d.label} ${d.catNo} · ${d.city}, ${d.country}, ${d.year}. Estado ${GRADE_INFO[d.media].label}. Pieza única.`,
  };
}

const sleeveText = (s: SleeveGrade) => (s in GRADE_INFO ? GRADE_INFO[s as keyof typeof GRADE_INFO].label : s);

export default async function DiscPage({ params }: Params) {
  const d = getDisc((await params).id);
  if (!d) notFound();
  const related = relatedDiscs(d);
  const special = d.format === "Acetato" || d.format === "Test pressing";

  const facts: [string, React.ReactNode][] = [
    ["Sello", d.label],
    ["Cat. n.º", <span key="c" className="font-mono text-[13px]">{d.catNo}</span>],
    ["Formato", d.formatDetail],
    ["Género", d.genre],
    ["Origen", `${d.city}, ${d.country}`],
    ["Año", d.year],
    ["Estado del disco", GRADE_INFO[d.media].label],
    ["Funda", sleeveText(d.sleeve)],
  ];

  return (
    <>
      <section className="textile px-5 pb-20 pt-28 md:px-10 md:pt-32">
        {/* Migas de pan */}
        <nav aria-label="Ruta" className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone/50">
          <Link href="/tienda" className="hover:text-bone">
            Tienda
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/tienda?genero=${encodeURIComponent(d.genre)}`} className="hover:text-bone">
            {d.genre}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-bone/80">{d.title}</span>
        </nav>

        <div className="mt-8 grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16">
          {/* Foto */}
          <div>
            <div className="relative aspect-square overflow-hidden border border-bone/15 bg-ink">
              <DiscImage disc={d} sizes="(min-width: 768px) 50vw, 100vw" priority />
            </div>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.15em] text-bone/40">Foto ilustrativa</p>
          </div>

          {/* Compra */}
          <div className="flex flex-col">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone/60">
              {d.format} · Pieza única{special ? " · Con certificado" : ""}
            </p>
            <p className="mt-5 text-lg text-bone/75">{d.artist}</p>
            <h1 className="mt-1 font-display text-5xl uppercase leading-[0.9] lg:text-7xl">{d.title}</h1>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.15em] text-bone/55">{d.formatDetail}</p>

            <div className="mt-8 border-y border-bone/15 py-6">
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div>
                  <Price eur={d.price} className="block font-display text-5xl leading-none" />
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.15em] text-bone/55">
                    + <Price eur={d.shipping} /> envío asegurado
                  </p>
                </div>
                <AddToCart disc={d} size="lg" />
              </div>
              <CurrencySwitch className="mt-6" />
              <p className="mt-4 text-sm text-bone/60">Al añadirlo al carrito queda reservado para ti durante 30 minutos.</p>
            </div>

            <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
              {facts.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-bone/50">{k}</dt>
                  <dd className="text-bone/90">{v}</dd>
                </div>
              ))}
            </dl>

            {d.notes && (
              <p className="mt-6 border-l border-bone/30 pl-4 font-serif-i text-xl leading-snug text-bone/85">{d.notes}</p>
            )}
          </div>
        </div>

        {/* Estado explicado */}
        <div className="mt-20 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-16">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-bone/60">Cómo calificamos</p>
            <h2 className="mt-3 font-display text-4xl uppercase leading-none md:text-5xl">Estado del disco</h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-bone/65">
              Usamos la escala estándar del vinilo. Cada pieza se inspecciona bajo lupa y se escucha completa antes de ponerla a la venta.
            </p>
          </div>
          <ol className="border-t border-bone/15">
            {GRADES.map((g) => {
              const current = g === d.media;
              return (
                <li
                  key={g}
                  aria-current={current ? "true" : undefined}
                  className={`grid grid-cols-[4.5rem_1fr] gap-4 border-b border-bone/15 px-3 py-4 ${current ? "bg-bone text-ink" : ""}`}
                >
                  <span className="font-display text-2xl">{g}</span>
                  <span>
                    <span className={`block text-sm font-medium ${current ? "" : "text-bone/85"}`}>
                      {GRADE_INFO[g].label}
                      {current && <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.15em]">← este disco</span>}
                    </span>
                    <span className={`block text-sm ${current ? "text-ink/70" : "text-bone/55"}`}>{GRADE_INFO[g].detail}</span>
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Garantías */}
        <ul className="mt-20 grid gap-px border border-bone/15 bg-bone/15 md:grid-cols-3">
          {[
            ["Procedencia", special ? "Certificado de procedencia firmado: origen, estudio y fecha del corte." : "Origen documentado: de dónde viene y quién lo tuvo."],
            ["Envío asegurado", "Embalaje rígido para vinilo y seguro por el valor total del disco."],
            ["Archivo sonoro", "Digitalizamos cada pieza antes de venderla: el disco viaja, el sonido queda preservado."],
          ].map(([t, b]) => (
            <li key={t} className="bg-ink p-6 md:p-8">
              <p className="font-display text-2xl uppercase">{t}</p>
              <p className="mt-2 text-sm leading-relaxed text-bone/65">{b}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Relacionados */}
      {related.length > 0 && (
        <section data-nav="light" className="textile-light px-5 py-20 text-ink md:px-10 md:py-28">
          <div className="flex items-end justify-between gap-6">
            <h2 className="font-display text-4xl uppercase leading-none md:text-6xl">
              También te puede <span className="font-serif-i normal-case">interesar</span>
            </h2>
            <Link href="/tienda" className="hidden shrink-0 font-mono text-[11px] uppercase tracking-[0.2em] underline-offset-4 hover:underline md:block">
              Ver toda la tienda →
            </Link>
          </div>
          <ul className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4 lg:gap-x-8">
            {related.map((r) => (
              <li key={r.id}>
                <Link href={`/tienda/${r.id}`} className="group block" data-cursor="ver">
                  <div className="relative aspect-square overflow-hidden bg-ink">
                    <DiscImage disc={r} sizes="(min-width: 1024px) 22vw, 45vw" className="transition-opacity duration-300 group-hover:opacity-80" />
                  </div>
                  <p className="mt-3 text-sm text-ink/70">{r.artist}</p>
                  <p className="font-display text-xl uppercase leading-tight">{r.title}</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-ink/55">
                    {r.format} · {r.media} · <Price eur={r.price} />
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

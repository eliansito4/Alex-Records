const words = ["Afrobeat", "Highlife", "Ethio-Jazz", "Soukous", "Desert Blues", "Mbaqanga", "Juju", "Makossa"];

export default function Marquee({ dark = false }: { dark?: boolean }) {
  const row = [...words, ...words];
  return (
    <div data-nav={dark ? "light" : undefined} className={`overflow-hidden border-y py-5 ${dark ? "border-ink/20 bg-bone text-ink" : "border-bone/15 bg-ink text-bone"}`}>
      <div className="marquee-track flex w-max gap-10 whitespace-nowrap">
        {row.map((w, i) => (
          <span key={i} className="flex items-center gap-10 font-display text-5xl uppercase md:text-7xl">
            <span className={i % 2 ? "outline-text" + (dark ? "-dark" : "") : ""}>{w}</span>
            <span className="font-serif-i text-3xl normal-case md:text-4xl">✶</span>
          </span>
        ))}
      </div>
    </div>
  );
}

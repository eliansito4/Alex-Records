"use client";
import { useCurrency, type Currency } from "@/lib/currency";

// Precio en la moneda elegida. En pesos se marca como aproximado (≈),
// porque el cobro se hace en euros y la tasa varía.
export function Price({ eur, className = "" }: { eur: number; className?: string }) {
  const { currency, format } = useCurrency();
  return (
    <span className={className} title={currency === "COP" ? "Aproximado: el cobro se hace en euros" : undefined}>
      {currency === "COP" && <span aria-hidden>≈ </span>}
      {format(eur)}
    </span>
  );
}

// Selector EUR / COP
export function CurrencySwitch({ tone = "dark", className = "" }: { tone?: "dark" | "light"; className?: string }) {
  const { currency, setCurrency, rate, rateSource } = useCurrency();
  const options: Currency[] = ["EUR", "COP"];
  const base = tone === "dark" ? "border-bone/30" : "border-ink/30";
  const on = tone === "dark" ? "bg-bone text-ink" : "bg-ink text-bone";
  const off = tone === "dark" ? "text-bone/70 hover:text-bone" : "text-ink/70 hover:text-ink";
  const rateText = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 }).format(rate);

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div role="radiogroup" aria-label="Moneda" className={`inline-flex w-fit rounded-full border p-1 ${base}`}>
        {options.map((c) => (
          <button
            key={c}
            role="radio"
            aria-checked={currency === c}
            onClick={() => setCurrency(c)}
            data-cursor={c}
            className={`rounded-full px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors duration-300 ${
              currency === c ? on : off
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      {currency === "COP" && (
        <p className={`font-mono text-[9px] uppercase tracking-[0.15em] ${tone === "dark" ? "text-bone/50" : "text-ink/50"}`}>
          1 € ≈ {rateText} COP{rateSource === "fallback" ? " (tasa de respaldo)" : ""} · Se cobra en EUR
        </p>
      )}
    </div>
  );
}

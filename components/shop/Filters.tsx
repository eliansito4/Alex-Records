"use client";
import { useState } from "react";
import { GRADE_INFO, type Grade } from "@/data/catalog";
import { useCurrency } from "@/lib/currency";
import { FACETS, PRICE_BUCKETS, facetOptions, activeCount, type FacetKey, type ShopState } from "@/lib/shop";
import { CurrencySwitch } from "../Price";

const VISIBLE = 5;

// Texto visible de cada opción (la URL guarda el valor corto: "VG+", "1970s", "50-150")
export function useOptionLabel() {
  const { format } = useCurrency();
  return (key: FacetKey, value: string) => {
    if (key === "estado") return GRADE_INFO[value as Grade]?.label ?? value;
    if (key === "decada") return `Años ${value.slice(2, 4)}`;
    if (key === "precio") {
      const b = PRICE_BUCKETS.find((p) => p.id === value);
      if (!b) return value;
      if (b.min === 0) return `Hasta ${format(b.max)}`;
      if (b.max === Infinity) return `Más de ${format(b.min)}`;
      return `${format(b.min)} – ${format(b.max)}`;
    }
    return value;
  };
}

type Props = {
  state: ShopState;
  toggle: (key: FacetKey, value: string) => void;
  clearAll: () => void;
};

export default function Filters({ state, toggle, clearAll }: Props) {
  const label = useOptionLabel();
  const selected = FACETS.flatMap((f) => state.filters[f.key].map((v) => ({ key: f.key, value: v })));

  return (
    <div className="flex flex-col gap-9">
      {/* Filtros activos */}
      {selected.length > 0 && (
        <div>
          <div className="flex items-center justify-between">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone">Has seleccionado</p>
            <button onClick={clearAll} className="font-mono text-[10px] uppercase tracking-[0.15em] text-bone/50 underline-offset-4 hover:text-bone hover:underline">
              Limpiar ({activeCount(state)})
            </button>
          </div>
          <ul className="mt-3 flex flex-col gap-2">
            {selected.map((s) => (
              <li key={s.key + s.value}>
                <button
                  onClick={() => toggle(s.key, s.value)}
                  aria-label={`Quitar filtro ${label(s.key, s.value)}`}
                  className="flex w-full items-center justify-between bg-bone px-3 py-2 text-left text-sm text-ink transition-opacity hover:opacity-80"
                >
                  <span>
                    <span className="text-ink/50">{FACETS.find((f) => f.key === s.key)!.title}:</span> {label(s.key, s.value)}
                  </span>
                  <span aria-hidden>✕</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {FACETS.map((f) => (
        <FacetGroup key={f.key} facetKey={f.key} title={f.title} state={state} toggle={toggle} label={label} />
      ))}

      <div>
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-bone">Moneda</p>
        <CurrencySwitch />
      </div>
    </div>
  );
}

function FacetGroup({
  facetKey,
  title,
  state,
  toggle,
  label,
}: {
  facetKey: FacetKey;
  title: string;
  state: ShopState;
  toggle: Props["toggle"];
  label: ReturnType<typeof useOptionLabel>;
}) {
  const [expanded, setExpanded] = useState(false);
  const options = facetOptions(state, facetKey);
  const shown = expanded ? options : options.slice(0, VISIBLE);
  if (!options.length) return null;

  return (
    <fieldset>
      <legend className="mb-3 font-display text-xl uppercase tracking-wide">{title}</legend>
      <ul className="flex flex-col">
        {shown.map((o) => {
          const disabled = o.count === 0 && !o.selected;
          return (
            <li key={o.value}>
              <label
                className={`group flex cursor-pointer items-center gap-3 py-1.5 text-sm ${disabled ? "cursor-not-allowed opacity-35" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={o.selected}
                  disabled={disabled}
                  onChange={() => toggle(facetKey, o.value)}
                  className="peer sr-only"
                />
                <span
                  aria-hidden
                  className={`grid h-4 w-4 shrink-0 place-items-center border text-[10px] leading-none peer-focus-visible:ring-1 peer-focus-visible:ring-bone ${
                    o.selected ? "border-bone bg-bone text-ink" : "border-bone/40 group-hover:border-bone"
                  }`}
                >
                  {o.selected ? "✓" : ""}
                </span>
                <span className={`flex-1 ${o.selected ? "text-bone" : "text-bone/75 group-hover:text-bone"}`}>{label(facetKey, o.value)}</span>
                <span className="font-mono text-[11px] tabular-nums text-bone/45">{o.count}</span>
              </label>
            </li>
          );
        })}
      </ul>
      {options.length > VISIBLE && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="mt-2 font-mono text-[10px] uppercase tracking-[0.15em] text-bone/60 underline-offset-4 hover:text-bone hover:underline"
        >
          {expanded ? "Mostrar menos" : `Mostrar más (${options.length - VISIBLE})`}
        </button>
      )}
    </fieldset>
  );
}

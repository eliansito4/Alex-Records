"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { FALLBACK_EUR_COP } from "./currency-config";

export type Currency = "EUR" | "COP";

type CurrencyCtx = {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  /** Pesos colombianos por 1 euro */
  rate: number;
  rateSource: "live" | "fallback" | "loading";
  /** Formatea un importe en euros en la moneda elegida */
  format: (eur: number) => string;
};

const Ctx = createContext<CurrencyCtx | null>(null);
const STORAGE_KEY = "alex-records:currency";

const eurFmt = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 2, minimumFractionDigits: 0 });
// Con código ("COP 3.896.665") en vez de "$", que se confunde con dólares
const copFmt = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", currencyDisplay: "code", maximumFractionDigits: 0 });

export const formatEUR = (eur: number) => eurFmt.format(eur);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("EUR");
  const [rate, setRate] = useState(FALLBACK_EUR_COP);
  const [rateSource, setRateSource] = useState<CurrencyCtx["rateSource"]>("loading");

  // Recuperar la moneda elegida por el visitante
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "EUR" || saved === "COP") setCurrencyState(saved);
    } catch {
      /* sin almacenamiento: se queda en EUR */
    }
  }, []);

  // Tasa del día desde nuestra propia ruta /api/fx
  useEffect(() => {
    let cancelled = false;
    fetch("/api/fx")
      .then((r) => r.json())
      .then((d: { rate?: number; source?: "live" | "fallback" }) => {
        if (cancelled) return;
        if (typeof d.rate === "number" && d.rate > 0) setRate(d.rate);
        setRateSource(d.source === "live" ? "live" : "fallback");
      })
      .catch(() => !cancelled && setRateSource("fallback"));
    return () => {
      cancelled = true;
    };
  }, []);

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    try {
      window.localStorage.setItem(STORAGE_KEY, c);
    } catch {
      /* ignorar */
    }
  }, []);

  const value = useMemo<CurrencyCtx>(
    () => ({
      currency,
      setCurrency,
      rate,
      rateSource,
      format: (eur) => (currency === "COP" ? copFmt.format(Math.round(eur * rate)) : eurFmt.format(eur)),
    }),
    [currency, setCurrency, rate, rateSource]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCurrency() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCurrency debe usarse dentro de CurrencyProvider");
  return c;
}

import { NextResponse } from "next/server";
import { FALLBACK_EUR_COP } from "@/lib/currency-config";

// Tasa EUR → COP. Se consulta en el servidor (no desde el navegador) y Next la
// guarda en caché 12 h, así no se llama al servicio en cada visita.
// Fuente: ExchangeRate-API, acceso abierto sin clave (https://www.exchangerate-api.com).
export const revalidate = 43200;

export async function GET() {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/EUR", { next: { revalidate: 43200 } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as { result?: string; rates?: { COP?: number }; time_last_update_utc?: string };
    const rate = data.rates?.COP;
    if (data.result !== "success" || typeof rate !== "number" || !Number.isFinite(rate) || rate <= 0) {
      throw new Error("respuesta sin tasa COP");
    }
    return NextResponse.json({ rate, updated: data.time_last_update_utc ?? null, source: "live" });
  } catch {
    // Si el servicio falla, la tienda sigue funcionando con la tasa de respaldo
    return NextResponse.json({ rate: FALLBACK_EUR_COP, updated: null, source: "fallback" });
  }
}

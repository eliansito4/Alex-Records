// Moneda base de la tienda: todos los precios del catálogo están en euros.
export const BASE_CURRENCY = "EUR" as const;

// Tasa de respaldo EUR → COP, solo se usa si el servicio de tasas no responde.
// Actualízala de vez en cuando para que no quede muy desfasada.
export const FALLBACK_EUR_COP = 3700; // ≈ tasa real a 2026-11-11 (3.676)

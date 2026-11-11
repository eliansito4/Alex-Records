"use client";
import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { records, type Record } from "@/data/records";

type CartCtx = {
  items: Record[];
  open: boolean;
  add: (r: Record) => void;
  remove: (id: string) => void;
  setOpen: (v: boolean) => void;
  total: number;
};

const Ctx = createContext<CartCtx | null>(null);

// Solo se guardan los ids: al volver se reconstruye desde el catálogo, así un
// precio actualizado o un disco retirado no quedan "congelados" en el carrito.
const STORAGE_KEY = "alex-records:cart";

function loadIds(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const ids = raw ? JSON.parse(raw) : [];
    return Array.isArray(ids) ? ids.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return []; // navegación privada, almacenamiento bloqueado o dato corrupto
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Record[]>([]);
  const [open, setOpen] = useState(false);
  const loaded = useRef(false);

  // Recuperar el carrito después de hidratar (en el servidor no existe localStorage)
  useEffect(() => {
    const ids = new Set(loadIds());
    setItems(records.filter((r) => ids.has(r.id)));
    loaded.current = true;
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items.map((r) => r.id)));
    } catch {
      // sin almacenamiento disponible: el carrito funciona igual durante la visita
    }
  }, [items]);

  const value = useMemo<CartCtx>(
    () => ({
      items,
      open,
      setOpen,
      // Los acetatos son piezas únicas: no se duplican en el carrito
      add: (r) => setItems((prev) => (prev.some((p) => p.id === r.id) ? prev : [...prev, r])),
      remove: (id) => setItems((prev) => prev.filter((p) => p.id !== id)),
      total: items.reduce((s, r) => s + r.price, 0),
    }),
    [items, open]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart debe usarse dentro de CartProvider");
  return c;
}

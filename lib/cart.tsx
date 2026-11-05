"use client";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Record } from "@/data/records";

type CartCtx = {
  items: Record[];
  open: boolean;
  add: (r: Record) => void;
  remove: (id: string) => void;
  setOpen: (v: boolean) => void;
  total: number;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Record[]>([]);
  const [open, setOpen] = useState(false);

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

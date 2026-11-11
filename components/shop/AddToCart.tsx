"use client";
import type { Disc } from "@/data/catalog";
import { useCart } from "@/lib/cart";

// Botón de compra. Como cada disco es pieza única, una vez en el carrito
// el botón pasa a "En el carrito ✓" y abre el carrito en vez de duplicarlo.
export default function AddToCart({ disc, size = "md", className = "" }: { disc: Disc; size?: "md" | "lg"; className?: string }) {
  const { add, items, setOpen } = useCart();
  const inCart = items.some((p) => p.id === disc.id);
  const pad = size === "lg" ? "px-8 py-5 text-[11px]" : "px-5 py-3 text-[10px]";

  return (
    <button
      onClick={() => (inCart ? setOpen(true) : add(disc))}
      data-cursor={inCart ? "ver" : "+"}
      className={`shrink-0 rounded-full border font-mono uppercase tracking-[0.2em] transition-colors duration-200 ${pad} ${
        inCart ? "border-bone bg-transparent text-bone" : "border-bone bg-bone text-ink hover:bg-transparent hover:text-bone"
      } ${className}`}
    >
      {inCart ? "En el carrito ✓" : "Añadir al carrito"}
    </button>
  );
}

"use client";
import type { ReactNode } from "react";
import { CartProvider } from "@/lib/cart";
import { CurrencyProvider } from "@/lib/currency";
import SmoothScroll from "./SmoothScroll";
import Cursor from "./Cursor";
import Nav from "./Nav";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";

// Todo lo que comparten las páginas. Vive en el layout, así que al navegar entre
// páginas no se vuelve a montar: el carrito, la moneda, el scroll suave y el menú persisten.
export default function SiteShell({ children }: { children: ReactNode }) {
  return (
    <CurrencyProvider>
      <CartProvider>
        <SmoothScroll />
        <div className="grain" aria-hidden />
        <Cursor />
        <Nav />
        <main>{children}</main>
        <Footer />
        <CartDrawer />
      </CartProvider>
    </CurrencyProvider>
  );
}

import type { Metadata } from "next";
import CartView from "@/components/shop/CartView";

export const metadata: Metadata = {
  title: "Carrito",
  // El carrito es personal: no tiene sentido que aparezca en buscadores
  robots: { index: false, follow: true },
};

export default function CarritoPage() {
  return <CartView />;
}

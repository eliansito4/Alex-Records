import type { Metadata } from "next";
import Products from "@/components/Products";
import NextPage from "@/components/NextPage";

export const metadata: Metadata = {
  title: "Tienda",
  description: "Acetatos, test pressings y primeras prensas de música africana. Cada pieza es única.",
};

// Por ahora muestra el catálogo actual; el módulo 3 lo convierte en la tienda completa.
export default function TiendaPage() {
  return (
    <>
      <Products />
      <NextPage href="/management" label="Management" light />
    </>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";
import ShopView from "@/components/shop/ShopView";
import NextPage from "@/components/NextPage";

export const metadata: Metadata = {
  title: "Tienda",
  description: "Acetatos, test pressings y primeras prensas de música africana. Cada pieza es única.",
};

// Los filtros viven en la URL (?formato=LP&orden=precio-asc…); Suspense es necesario
// para leerlos en una página que Next genera de forma estática.
export default function TiendaPage() {
  return (
    <>
      <Suspense fallback={<div className="textile min-h-screen" />}>
        <ShopView />
      </Suspense>
      <NextPage href="/management" label="Management" light />
    </>
  );
}

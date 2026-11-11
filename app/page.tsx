import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import SectionIndex from "@/components/SectionIndex";

// Inicio: el disco 3D y el índice de secciones. Los discos a la venta solo están en /tienda.
export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <SectionIndex />
    </>
  );
}

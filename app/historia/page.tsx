import type { Metadata } from "next";
import Story from "@/components/Story";
import Marquee from "@/components/Marquee";
import NextPage from "@/components/NextPage";

export const metadata: Metadata = {
  title: "Historia",
  description: "Cómo encontramos, restauramos e importamos acetatos de música africana.",
};

export default function HistoriaPage() {
  return (
    <>
      <Story />
      <Marquee />
      <NextPage href="/tienda" label="Tienda" />
    </>
  );
}

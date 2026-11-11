import type { Metadata } from "next";
import Management from "@/components/Management";
import NextPage from "@/components/NextPage";

export const metadata: Metadata = {
  title: "Management",
  description: "Representación de artistas africanos y de sus herederos: derechos, regalías y reediciones.",
};

export default function ManagementPage() {
  return (
    <>
      <Management />
      <NextPage href="/contacto" label="Contacto" />
    </>
  );
}

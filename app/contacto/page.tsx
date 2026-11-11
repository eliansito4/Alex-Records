import type { Metadata } from "next";
import ContactSection from "@/components/ContactSection";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Únete a la lista privada y recibe los nuevos acetatos 48 horas antes.",
};

export default function ContactoPage() {
  return <ContactSection />;
}

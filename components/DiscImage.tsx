"use client";
import Image, { type ImageLoaderProps } from "next/image";
import type { Disc } from "@/data/catalog";

// Las fotos de Unsplash se redimensionan en su propio CDN (imgix): solo se descarga
// el tamaño que necesita cada pantalla, en WebP/AVIF, recortado a cuadrado.
const unsplashLoader = ({ src, width, quality }: ImageLoaderProps) =>
  `${src}?w=${width}&h=${width}&fit=crop&crop=entropy&auto=format&q=${quality ?? 70}`;

type Props = {
  disc: Pick<Disc, "image" | "artist" | "title">;
  /** Ancho aproximado en pantalla, para que el navegador elija el tamaño justo */
  sizes: string;
  className?: string;
  /** true solo para las primeras imágenes visibles al cargar la página */
  priority?: boolean;
};

// Foto del disco en blanco y negro, para respetar la paleta hueso/tinta del sitio.
export default function DiscImage({ disc, sizes, className = "", priority = false }: Props) {
  const remote = disc.image.startsWith("https://images.unsplash.com/");
  return (
    <Image
      src={disc.image}
      alt={`${disc.artist} — ${disc.title}`}
      fill
      sizes={sizes}
      priority={priority}
      loader={remote ? unsplashLoader : undefined}
      className={`object-cover grayscale ${className}`}
    />
  );
}

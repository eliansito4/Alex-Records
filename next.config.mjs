import path from "node:path";
import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["three"],
  // La raíz del proyecto es esta carpeta (hay otro package-lock.json en C:\Users\ELIAN
  // y sin esto Next avisa en cada arranque de que no sabe cuál usar)
  outputFileTracingRoot: path.dirname(fileURLToPath(import.meta.url)),
};
export default nextConfig;

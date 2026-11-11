import type Lenis from "lenis";

// Referencia compartida a la instancia de Lenis, en un archivo sin dependencias:
// así el menú, el carrito o la tienda pueden pausarla sin arrastrar GSAP ni Lenis
// a su propio paquete de JavaScript (solo `import type`, que desaparece al compilar).
let instance: Lenis | null = null;

export const getLenis = () => instance;
export const setLenis = (l: Lenis | null) => {
  instance = l;
};

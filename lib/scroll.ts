// Estado compartido (sin re-renders) entre GSAP ScrollTrigger y la escena 3D.
export const scrollState = {
  hero: 0, // 0 → 1 mientras el héroe sale de pantalla
  mouseX: 0, // -1 → 1
  mouseY: 0,
};

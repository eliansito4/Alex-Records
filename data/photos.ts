// Fotos de stock provisionales (Unsplash, licencia gratuita: uso comercial permitido,
// sin atribución obligatoria — https://unsplash.com/license).
// Revisadas una a una: ninguna muestra portadas, sellos ni marcas reales legibles,
// para que no parezca que vendemos discos de artistas reales.
// Cuando tengas fotos propias, pon la ruta en el campo `image` de cada disco
// (por ejemplo "/discos/ar-001.jpg" dentro de /public) y deja de usar estas.

const u = (id: string) => `https://images.unsplash.com/${id}`;

export const stock = {
  // Etiqueta blanca: ideales para acetatos y test pressings
  whiteLabel1: u("photo-1602848597239-b63398805e3f"),
  whiteLabel2: u("photo-1602848596718-45693ff58c78"),
  // Tocadiscos y discos
  turntableBW: u("photo-1603048588665-791ca8aea617"),
  turntableLid: u("photo-1769372741848-f3fe737fc3ff"),
  turntableAmber: u("photo-1616714109948-c74fe5029a4d"),
  turntableBlue: u("photo-1673427079629-418917214ffc"),
  recordsClose: u("photo-1588532218970-c2cab983746a"),
  recordsBlur: u("photo-1634650254521-b1596c5a2d37"),
  recordSpines: u("photo-1684248022540-459c648ec197"),
  spinRed: u("photo-1645523906730-894addb64d64"),
  spinAbstract: u("photo-1539375665275-f9de415ef9ac"),
} as const;

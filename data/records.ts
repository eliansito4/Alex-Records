// Catálogo de ejemplo — títulos y artistas ficticios. Reemplázalos por tu inventario real.
export type Record = {
  id: string;
  title: string;
  artist: string;
  origin: string;
  year: string;
  genre: string;
  price: number;
  pressing: string;
  hue: number; // tono del sello central (solo para la ilustración generativa)
};

export const records: Record[] = [
  { id: "ar-001", title: "Lagos Midnight Ritual", artist: "The Ikeja Brass Union", origin: "Lagos, Nigeria", year: "1974", genre: "Afrobeat", price: 420, pressing: "Original · Acetato 1/1", hue: 0 },
  { id: "ar-002", title: "Sahel Electric", artist: "Orchestre Tombouctou", origin: "Bamako, Malí", year: "1979", genre: "Desert Blues", price: 380, pressing: "Test pressing · 1 de 3", hue: 0 },
  { id: "ar-003", title: "Highlife Ghost Notes", artist: "K. Mensah & The Volta Stars", origin: "Accra, Ghana", year: "1968", genre: "Highlife", price: 510, pressing: "Acetato de estudio", hue: 0 },
  { id: "ar-004", title: "Addis Golden Hour", artist: "Tewodros Quintet", origin: "Addis Abeba, Etiopía", year: "1972", genre: "Ethio-Jazz", price: 640, pressing: "Original · Acetato 1/1", hue: 0 },
  { id: "ar-005", title: "Soukous Nocturne", artist: "Kinshasa Lumière", origin: "Kinshasa, RD Congo", year: "1981", genre: "Soukous", price: 295, pressing: "Primera prensa", hue: 0 },
  { id: "ar-006", title: "Mbaqanga Dust", artist: "Soweto Shebeen Kings", origin: "Johannesburgo, Sudáfrica", year: "1976", genre: "Mbaqanga", price: 350, pressing: "Test pressing · 1 de 5", hue: 0 },
];

export const chapters = [
  {
    n: "01",
    title: "La búsqueda",
    body: "Recorremos mercados de Lagos, archivos de radio en Accra y sótanos de estudios en Addis Abeba buscando lo que nunca llegó a prensarse en masa.",
  },
  {
    n: "02",
    title: "El acetato",
    body: "Un acetato es el primer corte: laca sobre aluminio, grabada en vivo. Frágil, irrepetible. Cada uno es el instante exacto en que la música existió por primera vez.",
  },
  {
    n: "03",
    title: "La restauración",
    body: "Limpieza ultrasónica, inspección bajo lupa y digitalización de archivo antes de cualquier venta. El disco viaja; el sonido queda preservado.",
  },
  {
    n: "04",
    title: "Tu colección",
    body: "Importación directa, certificado de procedencia y gestión para artistas y herederos. El valor vuelve a quien hizo la música.",
  },
];

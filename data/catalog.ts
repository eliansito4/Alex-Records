// Catálogo de la tienda.
// ⚠️ Artistas, sellos, números de catálogo y precios son FICTICIOS (placeholder).
// Reemplázalos por el inventario real manteniendo la misma forma de los datos.

import { stock } from "./photos";

/* ---------- Tipos ---------- */

export const FORMATS = ["Acetato", "Test pressing", "LP", "EP", 'Single 7"'] as const;
export type Format = (typeof FORMATS)[number];

export const GENRES = [
  "Afrobeat",
  "Highlife",
  "Ethio-Jazz",
  "Soukous",
  "Desert Blues",
  "Mbaqanga",
  "Juju",
  "Makossa",
  "Afro-Funk",
] as const;
export type Genre = (typeof GENRES)[number];

// Escala de estado estándar en el mundo del vinilo (Goldmine), de mejor a peor
export const GRADES = ["M", "NM", "VG+", "VG", "G+"] as const;
export type Grade = (typeof GRADES)[number];
export type SleeveGrade = Grade | "Genérica" | "Sin funda";

export const GRADE_INFO: Record<Grade, { label: string; detail: string }> = {
  M: { label: "Mint (M)", detail: "Perfecto, sin reproducir o como recién prensado." },
  NM: { label: "Near Mint (NM o M-)", detail: "Casi perfecto: ninguna marca visible y sonido impecable." },
  "VG+": { label: "Very Good Plus (VG+)", detail: "Marcas leves que no afectan la escucha. Ruido mínimo." },
  VG: { label: "Very Good (VG)", detail: "Marcas visibles y algo de ruido de superficie en pasajes suaves." },
  "G+": { label: "Good Plus (G+)", detail: "Desgaste evidente y ruido constante, pero se reproduce sin saltos." },
};

export type Disc = {
  id: string;
  artist: string;
  title: string;
  format: Format;
  /** Detalle del formato, como aparece en la ficha: "LP, Album, Orig." */
  formatDetail: string;
  label: string;
  catNo: string;
  year: number;
  country: string;
  city: string;
  genre: Genre;
  /** Estado del disco */
  media: Grade;
  /** Estado de la funda */
  sleeve: SleeveGrade;
  notes?: string;
  /** Precio en euros (la moneda base de la tienda) */
  price: number;
  /** Envío en euros */
  shipping: number;
  /** Fecha en que se añadió al catálogo (AAAA-MM-DD) */
  addedAt: string;
  /** Foto del disco: URL de Unsplash provisional o ruta propia en /public ("/discos/ar-001.jpg") */
  image: string;
};

/* ---------- Inventario (ficticio) ---------- */

export const discs: Disc[] = [
  { id: "ar-001", artist: "The Ikeja Brass Union", title: "Lagos Midnight Ritual", format: "Acetato", formatDetail: "Acetato, 12\", Lado A, 1/1", label: "Ikeja Sound", catNo: "IKS-001", year: 1974, country: "Nigeria", city: "Lagos", genre: "Afrobeat", media: "VG+", sleeve: "Genérica", notes: "Corte de estudio único. Etiqueta escrita a mano por el ingeniero.", price: 420, shipping: 18, addedAt: "2026-11-10", image: stock.whiteLabel1 },
  { id: "ar-002", artist: "Orchestre Tombouctou", title: "Sahel Electric", format: "Test pressing", formatDetail: "LP, Test Pressing, 1 de 3", label: "Sahel Disques", catNo: "SD 7902", year: 1979, country: "Malí", city: "Bamako", genre: "Desert Blues", media: "NM", sleeve: "Sin funda", notes: "Funda blanca de prensa con sello de la planta.", price: 380, shipping: 18, addedAt: "2026-11-09", image: stock.whiteLabel2 },
  { id: "ar-003", artist: "K. Mensah & The Volta Stars", title: "Highlife Ghost Notes", format: "Acetato", formatDetail: "Acetato, 10\", Lado A", label: "Volta Records", catNo: "VR-68", year: 1968, country: "Ghana", city: "Accra", genre: "Highlife", media: "VG", sleeve: "Genérica", notes: "Leve ruido de superficie en el primer surco. Digitalizado antes de la venta.", price: 510, shipping: 18, addedAt: "2026-11-08", image: stock.turntableBW },
  { id: "ar-004", artist: "Tewodros Quintet", title: "Addis Golden Hour", format: "Acetato", formatDetail: "Acetato, 12\", 1/1", label: "Addis Phonograph", catNo: "AP 1972", year: 1972, country: "Etiopía", city: "Addis Abeba", genre: "Ethio-Jazz", media: "NM", sleeve: "Genérica", notes: "Una de las piezas más raras del catálogo. Certificado de procedencia incluido.", price: 640, shipping: 22, addedAt: "2026-11-08", image: stock.whiteLabel2 },
  { id: "ar-005", artist: "Kinshasa Lumière", title: "Soukous Nocturne", format: "LP", formatDetail: "LP, Album, Orig.", label: "Zaïre Lumière", catNo: "ZL 3011", year: 1981, country: "RD Congo", city: "Kinshasa", genre: "Soukous", media: "VG+", sleeve: "VG", price: 95, shipping: 14, addedAt: "2026-11-07", image: stock.recordsClose },
  { id: "ar-006", artist: "Soweto Shebeen Kings", title: "Mbaqanga Dust", format: "Test pressing", formatDetail: "LP, Test Pressing, 1 de 5", label: "Shebeen Records", catNo: "SHB 076", year: 1976, country: "Sudáfrica", city: "Johannesburgo", genre: "Mbaqanga", media: "VG+", sleeve: "Sin funda", price: 350, shipping: 20, addedAt: "2026-11-07", image: stock.turntableLid },
  { id: "ar-007", artist: "Chief Adewale & His Talking Drums", title: "Ibadan Sunday", format: "LP", formatDetail: "LP, Album, Orig.", label: "Ikeja Sound", catNo: "IKS-114", year: 1977, country: "Nigeria", city: "Ibadan", genre: "Juju", media: "VG", sleeve: "VG", price: 85, shipping: 14, addedAt: "2026-11-06", image: stock.recordSpines },
  { id: "ar-008", artist: "Douala Express", title: "Makossa Ferry", format: 'Single 7"', formatDetail: '7", Single', label: "Douala Sound", catNo: "DS 45-08", year: 1975, country: "Camerún", city: "Douala", genre: "Makossa", media: "NM", sleeve: "Genérica", price: 45, shipping: 9, addedAt: "2026-11-06", image: stock.whiteLabel1 },
  { id: "ar-009", artist: "Afro Volta Machine", title: "Kumasi Fire", format: "LP", formatDetail: "LP, Album", label: "Volta Records", catNo: "VR-201", year: 1976, country: "Ghana", city: "Kumasi", genre: "Afro-Funk", media: "VG+", sleeve: "VG+", price: 120, shipping: 14, addedAt: "2026-11-05", image: stock.turntableBlue },
  { id: "ar-010", artist: "Bekele Lemma", title: "Tizita Blue", format: 'Single 7"', formatDetail: '7", Single, Orig.', label: "Addis Phonograph", catNo: "AP 45-17", year: 1971, country: "Etiopía", city: "Addis Abeba", genre: "Ethio-Jazz", media: "VG+", sleeve: "Sin funda", price: 60, shipping: 9, addedAt: "2026-11-05", image: stock.spinRed },
  { id: "ar-011", artist: "Les Étoiles de Dakar", title: "Médina Nights", format: "LP", formatDetail: "LP, Album, Orig.", label: "Dakar Club", catNo: "DKC 003", year: 1978, country: "Senegal", city: "Dakar", genre: "Afro-Funk", media: "NM", sleeve: "VG+", price: 140, shipping: 14, addedAt: "2026-11-04", image: stock.recordsBlur },
  { id: "ar-012", artist: "Adrar Caravan Band", title: "Kidal Wind", format: "Acetato", formatDetail: "Acetato, 12\", Lado B", label: "Sahel Disques", catNo: "SD 8101", year: 1981, country: "Malí", city: "Kidal", genre: "Desert Blues", media: "VG", sleeve: "Genérica", notes: "Ligera deformación que no afecta la reproducción.", price: 290, shipping: 18, addedAt: "2026-11-04", image: stock.turntableLid },
  { id: "ar-013", artist: "Fouta Djallon Lights", title: "Conakry Sunrise", format: "EP", formatDetail: "EP, 12\"", label: "Niger Delta Disques", catNo: "NDD-12", year: 1973, country: "Guinea", city: "Conakry", genre: "Highlife", media: "VG+", sleeve: "VG", price: 70, shipping: 12, addedAt: "2026-11-03", image: stock.spinAbstract },
  { id: "ar-014", artist: "Orchestre Mangrove", title: "Rumba Matadi", format: "LP", formatDetail: "LP, Comp.", label: "Zaïre Lumière", catNo: "ZL 3044", year: 1983, country: "RD Congo", city: "Matadi", genre: "Soukous", media: "VG", sleeve: "G+", price: 55, shipping: 14, addedAt: "2026-11-03", image: stock.turntableAmber },
  { id: "ar-015", artist: "Cotonou Lagoon Club", title: "Vodoun Groove", format: "Test pressing", formatDetail: "LP, Test Pressing, 1 de 2", label: "Cotonou Vinyl", catNo: "CV 001", year: 1974, country: "Benín", city: "Cotonou", genre: "Afro-Funk", media: "NM", sleeve: "Sin funda", notes: "Uno de solo dos test pressings conocidos.", price: 460, shipping: 20, addedAt: "2026-11-02", image: stock.whiteLabel1 },
  { id: "ar-016", artist: "The Marina Street Horns", title: "Marina Session", format: "Acetato", formatDetail: "Acetato, 12\", 1/1", label: "Ikeja Sound", catNo: "IKS-ACE-3", year: 1975, country: "Nigeria", city: "Lagos", genre: "Afrobeat", media: "VG+", sleeve: "Genérica", notes: "Toma alternativa nunca publicada.", price: 590, shipping: 22, addedAt: "2026-11-02", image: stock.turntableAmber },
  { id: "ar-017", artist: "Umlazi Brothers", title: "Township Jive", format: "LP", formatDetail: "LP, Album", label: "Shebeen Records", catNo: "SHB 102", year: 1979, country: "Sudáfrica", city: "Durban", genre: "Mbaqanga", media: "VG+", sleeve: "VG+", price: 75, shipping: 14, addedAt: "2026-11-01", image: stock.spinRed },
  { id: "ar-018", artist: "Elmina Coast Band", title: "Cape Coast Love", format: 'Single 7"', formatDetail: '7", Single', label: "Volta Records", catNo: "VR 45-33", year: 1972, country: "Ghana", city: "Cape Coast", genre: "Highlife", media: "VG", sleeve: "Sin funda", price: 35, shipping: 9, addedAt: "2026-11-01", image: stock.whiteLabel2 },
  { id: "ar-019", artist: "Tesfaye & The Entoto Band", title: "Entoto Underground", format: "LP", formatDetail: "LP, Album, Orig.", label: "Addis Phonograph", catNo: "AP 2005", year: 1974, country: "Etiopía", city: "Addis Abeba", genre: "Ethio-Jazz", media: "NM", sleeve: "NM", price: 210, shipping: 16, addedAt: "2026-10-31", image: stock.spinAbstract },
  { id: "ar-020", artist: "Nairobi Hi-Fi Stars", title: "Benga Highway", format: "EP", formatDetail: "EP, 7\"", label: "Nairobi Hi-Fi", catNo: "NHF 07", year: 1980, country: "Kenia", city: "Nairobi", genre: "Soukous", media: "VG+", sleeve: "Genérica", price: 40, shipping: 9, addedAt: "2026-10-31", image: stock.recordsBlur },
  { id: "ar-021", artist: "Owo Juju Disciples", title: "Juju Jubilee", format: "LP", formatDetail: "LP, Album", label: "Niger Delta Disques", catNo: "NDD-207", year: 1982, country: "Nigeria", city: "Ondo", genre: "Juju", media: "VG+", sleeve: "VG", price: 65, shipping: 14, addedAt: "2026-10-30", image: stock.recordsClose },
  { id: "ar-022", artist: "Orchestre Sanaga", title: "Soul Douala", format: "Test pressing", formatDetail: "LP, Test Pressing, 1 de 4", label: "Douala Sound", catNo: "DS 7720", year: 1977, country: "Camerún", city: "Yaundé", genre: "Makossa", media: "VG+", sleeve: "Sin funda", price: 330, shipping: 20, addedAt: "2026-10-30", image: stock.turntableBW },
  { id: "ar-023", artist: "Niger Bend Orchestra", title: "Quai du Niger", format: "LP", formatDetail: "LP, Album, Orig.", label: "Sahel Disques", catNo: "SD 7505", year: 1975, country: "Malí", city: "Bamako", genre: "Afro-Funk", media: "VG", sleeve: "VG", price: 110, shipping: 14, addedAt: "2026-10-29", image: stock.recordSpines },
  { id: "ar-024", artist: "Lagos Ladies Choir", title: "Yaba Gospel Funk", format: 'Single 7"', formatDetail: '7", Single, Promo', label: "Ikeja Sound", catNo: "IKS 45-02", year: 1976, country: "Nigeria", city: "Lagos", genre: "Afrobeat", media: "NM", sleeve: "Genérica", price: 55, shipping: 9, addedAt: "2026-10-29", image: stock.recordsClose },
  { id: "ar-025", artist: "Les Neveux du Fleuve", title: "Kinshasa Ballroom", format: "Acetato", formatDetail: "Acetato, 10\", Lado A", label: "Zaïre Lumière", catNo: "ZL-ACE-9", year: 1970, country: "RD Congo", city: "Kinshasa", genre: "Soukous", media: "G+", sleeve: "Genérica", notes: "Desgaste visible; se vende por su rareza. Incluye digitalización restaurada.", price: 240, shipping: 18, addedAt: "2026-10-28", image: stock.whiteLabel1 },
  { id: "ar-026", artist: "Accra Hi-Life Collective", title: "Osu Castle Dance", format: "LP", formatDetail: "LP, Comp.", label: "Volta Records", catNo: "VR-310", year: 1984, country: "Ghana", city: "Accra", genre: "Highlife", media: "M", sleeve: "NM", notes: "Sin reproducir, guardado en archivo de la radio.", price: 160, shipping: 14, addedAt: "2026-10-28", image: stock.turntableBlue },
  { id: "ar-027", artist: "Harar Modal Ensemble", title: "Jugol Modal", format: "Test pressing", formatDetail: "LP, Test Pressing, 1 de 3", label: "Addis Phonograph", catNo: "AP 2011", year: 1973, country: "Etiopía", city: "Harar", genre: "Ethio-Jazz", media: "VG+", sleeve: "Sin funda", price: 410, shipping: 20, addedAt: "2026-10-27", image: stock.whiteLabel2 },
  { id: "ar-028", artist: "Soweto Groove Machine", title: "Kofifi Nights", format: "EP", formatDetail: "EP, 12\"", label: "Shebeen Records", catNo: "SHB-EP4", year: 1981, country: "Sudáfrica", city: "Soweto", genre: "Mbaqanga", media: "VG", sleeve: "VG", price: 50, shipping: 12, addedAt: "2026-10-27", image: stock.spinRed },
  { id: "ar-029", artist: "Orchestre Corniche", title: "Gorée Serenade", format: "LP", formatDetail: "LP, Album, Orig.", label: "Dakar Club", catNo: "DKC 011", year: 1980, country: "Senegal", city: "Dakar", genre: "Afro-Funk", media: "VG+", sleeve: "VG+", price: 130, shipping: 14, addedAt: "2026-10-26", image: stock.recordsBlur },
  { id: "ar-030", artist: "The Abeokuta Rhythm Kings", title: "Talking Drum Telegraph", format: "Acetato", formatDetail: "Acetato, 12\", 1/1", label: "Niger Delta Disques", catNo: "NDD-ACE-1", year: 1978, country: "Nigeria", city: "Abeokuta", genre: "Juju", media: "VG+", sleeve: "Genérica", price: 380, shipping: 18, addedAt: "2026-10-26", image: stock.turntableBW },
  { id: "ar-031", artist: "Wouri River Band", title: "Wouri Bridge", format: 'Single 7"', formatDetail: '7", Single', label: "Douala Sound", catNo: "DS 45-21", year: 1979, country: "Camerún", city: "Douala", genre: "Makossa", media: "VG+", sleeve: "Sin funda", price: 30, shipping: 9, addedAt: "2026-10-25", image: stock.whiteLabel1 },
  { id: "ar-032", artist: "Cercle de Tombouctou", title: "Cintas de Tombuctú", format: "LP", formatDetail: "LP, Album", label: "Sahel Disques", catNo: "SD 8803", year: 1988, country: "Malí", city: "Niafunké", genre: "Desert Blues", media: "NM", sleeve: "NM", price: 150, shipping: 14, addedAt: "2026-10-25", image: stock.turntableAmber },
  { id: "ar-033", artist: "Benin City Funk Union", title: "Oba's Groove", format: "LP", formatDetail: "LP, Album, Orig.", label: "Cotonou Vinyl", catNo: "CV 014", year: 1977, country: "Benín", city: "Porto-Novo", genre: "Afrobeat", media: "VG", sleeve: "G+", price: 90, shipping: 14, addedAt: "2026-10-24", image: stock.spinRed },
  { id: "ar-034", artist: "Zanzibar Taarab Ensemble", title: "Stone Town Strings", format: "EP", formatDetail: "EP, 7\"", label: "Nairobi Hi-Fi", catNo: "NHF 22", year: 1972, country: "Tanzania", city: "Zanzíbar", genre: "Highlife", media: "VG+", sleeve: "VG", price: 45, shipping: 9, addedAt: "2026-10-24", image: stock.spinAbstract },
  { id: "ar-035", artist: "Les Filles du Kasai", title: "Kasai Dance Hall", format: "Test pressing", formatDetail: "LP, Test Pressing, 1 de 5", label: "Zaïre Lumière", catNo: "ZL 3090", year: 1986, country: "RD Congo", city: "Kananga", genre: "Soukous", media: "NM", sleeve: "Sin funda", price: 270, shipping: 20, addedAt: "2026-10-23", image: stock.turntableLid },
  { id: "ar-036", artist: "Les Lagunaires", title: "Cotonou Rumba", format: 'Single 7"', formatDetail: '7", Single, Orig.', label: "Cotonou Vinyl", catNo: "CV 45-06", year: 1969, country: "Benín", city: "Cotonou", genre: "Afro-Funk", media: "VG", sleeve: "Sin funda", price: 65, shipping: 9, addedAt: "2026-10-23", image: stock.spinRed },
  { id: "ar-037", artist: "Kampala Jazz Kings", title: "Lake Victoria Swing", format: "LP", formatDetail: "LP, Album", label: "Nairobi Hi-Fi", catNo: "NHF 101", year: 1975, country: "Uganda", city: "Kampala", genre: "Highlife", media: "VG+", sleeve: "VG+", price: 80, shipping: 14, addedAt: "2026-10-22", image: stock.spinAbstract },
  { id: "ar-038", artist: "Allen Avenue Collective", title: "Ikeja Republic", format: "LP", formatDetail: "LP, Album, Orig.", label: "Ikeja Sound", catNo: "IKS-150", year: 1979, country: "Nigeria", city: "Lagos", genre: "Afrobeat", media: "NM", sleeve: "VG+", price: 180, shipping: 14, addedAt: "2026-10-22", image: stock.recordsClose },
  { id: "ar-039", artist: "Gondar Brass Society", title: "Fasilides Dub", format: "Acetato", formatDetail: "Acetato, 10\", Lado A", label: "Addis Phonograph", catNo: "AP-ACE-4", year: 1976, country: "Etiopía", city: "Gondar", genre: "Ethio-Jazz", media: "VG", sleeve: "Genérica", price: 450, shipping: 18, addedAt: "2026-10-21", image: stock.whiteLabel2 },
  { id: "ar-040", artist: "Pretoria Pennywhistlers", title: "Kwela Corner", format: 'Single 7"', formatDetail: '7", Single', label: "Shebeen Records", catNo: "SHB 45-11", year: 1968, country: "Sudáfrica", city: "Pretoria", genre: "Mbaqanga", media: "VG+", sleeve: "Sin funda", price: 40, shipping: 9, addedAt: "2026-10-21", image: stock.whiteLabel2 },
];

export const getDisc = (id: string) => discs.find((d) => d.id === id);

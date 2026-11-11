"use client";
import { useState, type ReactNode } from "react";

// Next vuelve a montar este template en cada cambio de página: aprovechamos para un
// fundido suave. Solo opacidad (un transform rompería el pin de la historia y los
// paneles fijos), y nunca en la primera carga, para no retrasar la entrada de ALEX.
let firstLoad = true;

export default function Template({ children }: { children: ReactNode }) {
  const [animate] = useState(() => {
    const a = !firstLoad;
    firstLoad = false;
    return a;
  });
  return <div className={animate ? "page-in" : undefined}>{children}</div>;
}

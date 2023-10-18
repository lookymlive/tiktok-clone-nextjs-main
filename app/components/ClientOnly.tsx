'use client';

import React, { useEffect, useState } from "react";

// Declaramos el componente funcional ClientOnly que toma un hijo (children) de tipo React.ReactNode.
export default function ClientOnly({ children }: { children: React.ReactNode }) {

  // Creamos un estado isClient y lo inicializamos como falso.
  const [isClient, setIsClient] = useState(false);

  // Utilizamos useEffect para cambiar el estado isClient a verdadero una vez que el componente se monta.
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Retornamos un fragmento que envuelve el contenido del hijo (children).
  // El contenido se renderizará solo si isClient es verdadero, de lo contrario, se mostrará como nulo (null).
  return (<> {isClient ? <div>{children}</div> : null} </>);
};

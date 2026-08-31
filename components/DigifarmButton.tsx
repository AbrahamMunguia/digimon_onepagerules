"use client";

import { useDigifarm } from "@/lib/digifarm-context";

export default function DigifarmButton({ digimonId }: { digimonId: number }) {
  const { has, toggle } = useDigifarm();
  const active = has(digimonId);

  return (
    <button type="button" onClick={() => toggle(digimonId)}>
      {active ? "Quitar del DigiFarm" : "Agregar al DigiFarm"}
    </button>
  );
}

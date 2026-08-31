"use client";

import { useDigifarm } from "@/lib/digifarm-context";
import type { Dictionary } from "@/app/[lang]/dictionaries";

export default function DigifarmButton({
  digimonId,
  dict,
}: {
  digimonId: number;
  dict: Pick<Dictionary["digifarm"], "add" | "remove">;
}) {
  const { has, toggle } = useDigifarm();
  const active = has(digimonId);

  return (
    <button type="button" onClick={() => toggle(digimonId)}>
      {active ? dict.remove : dict.add}
    </button>
  );
}

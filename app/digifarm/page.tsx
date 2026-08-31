"use client";

import { useEffect, useState, useTransition } from "react";
import { fetchDigimonsByIds } from "@/lib/actions";
import { useDigifarm } from "@/lib/digifarm-context";
import DigimonCard from "@/components/DigimonCard";
import type { Digimon } from "@/lib/types";

export default function DigifarmPage() {
  const { ids } = useDigifarm();
  const [digimons, setDigimons] = useState<Digimon[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      fetchDigimonsByIds(ids).then(setDigimons);
    });
  }, [ids]);

  return (
    <div>
      <h1>DigiFarm</h1>

      {isPending ? <p>Cargando...</p> : null}

      {!isPending && ids.length === 0 ? <p>Todavía no agregas digimons a tu DigiFarm.</p> : null}

      <div>
        {digimons.map((digimon) => (
          <DigimonCard key={digimon.id} digimon={digimon} />
        ))}
      </div>
    </div>
  );
}

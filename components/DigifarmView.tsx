"use client";

import { useEffect, useState, useTransition } from "react";
import { fetchDigimonsByIds } from "@/lib/actions";
import { useDigifarm } from "@/lib/digifarm-context";
import DigimonCard from "@/components/DigimonCard";
import type { Digimon } from "@/lib/types";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";

export default function DigifarmView({ lang, dict }: { lang: Locale; dict: Dictionary["digifarm"] }) {
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
      <h1>{dict.title}</h1>

      {isPending ? <p>{dict.loading}</p> : null}

      {!isPending && ids.length === 0 ? <p>{dict.empty}</p> : null}

      <div>
        {digimons.map((digimon) => (
          <DigimonCard key={digimon.id} digimon={digimon} lang={lang} digifarmDict={dict} />
        ))}
      </div>
    </div>
  );
}

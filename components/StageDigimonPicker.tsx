"use client";

import { useEffect, useState, useTransition } from "react";
import { fetchDigimonsByStages } from "@/lib/actions";
import type { Digimon } from "@/lib/types";
import type { Dictionary } from "@/app/[lang]/dictionaries";

const RESULTS_LIMIT = 20;

export default function StageDigimonPicker({
  stages,
  dict,
  onAdd,
}: {
  stages: string[];
  dict: Dictionary["evolutionTreeCreate"];
  onAdd: (digimon: Digimon) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Digimon[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      fetchDigimonsByStages(stages, query).then(setResults);
    });
    // stages is a freshly computed array on every render of the caller, but
    // its content (the slot) only changes when the tree actually changes, so
    // keying off its serialized form avoids re-fetching on every keystroke's
    // parent re-render for unrelated reasons.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stages.join(","), query]);

  const visible = results.slice(0, RESULTS_LIMIT);

  return (
    <div>
      <label>
        {dict.searchLabel}
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={dict.searchPlaceholder}
        />
      </label>

      {isPending ? <p>{dict.loading}</p> : null}

      {!isPending && results.length === 0 ? <p>{dict.noResults}</p> : null}

      {!isPending && results.length > 0 ? (
        <>
          <ul>
            {visible.map((digimon) => (
              <li key={digimon.id}>
                {digimon.name} ({digimon.stage.join(" / ")}){" "}
                <button type="button" onClick={() => onAdd(digimon)}>
                  {dict.addButton}
                </button>
              </li>
            ))}
          </ul>
          {results.length > RESULTS_LIMIT ? (
            <p>{dict.resultsTruncated.replace("{count}", String(RESULTS_LIMIT))}</p>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

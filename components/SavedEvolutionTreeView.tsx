"use client";

import { useEffect, useState } from "react";
import { fetchDigimonsByIds } from "@/lib/actions";
import { collectTreeDigimonIds, hydrateTree, type EvolutionTreeNode } from "@/lib/evolutionTreeCreate";
import { getSavedTree } from "@/lib/savedEvolutionTrees";
import ReadOnlyEvolutionTreeNode from "./ReadOnlyEvolutionTreeNode";
import type { Dictionary } from "@/app/[lang]/dictionaries";

type LoadState = "loading" | "not-found" | "ready";

export default function SavedEvolutionTreeView({
  id,
  dict,
}: {
  id: string;
  dict: Dictionary["evolutionTreeViewSaved"];
}) {
  const [state, setState] = useState<LoadState>("loading");
  const [root, setRoot] = useState<EvolutionTreeNode | null>(null);

  useEffect(() => {
    getSavedTree(id).then((saved) => {
      if (!saved) {
        setState("not-found");
        return;
      }
      const ids: number[] = [];
      collectTreeDigimonIds(saved.digimons, ids);
      fetchDigimonsByIds(ids).then((digimons) => {
        const map = new Map(digimons.map((digimon) => [digimon.id, digimon]));
        const hydrated = hydrateTree(saved.digimons, map);
        setRoot(hydrated);
        setState(hydrated ? "ready" : "not-found");
      });
    });
  }, [id]);

  if (state === "loading") return <p>{dict.loading}</p>;
  if (state === "not-found" || !root) return <p>{dict.notFound}</p>;

  return (
    <ul>
      <ReadOnlyEvolutionTreeNode node={root} />
    </ul>
  );
}

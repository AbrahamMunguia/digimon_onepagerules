"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { fetchDigimonsByIds } from "@/lib/actions";
import { deleteSavedTree, listSavedTrees, type SavedEvolutionTree } from "@/lib/savedEvolutionTrees";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";

export default function SavedEvolutionTreesList({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dictionary["evolutionTreeView"];
}) {
  const [trees, setTrees] = useState<SavedEvolutionTree[]>([]);
  const [rootNames, setRootNames] = useState<Map<string, string>>(new Map());
  const [isPending, startTransition] = useTransition();

  const refresh = useCallback(() => {
    startTransition(() => {
      listSavedTrees().then((savedTrees) => {
        const sorted = [...savedTrees].sort((a, b) => b.created_at.localeCompare(a.created_at));
        setTrees(sorted);
        fetchDigimonsByIds(sorted.map((tree) => tree.digimons.digimonId)).then((digimons) => {
          const nameByDigimonId = new Map(digimons.map((digimon) => [digimon.id, digimon.name]));
          setRootNames(new Map(sorted.map((tree) => [tree.id, nameByDigimonId.get(tree.digimons.digimonId) ?? "?"])));
        });
      });
    });
  }, []);

  useEffect(refresh, [refresh]);

  const handleDelete = useCallback(
    (id: string) => {
      if (!window.confirm(dict.confirmDeleteSaved)) return;
      deleteSavedTree(id).then(refresh);
    },
    [dict.confirmDeleteSaved, refresh],
  );

  if (isPending && trees.length === 0) return <p>{dict.loading}</p>;

  if (trees.length === 0) return <p>{dict.savedEmpty}</p>;

  return (
    <ul>
      {trees.map((tree) => (
        <li key={tree.id}>
          {rootNames.get(tree.id) ?? "?"} — {new Date(tree.created_at).toLocaleDateString(lang)}{" "}
          <Link href={`/${lang}/evolution-tree/view/saved/${tree.id}`}>{dict.viewSavedButton}</Link>{" "}
          <button type="button" onClick={() => handleDelete(tree.id)}>
            {dict.deleteSavedButton}
          </button>
        </li>
      ))}
    </ul>
  );
}

"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { fetchDigimonsByIds } from "@/lib/actions";
import {
  ROOT_STAGE,
  addChildNode,
  collectTreeDigimonIds,
  createChildNode,
  createRootNode,
  hydrateTree,
  removeNode,
  serializeTree,
  type EvolutionTreeNode as EvolutionTreeNodeData,
  type EvolutionTreeSlot,
  type SerializedTreeNode,
} from "@/lib/evolutionTreeCreate";
import { saveEvolutionTree } from "@/lib/savedEvolutionTrees";
import StageDigimonPicker from "./StageDigimonPicker";
import EvolutionTreeNode from "./EvolutionTreeNode";
import type { Digimon } from "@/lib/types";
import type { Dictionary } from "@/app/[lang]/dictionaries";

const STORAGE_KEY = "digimon-onepagerules:evolution-tree-draft";

export default function EvolutionTreeBuilder({ dict }: { dict: Dictionary["evolutionTreeCreate"] }) {
  const [root, setRoot] = useState<EvolutionTreeNodeData | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    let raw: string | null = null;
    try {
      raw = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      raw = null;
    }

    let stored: SerializedTreeNode | null = null;
    if (raw) {
      try {
        stored = JSON.parse(raw) as SerializedTreeNode;
      } catch {
        stored = null;
      }
    }

    const ids: number[] = [];
    if (stored) collectTreeDigimonIds(stored, ids);

    // Always going through fetchDigimonsByIds (even with an empty list) keeps
    // setRoot/setHydrated inside a .then() callback instead of running
    // synchronously in the effect body.
    startTransition(() => {
      fetchDigimonsByIds(ids).then((digimons) => {
        const map = new Map(digimons.map((digimon) => [digimon.id, digimon]));
        setRoot(stored ? hydrateTree(stored, map) : null);
        setHydrated(true);
      });
    });
  }, [startTransition]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (root) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(serializeTree(root)));
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Storage can be unavailable (private mode, quota); the tree still
      // works for the rest of the session from in-memory state.
    }
  }, [root, hydrated]);

  const handleAddRoot = useCallback((digimon: Digimon) => {
    setRoot(createRootNode(digimon));
  }, []);

  const handleAddChild = useCallback((parentId: string, digimon: Digimon, slot: EvolutionTreeSlot) => {
    setRoot((current) => (current ? addChildNode(current, parentId, createChildNode(digimon, slot)) : current));
  }, []);

  const handleRemove = useCallback((id: string) => {
    setRoot((current) => (current ? removeNode(current, id) : current));
  }, []);

  const handleReset = useCallback(() => {
    if (window.confirm(dict.confirmReset)) {
      setRoot(null);
      setSaveMessage(null);
    }
  }, [dict.confirmReset]);

  const handleSave = useCallback(() => {
    if (!root) return;
    saveEvolutionTree(root).then(() => setSaveMessage(dict.saveSuccess));
  }, [root, dict.saveSuccess]);

  if (!hydrated) return <p>{dict.loading}</p>;

  return (
    <div>
      <p>{dict.instructions}</p>

      {root ? (
        <>
          <button type="button" onClick={handleReset}>
            {dict.resetButton}
          </button>
          <button type="button" onClick={handleSave}>
            {dict.saveButton}
          </button>
          {saveMessage ? <p>{saveMessage}</p> : null}
          <ul>
            <EvolutionTreeNode node={root} dict={dict} onAddChild={handleAddChild} onRemove={handleRemove} />
          </ul>
        </>
      ) : (
        <>
          <h2>{dict.rootLabel}</h2>
          <StageDigimonPicker stages={[ROOT_STAGE]} dict={dict} onAdd={handleAddRoot} />
        </>
      )}
    </div>
  );
}

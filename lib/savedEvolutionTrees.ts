import { createNodeId, serializeTree, type EvolutionTreeNode, type SerializedTreeNode } from "./evolutionTreeCreate";

// Browser-only storage for user-saved evolution trees. Every function is
// declared async even though it's just localStorage today, so a later swap
// to a real database-backed API (e.g. server actions, like lib/data.ts's own
// "kept async so this can be swapped for a real fetch()/DB call" functions)
// won't require touching any call site.

const STORAGE_KEY = "digimon-onepagerules:evolution-trees";

export interface SavedEvolutionTree {
  id: string;
  digimons: SerializedTreeNode;
  created_at: string;
  updated_at: string;
}

function readStoredTrees(): SavedEvolutionTree[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStoredTrees(trees: SavedEvolutionTree[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trees));
  } catch {
    // Storage can be unavailable (private mode, quota); the caller's
    // in-memory result still reflects the intended change for this session.
  }
}

export async function listSavedTrees(): Promise<SavedEvolutionTree[]> {
  return readStoredTrees();
}

export async function getSavedTree(id: string): Promise<SavedEvolutionTree | undefined> {
  return readStoredTrees().find((tree) => tree.id === id);
}

export async function saveEvolutionTree(root: EvolutionTreeNode): Promise<SavedEvolutionTree> {
  const now = new Date().toISOString();
  const saved: SavedEvolutionTree = {
    id: createNodeId(),
    digimons: serializeTree(root),
    created_at: now,
    updated_at: now,
  };
  writeStoredTrees([...readStoredTrees(), saved]);
  return saved;
}

export async function deleteSavedTree(id: string): Promise<void> {
  writeStoredTrees(readStoredTrees().filter((tree) => tree.id !== id));
}

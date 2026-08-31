import type { Digimon } from "./types";

// The evolution tree creator's ladder rule (as opposed to lib/evolutionTree.ts,
// which reads the real digivolution graph): every tree starts at a single
// In-TrainingⅠ root, then climbs In-TrainingⅡ -> Rookie -> one or more of
// Armor/Champion/Ultimate/Hybrid -> Mega. Armor ends a branch outright; Mega
// only leaves room for optional Unknown/Xros Wars filler afterwards. Unknown
// and Xros Wars digimon can otherwise be slotted in at any step without
// advancing the ladder, since they don't have a fixed rung of their own.

export const ROOT_STAGE = "In-TrainingⅠ";

export const WILDCARD_STAGES = ["Unknown", "Xros Wars"] as const;

export type TierKey = "root" | "In-TrainingⅡ" | "Rookie" | "PostRookie" | "PostMega";

const TIER_STAGES: Record<TierKey, string[]> = {
  root: [ROOT_STAGE],
  "In-TrainingⅡ": ["In-TrainingⅡ"],
  Rookie: ["Rookie"],
  PostRookie: ["Armor", "Champion", "Ultimate", "Hybrid", "Mega"],
  PostMega: [],
};

const TIER_SEQUENCE: TierKey[] = ["root", "In-TrainingⅡ", "Rookie", "PostRookie"];

export function isWildcardStage(stage: string): boolean {
  return (WILDCARD_STAGES as readonly string[]).includes(stage);
}

// The full set of stage names valid for a given tree slot: the tier's own
// stage(s) plus the always-optional wildcard stages (none for the root,
// which must be a genuine In-TrainingⅠ).
export function candidateStagesForTier(tier: TierKey): string[] {
  if (tier === "root") return TIER_STAGES.root;
  return [...TIER_STAGES[tier], ...WILDCARD_STAGES];
}

// A digimon can carry several stage tags (e.g. ["Mega", "Xros Wars"]); this
// picks the one that justifies its placement in this slot, preferring a real
// ladder stage over a wildcard so the ladder keeps advancing when possible.
export function pickMatchedStage(digimon: Digimon, candidateStages: string[]): string {
  const real = digimon.stage.find((stage) => candidateStages.includes(stage) && !isWildcardStage(stage));
  const fallback = digimon.stage.find((stage) => candidateStages.includes(stage));
  const matched = real ?? fallback;
  if (!matched) {
    throw new Error(`${digimon.name} doesn't carry any of the expected stages: ${candidateStages.join(", ")}`);
  }
  return matched;
}

export interface EvolutionTreeSlot {
  tier: TierKey;
  stages: string[];
}

// Given the stage a node was matched on and the tier its own slot came from,
// returns the slot its children should be picked from, or null if the node
// can't evolve any further (Armor).
export function childSlot(matchedStage: string, tier: TierKey): EvolutionTreeSlot | null {
  if (matchedStage === "Armor") return null;

  if (isWildcardStage(matchedStage)) {
    return { tier, stages: candidateStagesForTier(tier) };
  }

  if (matchedStage === "Mega") {
    return { tier: "PostMega", stages: candidateStagesForTier("PostMega") };
  }

  if (tier === "PostRookie" || tier === "PostMega") {
    return { tier, stages: candidateStagesForTier(tier) };
  }

  const nextTier = TIER_SEQUENCE[TIER_SEQUENCE.indexOf(tier) + 1];
  return nextTier ? { tier: nextTier, stages: candidateStagesForTier(nextTier) } : null;
}

export interface EvolutionTreeNode {
  id: string;
  digimon: Digimon;
  stage: string;
  tier: TierKey;
  children: EvolutionTreeNode[];
}

export function createNodeId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return Math.random().toString(36).slice(2);
}

export function createRootNode(digimon: Digimon): EvolutionTreeNode {
  return { id: createNodeId(), digimon, stage: ROOT_STAGE, tier: "root", children: [] };
}

export function createChildNode(digimon: Digimon, slot: EvolutionTreeSlot): EvolutionTreeNode {
  return {
    id: createNodeId(),
    digimon,
    stage: pickMatchedStage(digimon, slot.stages),
    tier: slot.tier,
    children: [],
  };
}

export function addChildNode(
  node: EvolutionTreeNode,
  parentId: string,
  child: EvolutionTreeNode,
): EvolutionTreeNode {
  if (node.id === parentId) return { ...node, children: [...node.children, child] };
  return { ...node, children: node.children.map((current) => addChildNode(current, parentId, child)) };
}

export function removeNode(node: EvolutionTreeNode, id: string): EvolutionTreeNode {
  return {
    ...node,
    children: node.children.filter((child) => child.id !== id).map((child) => removeNode(child, id)),
  };
}

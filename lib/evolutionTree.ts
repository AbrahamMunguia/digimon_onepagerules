import { getAllDigimons, getDigimonById, getDigimonsByIds } from "./data";
import { relationshipEdges } from "./relationships";
import type { EvolutionGraph } from "./types";

// Unlike lib/relationships.ts (which builds a tree-of-copies and silently
// drops a node the second time it's reached), this walks the full reachable
// subgraph from a root and keeps every edge — so a Digimon with two prior
// forms (e.g. reached from two different branches) stays a single node with
// two incoming edges, instead of being duplicated or dropped.
export async function getEvolutionGraph(rootId: number): Promise<EvolutionGraph | null> {
  const root = await getDigimonById(rootId);
  if (!root) return null;

  const nodeIds = new Set<number>([rootId]);
  const queue = [rootId];
  while (queue.length > 0) {
    const currentId = queue.shift()!;
    for (const edge of relationshipEdges) {
      if (edge.from === currentId && !nodeIds.has(edge.to)) {
        nodeIds.add(edge.to);
        queue.push(edge.to);
      }
    }
  }

  const nodes = await getDigimonsByIds([...nodeIds]);
  const edges = relationshipEdges.filter((edge) => nodeIds.has(edge.from) && nodeIds.has(edge.to));

  return { nodes, edges };
}

export async function getEvolutionRoots() {
  const digimons = await getAllDigimons();
  const rootIdsWithEdges = new Set(relationshipEdges.map((edge) => edge.from));
  return digimons.filter(
    (digimon) => digimon.stage.includes("In-TrainingⅠ") && rootIdsWithEdges.has(digimon.id),
  );
}

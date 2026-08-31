import edges from "@/data/relationships.json";
import { getDigimonById, digimonIds } from "./data";
import { RelationshipEdgeArraySchema } from "./schemas";
import type { Digimon, RelationshipEdge, RelationshipNode, RelationshipTree } from "./types";

export const relationshipEdges: RelationshipEdge[] = RelationshipEdgeArraySchema.parse(edges);

for (const edge of relationshipEdges) {
  if (!digimonIds.has(edge.from) || !digimonIds.has(edge.to)) {
    throw new Error(
      `data/relationships.json has a dangling edge: ${edge.from} -> ${edge.to} references a digimon id that doesn't exist in data/digimon.json`,
    );
  }
}

function getChildIds(id: number): number[] {
  return relationshipEdges.filter((edge) => edge.from === id).map((edge) => edge.to);
}

function getParentIds(id: number): number[] {
  return relationshipEdges.filter((edge) => edge.to === id).map((edge) => edge.from);
}

async function buildDescendants(id: number, visited: Set<number>): Promise<RelationshipNode[]> {
  const childIds = getChildIds(id).filter((childId) => !visited.has(childId));

  const nodes: RelationshipNode[] = [];
  for (const childId of childIds) {
    visited.add(childId);
    const digimon = await getDigimonById(childId);
    if (!digimon) continue;
    nodes.push({
      digimon,
      children: await buildDescendants(childId, visited),
    });
  }
  return nodes;
}

async function getAncestorChain(id: number): Promise<Digimon[]> {
  const chain: Digimon[] = [];
  const visited = new Set<number>([id]);
  let currentId = id;

  // Real digivolution branches (multiple prior forms) aren't modeled yet, so
  // this follows only the first known parent to keep a single linear chain.
  while (true) {
    const [parentId] = getParentIds(currentId);
    if (parentId === undefined || visited.has(parentId)) break;
    const parentDigimon = await getDigimonById(parentId);
    if (!parentDigimon) break;
    chain.unshift(parentDigimon);
    visited.add(parentId);
    currentId = parentId;
  }

  return chain;
}

export async function getRelationshipTree(id: number): Promise<RelationshipTree | null> {
  const digimon = await getDigimonById(id);
  if (!digimon) return null;

  const [ancestors, descendants] = await Promise.all([
    getAncestorChain(id),
    buildDescendants(id, new Set([id])),
  ]);

  return { digimon, ancestors, descendants };
}

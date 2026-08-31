import edges from "@/data/relationships.json";
import { getProductById, productIds } from "./data";
import { RelationshipEdgeArraySchema } from "./schemas";
import type { Product, RelationshipEdge, RelationshipNode, RelationshipTree } from "./types";

const relationshipEdges: RelationshipEdge[] = RelationshipEdgeArraySchema.parse(edges);

for (const edge of relationshipEdges) {
  if (!productIds.has(edge.from) || !productIds.has(edge.to)) {
    throw new Error(
      `data/relationships.json has a dangling edge: ${edge.from} -> ${edge.to} references a product id that doesn't exist in data/digimon.json`,
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
    const product = await getProductById(childId);
    if (!product) continue;
    nodes.push({
      product,
      children: await buildDescendants(childId, visited),
    });
  }
  return nodes;
}

async function getAncestorChain(id: number): Promise<Product[]> {
  const chain: Product[] = [];
  const visited = new Set<number>([id]);
  let currentId = id;

  // Real digivolution branches (multiple prior forms) aren't modeled yet, so
  // this follows only the first known parent to keep a single linear chain.
  while (true) {
    const [parentId] = getParentIds(currentId);
    if (parentId === undefined || visited.has(parentId)) break;
    const parentProduct = await getProductById(parentId);
    if (!parentProduct) break;
    chain.unshift(parentProduct);
    visited.add(parentId);
    currentId = parentId;
  }

  return chain;
}

export async function getRelationshipTree(id: number): Promise<RelationshipTree | null> {
  const product = await getProductById(id);
  if (!product) return null;

  const [ancestors, descendants] = await Promise.all([
    getAncestorChain(id),
    buildDescendants(id, new Set([id])),
  ]);

  return { product, ancestors, descendants };
}

import type { EvolutionTreeNode } from "@/lib/evolutionTreeCreate";

export default function ReadOnlyEvolutionTreeNode({ node }: { node: EvolutionTreeNode }) {
  return (
    <li>
      <span>
        {node.digimon.name} ({node.stage})
      </span>
      {node.children.length > 0 ? (
        <ul>
          {node.children.map((child) => (
            <ReadOnlyEvolutionTreeNode key={child.id} node={child} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

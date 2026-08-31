import Link from "next/link";
import type { RelationshipNode, RelationshipTree as RelationshipTreeData } from "@/lib/types";

function DescendantList({ nodes }: { nodes: RelationshipNode[] }) {
  if (nodes.length === 0) return null;
  return (
    <ul>
      {nodes.map((node) => (
        <li key={node.digimon.id}>
          <Link href={`/digimons/${node.digimon.id}`}>{node.digimon.name}</Link>
          <DescendantList nodes={node.children} />
        </li>
      ))}
    </ul>
  );
}

export default function RelationshipTree({ tree }: { tree: RelationshipTreeData }) {
  const hasAncestors = tree.ancestors.length > 0;
  const hasDescendants = tree.descendants.length > 0;

  return (
    <div>
      <section>
        <h2>Formas anteriores</h2>
        {hasAncestors ? (
          <ul>
            {tree.ancestors.map((ancestor) => (
              <li key={ancestor.id}>
                <Link href={`/digimons/${ancestor.id}`}>{ancestor.name}</Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>Sin datos de digievolución anterior todavía.</p>
        )}
      </section>

      <section>
        <h2>{tree.digimon.name}</h2>
        <p>{tree.digimon.stage.join(" / ")}</p>
      </section>

      <section>
        <h2>Formas siguientes</h2>
        {hasDescendants ? (
          <DescendantList nodes={tree.descendants} />
        ) : (
          <p>Sin datos de digievolución siguiente todavía.</p>
        )}
      </section>
    </div>
  );
}

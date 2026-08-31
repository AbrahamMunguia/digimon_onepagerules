import Link from "next/link";
import type { RelationshipNode, RelationshipTree as RelationshipTreeData } from "@/lib/types";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";

function DescendantList({ nodes, lang }: { nodes: RelationshipNode[]; lang: Locale }) {
  if (nodes.length === 0) return null;
  return (
    <ul>
      {nodes.map((node) => (
        <li key={node.digimon.id}>
          <Link href={`/${lang}/digimons/${node.digimon.id}`}>{node.digimon.name}</Link>
          <DescendantList nodes={node.children} lang={lang} />
        </li>
      ))}
    </ul>
  );
}

export default function RelationshipTree({
  tree,
  lang,
  dict,
}: {
  tree: RelationshipTreeData;
  lang: Locale;
  dict: Dictionary["relationships"];
}) {
  const hasAncestors = tree.ancestors.length > 0;
  const hasDescendants = tree.descendants.length > 0;

  return (
    <div>
      <section>
        <h2>{dict.ancestorsTitle}</h2>
        {hasAncestors ? (
          <ul>
            {tree.ancestors.map((ancestor) => (
              <li key={ancestor.id}>
                <Link href={`/${lang}/digimons/${ancestor.id}`}>{ancestor.name}</Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>{dict.noAncestors}</p>
        )}
      </section>

      <section>
        <h2>{tree.digimon.name}</h2>
        <p>{tree.digimon.stage.join(" / ")}</p>
      </section>

      <section>
        <h2>{dict.descendantsTitle}</h2>
        {hasDescendants ? (
          <DescendantList nodes={tree.descendants} lang={lang} />
        ) : (
          <p>{dict.noDescendants}</p>
        )}
      </section>
    </div>
  );
}

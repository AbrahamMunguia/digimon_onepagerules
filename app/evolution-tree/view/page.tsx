import Link from "next/link";
import { getEvolutionRoots } from "@/lib/evolutionTree";

export default async function EvolutionTreeViewPage() {
  const roots = await getEvolutionRoots();

  return (
    <div>
      <p>
        <Link href="/evolution-tree">Volver a Evolution Tree</Link>
      </p>
      <h1>Evolution Tree: View</h1>
      <p>Elige una línea evolutiva para visualizar:</p>
      <ul>
        {roots.map((digimon) => (
          <li key={digimon.id}>
            <Link href={`/evolution-tree/view/${digimon.id}`}>{digimon.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

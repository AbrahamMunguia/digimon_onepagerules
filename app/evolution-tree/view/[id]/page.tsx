import Link from "next/link";
import { notFound } from "next/navigation";
import EvolutionTreeDiagram from "@/components/EvolutionTreeDiagram";
import { getEvolutionGraph, getEvolutionRoots } from "@/lib/evolutionTree";

export async function generateStaticParams() {
  const roots = await getEvolutionRoots();
  return roots.map((digimon) => ({ id: String(digimon.id) }));
}

export default async function EvolutionTreeViewDetailPage({
  params,
}: PageProps<"/evolution-tree/view/[id]">) {
  const { id } = await params;
  const graph = await getEvolutionGraph(Number(id));
  if (!graph) notFound();

  return (
    <div>
      <p>
        <Link href="/evolution-tree/view">Volver a la lista</Link>
      </p>
      <EvolutionTreeDiagram graph={graph} />
    </div>
  );
}

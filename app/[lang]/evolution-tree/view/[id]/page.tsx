import Link from "next/link";
import { notFound } from "next/navigation";
import EvolutionTreeDiagram from "@/components/EvolutionTreeDiagram";
import { getEvolutionGraph, getEvolutionRoots } from "@/lib/evolutionTree";
import { getDictionary, hasLocale } from "../../../dictionaries";

export async function generateStaticParams() {
  const roots = await getEvolutionRoots();
  return roots.map((digimon) => ({ id: String(digimon.id) }));
}

export default async function EvolutionTreeViewDetailPage({
  params,
}: PageProps<"/[lang]/evolution-tree/view/[id]">) {
  const { lang, id } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  const graph = await getEvolutionGraph(Number(id));
  if (!graph) notFound();

  return (
    <div>
      <p>
        <Link href={`/${lang}/evolution-tree/view`}>{dict.evolutionTreeViewDetail.backToList}</Link>
      </p>
      <EvolutionTreeDiagram graph={graph} />
    </div>
  );
}

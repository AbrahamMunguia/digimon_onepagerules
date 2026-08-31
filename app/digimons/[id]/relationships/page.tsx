import Link from "next/link";
import { notFound } from "next/navigation";
import RelationshipTree from "@/components/RelationshipTree";
import { getAllDigimons } from "@/lib/data";
import { getRelationshipTree } from "@/lib/relationships";

export async function generateStaticParams() {
  const digimons = await getAllDigimons();
  return digimons.map((digimon) => ({ id: String(digimon.id) }));
}

export default async function DigimonRelationshipsPage({
  params,
}: PageProps<"/digimons/[id]/relationships">) {
  const { id } = await params;
  const tree = await getRelationshipTree(Number(id));
  if (!tree) notFound();

  return (
    <div>
      <p>
        <Link href={`/digimons/${id}`}>Volver al digimon</Link>
      </p>
      <RelationshipTree tree={tree} />
    </div>
  );
}

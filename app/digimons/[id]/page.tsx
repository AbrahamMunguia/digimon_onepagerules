import Link from "next/link";
import { notFound } from "next/navigation";
import DigifarmButton from "@/components/DigifarmButton";
import { getAllDigimons, getDigimonById } from "@/lib/data";

export async function generateStaticParams() {
  const digimons = await getAllDigimons();
  return digimons.map((digimon) => ({ id: String(digimon.id) }));
}

export default async function DigimonDetailPage({ params }: PageProps<"/digimons/[id]">) {
  const { id } = await params;
  const digimon = await getDigimonById(Number(id));
  if (!digimon) notFound();

  return (
    <div>
      <p>
        <Link href="/digimons">Volver a digimons</Link>
      </p>
      <h1>{digimon.name}</h1>
      <p>Etapa: {digimon.stage.join(" / ")}</p>
      <DigifarmButton digimonId={digimon.id} />
      <p>
        <Link href={`/digimons/${digimon.id}/relationships`}>Ver árbol genealógico</Link>
      </p>
    </div>
  );
}

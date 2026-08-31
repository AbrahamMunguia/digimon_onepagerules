import Link from "next/link";
import { notFound } from "next/navigation";
import RelationshipTree from "@/components/RelationshipTree";
import { getAllDigimons } from "@/lib/data";
import { getRelationshipTree } from "@/lib/relationships";
import { getDictionary, hasLocale } from "../../../dictionaries";

export async function generateStaticParams() {
  const digimons = await getAllDigimons();
  return digimons.map((digimon) => ({ id: String(digimon.id) }));
}

export default async function DigimonRelationshipsPage({
  params,
}: PageProps<"/[lang]/digimons/[id]/relationships">) {
  const { lang, id } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  const tree = await getRelationshipTree(Number(id));
  if (!tree) notFound();

  return (
    <div>
      <p>
        <Link href={`/${lang}/digimons/${id}`}>{dict.relationships.backToDigimon}</Link>
      </p>
      <RelationshipTree tree={tree} lang={lang} dict={dict.relationships} />
    </div>
  );
}

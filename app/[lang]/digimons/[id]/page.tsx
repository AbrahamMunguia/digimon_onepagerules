import Link from "next/link";
import { notFound } from "next/navigation";
import DigifarmButton from "@/components/DigifarmButton";
import { getAllDigimons, getDigimonById } from "@/lib/data";
import { getDictionary, hasLocale } from "../../dictionaries";

export async function generateStaticParams() {
  const digimons = await getAllDigimons();
  return digimons.map((digimon) => ({ id: String(digimon.id) }));
}

export default async function DigimonDetailPage({ params }: PageProps<"/[lang]/digimons/[id]">) {
  const { lang, id } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  const digimon = await getDigimonById(Number(id));
  if (!digimon) notFound();

  return (
    <div>
      <p>
        <Link href={`/${lang}/digimons`}>{dict.digimonDetail.backToDigimons}</Link>
      </p>
      <h1>{digimon.name}</h1>
      <p>
        {dict.digimonDetail.stage}: {digimon.stage.join(" / ")}
      </p>
      <DigifarmButton digimonId={digimon.id} dict={dict.digifarm} />
      <p>
        <Link href={`/${lang}/digimons/${digimon.id}/relationships`}>
          {dict.digimonDetail.viewRelationships}
        </Link>
      </p>
    </div>
  );
}

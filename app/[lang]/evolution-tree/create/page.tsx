import Link from "next/link";
import EvolutionTreeBuilder from "@/components/EvolutionTreeBuilder";
import { getDictionary, hasLocale } from "../../dictionaries";

export default async function EvolutionTreeCreatePage({
  params,
}: PageProps<"/[lang]/evolution-tree/create">) {
  const { lang } = await params;
  if (!hasLocale(lang)) return null;
  const dict = await getDictionary(lang);

  return (
    <div>
      <p>
        <Link href={`/${lang}/evolution-tree`}>{dict.evolutionTreeCreate.backToEvolutionTree}</Link>
      </p>
      <h1>{dict.evolutionTreeCreate.title}</h1>
      <EvolutionTreeBuilder dict={dict.evolutionTreeCreate} />
    </div>
  );
}

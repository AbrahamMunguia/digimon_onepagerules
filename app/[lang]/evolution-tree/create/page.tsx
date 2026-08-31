import { getDictionary, hasLocale } from "../../dictionaries";

export default async function EvolutionTreeCreatePage({
  params,
}: PageProps<"/[lang]/evolution-tree/create">) {
  const { lang } = await params;
  if (!hasLocale(lang)) return null;
  const dict = await getDictionary(lang);

  return (
    <div>
      <h1>{dict.evolutionTreeCreate.title}</h1>
      <p>{dict.evolutionTreeCreate.comingSoon}</p>
    </div>
  );
}

import Link from "next/link";
import { getEvolutionRoots } from "@/lib/evolutionTree";
import { getDictionary, hasLocale } from "../../dictionaries";

export default async function EvolutionTreeViewPage({
  params,
}: PageProps<"/[lang]/evolution-tree/view">) {
  const { lang } = await params;
  if (!hasLocale(lang)) return null;
  const dict = await getDictionary(lang);
  const roots = await getEvolutionRoots();

  return (
    <div>
      <p>
        <Link href={`/${lang}/evolution-tree`}>{dict.evolutionTreeView.backToEvolutionTree}</Link>
      </p>
      <h1>{dict.evolutionTreeView.title}</h1>
      <p>{dict.evolutionTreeView.chooseLine}</p>
      <ul>
        {roots.map((digimon) => (
          <li key={digimon.id}>
            <Link href={`/${lang}/evolution-tree/view/${digimon.id}`}>{digimon.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

import Link from "next/link";
import { getDictionary, hasLocale } from "../dictionaries";

export default async function EvolutionTreePage({ params }: PageProps<"/[lang]/evolution-tree">) {
  const { lang } = await params;
  if (!hasLocale(lang)) return null;
  const dict = await getDictionary(lang);

  return (
    <div>
      <h1>{dict.evolutionTree.title}</h1>
      <ul>
        <li>
          <Link href={`/${lang}/evolution-tree/create`}>{dict.evolutionTree.create}</Link>
        </li>
        <li>
          <Link href={`/${lang}/evolution-tree/view`}>{dict.evolutionTree.view}</Link>
        </li>
      </ul>
    </div>
  );
}

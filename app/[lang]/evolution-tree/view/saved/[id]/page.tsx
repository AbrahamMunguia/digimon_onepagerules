import Link from "next/link";
import { notFound } from "next/navigation";
import SavedEvolutionTreeView from "@/components/SavedEvolutionTreeView";
import { getDictionary, hasLocale } from "../../../../dictionaries";

export default async function EvolutionTreeViewSavedDetailPage({
  params,
}: PageProps<"/[lang]/evolution-tree/view/saved/[id]">) {
  const { lang, id } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <div>
      <p>
        <Link href={`/${lang}/evolution-tree/view`}>{dict.evolutionTreeViewSaved.backToList}</Link>
      </p>
      <SavedEvolutionTreeView id={id} dict={dict.evolutionTreeViewSaved} />
    </div>
  );
}

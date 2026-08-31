import Link from "next/link";
import DigifarmCount from "./DigifarmCount";
import LanguageSwitcher from "./LanguageSwitcher";
import type { Dictionary } from "@/app/[lang]/dictionaries";

export default function Nav({
  lang,
  dict,
  languageSwitcherDict,
}: {
  lang: string;
  dict: Dictionary["nav"];
  languageSwitcherDict: Dictionary["languageSwitcher"];
}) {
  return (
    <nav>
      <Link href={`/${lang}`}>{dict.home}</Link>
      <Link href={`/${lang}/digimons`}>{dict.digimons}</Link>
      <Link href={`/${lang}/evolution-tree/create`}>{dict.evolutionTreeCreate}</Link>
      <Link href={`/${lang}/evolution-tree/view`}>{dict.evolutionTreeView}</Link>
      <Link href={`/${lang}/digifarm`}>
        {dict.digifarm} <DigifarmCount />
      </Link>
      <LanguageSwitcher lang={lang} dict={languageSwitcherDict} />
    </nav>
  );
}

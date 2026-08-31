import Link from "next/link";
import { lang } from "next/root-params";
import { defaultLocale, getDictionary, hasLocale } from "./dictionaries";

export default async function NotFound() {
  const currentLang = await lang();
  const locale = currentLang && hasLocale(currentLang) ? currentLang : defaultLocale;
  const dict = await getDictionary(locale);

  return (
    <div>
      <h1>{dict.notFound.title}</h1>
      <p>{dict.notFound.message}</p>
      <Link href={`/${locale}/digimons`}>{dict.notFound.backToDigimons}</Link>
    </div>
  );
}

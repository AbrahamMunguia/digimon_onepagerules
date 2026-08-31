import { lang } from "next/root-params";
import { defaultLocale, getDictionary, hasLocale } from "../dictionaries";

export default async function LoadingDigimons() {
  const currentLang = await lang();
  const locale = currentLang && hasLocale(currentLang) ? currentLang : defaultLocale;
  const dict = await getDictionary(locale);
  return <p>{dict.digimons.loading}</p>;
}

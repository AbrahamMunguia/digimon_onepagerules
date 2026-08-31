import { lang } from "next/root-params";
import { defaultLocale, getDictionary, hasLocale } from "../../dictionaries";

export default async function LoadingDigimon() {
  const currentLang = await lang();
  const locale = currentLang && hasLocale(currentLang) ? currentLang : defaultLocale;
  const dict = await getDictionary(locale);
  return <p>{dict.digimonDetail.loading}</p>;
}

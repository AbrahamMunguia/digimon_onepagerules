import DigifarmView from "@/components/DigifarmView";
import { getDictionary, hasLocale } from "../dictionaries";

export default async function DigifarmPage({ params }: PageProps<"/[lang]/digifarm">) {
  const { lang } = await params;
  if (!hasLocale(lang)) return null;
  const dict = await getDictionary(lang);

  return <DigifarmView lang={lang} dict={dict.digifarm} />;
}

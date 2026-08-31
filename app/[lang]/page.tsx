import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "./dictionaries";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <div>
      <h1>{dict.home.title}</h1>
      <p>{dict.home.intro}</p>
      <ul>
        <li>
          <Link href={`/${lang}/digimons`}>{dict.home.digimonsListLink}</Link> —{" "}
          {dict.home.digimonsListDescription}
        </li>
        <li>
          <Link href={`/${lang}/digifarm`}>{dict.home.digifarmLink}</Link> —{" "}
          {dict.home.digifarmDescription}
        </li>
      </ul>
      <p>{dict.home.note}</p>
    </div>
  );
}

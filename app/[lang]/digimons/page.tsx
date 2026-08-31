import { Suspense } from "react";
import DigimonCard from "@/components/DigimonCard";
import Pagination from "@/components/Pagination";
import { getDigimonsPage } from "@/lib/data";
import { getDictionary, hasLocale, type Dictionary, type Locale } from "../dictionaries";

function SearchForm({
  lang,
  query,
  dict,
}: {
  lang: Locale;
  query: string;
  dict: Dictionary["digimons"];
}) {
  return (
    <form action={`/${lang}/digimons`}>
      <label htmlFor="q">{dict.searchLabel}</label>
      <input type="text" id="q" name="q" defaultValue={query} />
      <button type="submit">{dict.searchButton}</button>
    </form>
  );
}

async function DigimonResults({
  lang,
  searchParams,
  dict,
}: {
  lang: Locale;
  searchParams: PageProps<"/[lang]/digimons">["searchParams"];
  dict: Dictionary;
}) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q : "";
  const pageParam = typeof params.page === "string" ? Number(params.page) : 1;

  const result = await getDigimonsPage({ page: pageParam, query });

  return (
    <>
      <SearchForm lang={lang} query={result.query} dict={dict.digimons} />
      <p>{dict.digimons.resultsCount.replace("{count}", String(result.total))}</p>
      <div>
        {result.items.map((digimon) => (
          <DigimonCard key={digimon.id} digimon={digimon} lang={lang} digifarmDict={dict.digifarm} />
        ))}
      </div>
      <Pagination
        lang={lang}
        page={result.page}
        totalPages={result.totalPages}
        query={result.query}
        dict={dict.pagination}
      />
    </>
  );
}

export default async function DigimonsPage(props: PageProps<"/[lang]/digimons">) {
  const { lang } = await props.params;
  if (!hasLocale(lang)) return null;
  const dict = await getDictionary(lang);

  return (
    <div>
      <h1>{dict.digimons.title}</h1>
      <Suspense fallback={<p>{dict.digimons.loading}</p>}>
        <DigimonResults lang={lang} searchParams={props.searchParams} dict={dict} />
      </Suspense>
    </div>
  );
}

import { Suspense } from "react";
import DigimonCard from "@/components/DigimonCard";
import Pagination from "@/components/Pagination";
import { getDigimonsPage } from "@/lib/data";

function SearchForm({ query }: { query: string }) {
  return (
    <form action="/digimons">
      <label htmlFor="q">Buscar por nombre</label>
      <input type="text" id="q" name="q" defaultValue={query} />
      <button type="submit">Buscar</button>
    </form>
  );
}

async function DigimonResults({
  searchParams,
}: Pick<PageProps<"/digimons">, "searchParams">) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q : "";
  const pageParam = typeof params.page === "string" ? Number(params.page) : 1;

  const result = await getDigimonsPage({ page: pageParam, query });

  return (
    <>
      <SearchForm query={result.query} />
      <p>{result.total} digimons encontrados.</p>
      <div>
        {result.items.map((digimon) => (
          <DigimonCard key={digimon.id} digimon={digimon} />
        ))}
      </div>
      <Pagination page={result.page} totalPages={result.totalPages} query={result.query} />
    </>
  );
}

export default function DigimonsPage(props: PageProps<"/digimons">) {
  return (
    <div>
      <h1>Digimons</h1>
      <Suspense fallback={<p>Cargando digimons...</p>}>
        <DigimonResults searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}

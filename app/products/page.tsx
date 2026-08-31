import { Suspense } from "react";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import { getProductsPage } from "@/lib/data";

function SearchForm({ query }: { query: string }) {
  return (
    <form action="/products">
      <label htmlFor="q">Buscar por nombre</label>
      <input type="text" id="q" name="q" defaultValue={query} />
      <button type="submit">Buscar</button>
    </form>
  );
}

async function ProductResults({
  searchParams,
}: Pick<PageProps<"/products">, "searchParams">) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q : "";
  const pageParam = typeof params.page === "string" ? Number(params.page) : 1;

  const result = await getProductsPage({ page: pageParam, query });

  return (
    <>
      <SearchForm query={result.query} />
      <p>{result.total} productos encontrados.</p>
      <div>
        {result.items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <Pagination page={result.page} totalPages={result.totalPages} query={result.query} />
    </>
  );
}

export default function ProductsPage(props: PageProps<"/products">) {
  return (
    <div>
      <h1>Productos</h1>
      <Suspense fallback={<p>Cargando productos...</p>}>
        <ProductResults searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}

import Link from "next/link";

export default function Pagination({
  page,
  totalPages,
  query,
}: {
  page: number;
  totalPages: number;
  query: string;
}) {
  if (totalPages <= 1) return null;

  const hrefFor = (targetPage: number) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    params.set("page", String(targetPage));
    return `/products?${params.toString()}`;
  };

  return (
    <nav aria-label="Paginación de productos">
      {page > 1 ? <Link href={hrefFor(page - 1)}>Anterior</Link> : <span>Anterior</span>}
      <span>
        {" "}
        Página {page} de {totalPages}{" "}
      </span>
      {page < totalPages ? <Link href={hrefFor(page + 1)}>Siguiente</Link> : <span>Siguiente</span>}
    </nav>
  );
}

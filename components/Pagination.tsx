import Link from "next/link";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";

export default function Pagination({
  lang,
  page,
  totalPages,
  query,
  dict,
}: {
  lang: Locale;
  page: number;
  totalPages: number;
  query: string;
  dict: Dictionary["pagination"];
}) {
  if (totalPages <= 1) return null;

  const hrefFor = (targetPage: number) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    params.set("page", String(targetPage));
    return `/${lang}/digimons?${params.toString()}`;
  };

  return (
    <nav aria-label={dict.ariaLabel}>
      {page > 1 ? (
        <Link href={hrefFor(page - 1)}>{dict.previous}</Link>
      ) : (
        <span>{dict.previous}</span>
      )}
      <span> {dict.pageOf.replace("{page}", String(page)).replace("{totalPages}", String(totalPages))} </span>
      {page < totalPages ? (
        <Link href={hrefFor(page + 1)}>{dict.next}</Link>
      ) : (
        <span>{dict.next}</span>
      )}
    </nav>
  );
}

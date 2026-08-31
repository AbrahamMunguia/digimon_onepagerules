import { cache } from "react";
import rawProducts from "@/data/digimon.json";
import type { Product, ProductsPage } from "./types";

const products = rawProducts as Product[];

export const PAGE_SIZE = 24;

// Wrapped in React's cache() so repeated calls within one render pass are
// deduped, and kept async so this can be swapped for a real fetch()/DB call
// later without touching any call site.
export const getAllProducts = cache(async (): Promise<Product[]> => products);

export const getProductById = cache(
  async (id: number): Promise<Product | undefined> =>
    products.find((product) => product.id === id),
);

export async function getProductsByIds(ids: number[]): Promise<Product[]> {
  const idSet = new Set(ids);
  return products.filter((product) => idSet.has(product.id));
}

export async function getProductsPage(options: {
  page?: number;
  query?: string;
}): Promise<ProductsPage> {
  const query = (options.query ?? "").trim().toLowerCase();
  const filtered = query
    ? products.filter((product) => product.name.toLowerCase().includes(query))
    : products;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, options.page ?? 1), totalPages);
  const start = (page - 1) * PAGE_SIZE;

  return {
    items: filtered.slice(start, start + PAGE_SIZE),
    page,
    pageSize: PAGE_SIZE,
    total: filtered.length,
    totalPages,
    query,
  };
}

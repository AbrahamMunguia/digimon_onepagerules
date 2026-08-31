import { cache } from "react";
import rawDigimons from "@/data/digimon.json";
import { DigimonArraySchema } from "./schemas";
import type { Digimon, DigimonsPage } from "./types";

const digimons: Digimon[] = DigimonArraySchema.parse(rawDigimons);

export const digimonIds = new Set(digimons.map((digimon) => digimon.id));

export const PAGE_SIZE = 24;

// Wrapped in React's cache() so repeated calls within one render pass are
// deduped, and kept async so this can be swapped for a real fetch()/DB call
// later without touching any call site.
export const getAllDigimons = cache(async (): Promise<Digimon[]> => digimons);

export const getDigimonById = cache(
  async (id: number): Promise<Digimon | undefined> =>
    digimons.find((digimon) => digimon.id === id),
);

export async function getDigimonsByIds(ids: number[]): Promise<Digimon[]> {
  const idSet = new Set(ids);
  return digimons.filter((digimon) => idSet.has(digimon.id));
}

export async function getDigimonsPage(options: {
  page?: number;
  query?: string;
}): Promise<DigimonsPage> {
  const query = (options.query ?? "").trim().toLowerCase();
  const filtered = query
    ? digimons.filter((digimon) => digimon.name.toLowerCase().includes(query))
    : digimons;

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

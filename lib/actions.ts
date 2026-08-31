"use server";

import { getDigimonsByIds, getDigimonsByStages } from "./data";
import type { Digimon } from "./types";

// Lets client components (e.g. the digifarm page) resolve digimon ids stored
// in localStorage into full records without bundling the digimon catalog
// into client JS.
export async function fetchDigimonsByIds(ids: number[]): Promise<Digimon[]> {
  return getDigimonsByIds(ids);
}

// Lets the evolution tree creator (client component) list candidates for a
// tree slot without bundling the full digimon catalog into client JS.
export async function fetchDigimonsByStages(stages: string[], query: string): Promise<Digimon[]> {
  return getDigimonsByStages(stages, query);
}

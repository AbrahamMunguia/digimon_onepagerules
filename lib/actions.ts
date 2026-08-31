"use server";

import { getDigimonsByIds } from "./data";
import type { Digimon } from "./types";

// Lets client components (e.g. the digifarm page) resolve digimon ids stored
// in localStorage into full records without bundling the digimon catalog
// into client JS.
export async function fetchDigimonsByIds(ids: number[]): Promise<Digimon[]> {
  return getDigimonsByIds(ids);
}

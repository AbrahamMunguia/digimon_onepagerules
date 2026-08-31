"use server";

import { getProductsByIds } from "./data";
import type { Product } from "./types";

// Lets client components (e.g. the wishlist page) resolve product ids stored
// in localStorage into full records without bundling the product catalog
// into client JS.
export async function fetchProductsByIds(ids: number[]): Promise<Product[]> {
  return getProductsByIds(ids);
}

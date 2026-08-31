"use client";

import { useWishlist } from "@/lib/wishlist-context";

export default function WishlistButton({ productId }: { productId: number }) {
  const { has, toggle } = useWishlist();
  const active = has(productId);

  return (
    <button type="button" onClick={() => toggle(productId)}>
      {active ? "Quitar de la wish list" : "Agregar a la wish list"}
    </button>
  );
}

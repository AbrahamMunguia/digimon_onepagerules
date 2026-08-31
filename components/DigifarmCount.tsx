"use client";

import { useWishlist } from "@/lib/wishlist-context";

export default function WishlistCount() {
  const { ids } = useWishlist();
  return <span>({ids.length})</span>;
}

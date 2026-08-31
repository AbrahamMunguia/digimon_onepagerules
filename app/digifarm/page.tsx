"use client";

import { useEffect, useState, useTransition } from "react";
import { fetchProductsByIds } from "@/lib/actions";
import { useWishlist } from "@/lib/wishlist-context";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/types";

export default function WishlistPage() {
  const { ids } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      fetchProductsByIds(ids).then(setProducts);
    });
  }, [ids]);

  return (
    <div>
      <h1>Wish list</h1>

      {isPending ? <p>Cargando...</p> : null}

      {!isPending && ids.length === 0 ? <p>Todavía no agregas productos a tu wish list.</p> : null}

      <div>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

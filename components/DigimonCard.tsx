import Link from "next/link";
import type { Product } from "@/lib/types";
import WishlistButton from "./WishlistButton";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article>
      <h3>
        <Link href={`/products/${product.id}`}>{product.name}</Link>
      </h3>
      <p>{product.stage.join(" / ")}</p>
      <WishlistButton productId={product.id} />
    </article>
  );
}

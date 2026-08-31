import Link from "next/link";
import { notFound } from "next/navigation";
import WishlistButton from "@/components/WishlistButton";
import { getAllProducts, getProductById } from "@/lib/data";

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product) => ({ id: String(product.id) }));
}

export default async function ProductDetailPage({ params }: PageProps<"/products/[id]">) {
  const { id } = await params;
  const product = await getProductById(Number(id));
  if (!product) notFound();

  return (
    <div>
      <p>
        <Link href="/products">Volver a productos</Link>
      </p>
      <h1>{product.name}</h1>
      <p>Etapa: {product.stage.join(" / ")}</p>
      <WishlistButton productId={product.id} />
      <p>
        <Link href={`/products/${product.id}/relationships`}>Ver árbol genealógico</Link>
      </p>
    </div>
  );
}

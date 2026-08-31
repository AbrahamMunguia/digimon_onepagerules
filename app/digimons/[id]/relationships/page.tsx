import Link from "next/link";
import { notFound } from "next/navigation";
import RelationshipTree from "@/components/RelationshipTree";
import { getAllProducts } from "@/lib/data";
import { getRelationshipTree } from "@/lib/relationships";

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product) => ({ id: String(product.id) }));
}

export default async function ProductRelationshipsPage({
  params,
}: PageProps<"/products/[id]/relationships">) {
  const { id } = await params;
  const tree = await getRelationshipTree(Number(id));
  if (!tree) notFound();

  return (
    <div>
      <p>
        <Link href={`/products/${id}`}>Volver al producto</Link>
      </p>
      <RelationshipTree tree={tree} />
    </div>
  );
}

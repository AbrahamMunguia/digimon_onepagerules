import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <h1>No encontrado</h1>
      <p>El producto o la página que buscas no existe.</p>
      <Link href="/products">Volver a productos</Link>
    </div>
  );
}

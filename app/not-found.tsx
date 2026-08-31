import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <h1>No encontrado</h1>
      <p>El digimon o la página que buscas no existe.</p>
      <Link href="/digimons">Volver a digimons</Link>
    </div>
  );
}

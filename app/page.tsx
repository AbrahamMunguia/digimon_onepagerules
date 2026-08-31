import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <h1>Digimon One Page Rules</h1>
      <p>Catálogo de referencia de Digimon y herramientas para armar tu lista de deseados.</p>
      <ul>
        <li>
          <Link href="/digimons">Lista de digimons</Link> — explora y busca en el catálogo completo.
        </li>
        <li>
          <Link href="/digifarm">DigiFarm</Link> — revisa los digimons que marcaste como deseados.
        </li>
      </ul>
      <p>
        Cada digimon en la lista tiene un enlace a su árbol genealógico (formas anteriores y
        siguientes de digievolución).
      </p>
    </div>
  );
}

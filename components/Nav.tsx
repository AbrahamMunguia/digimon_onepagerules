import Link from "next/link";
import DigifarmCount from "./DigifarmCount";

export default function Nav() {
  return (
    <nav>
      <Link href="/">Inicio</Link>
      <Link href="/digimons">Digimons</Link>
      <Link href="/digifarm">
        DigiFarm <DigifarmCount />
      </Link>
    </nav>
  );
}

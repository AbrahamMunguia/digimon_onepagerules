import Link from "next/link";
import WishlistCount from "./WishlistCount";

export default function Nav() {
  return (
    <nav>
      <Link href="/">Inicio</Link>
      <Link href="/products">Productos</Link>
      <Link href="/wishlist">
        Wish list <WishlistCount />
      </Link>
    </nav>
  );
}

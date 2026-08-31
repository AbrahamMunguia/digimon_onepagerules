import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import { WishlistProvider } from "@/lib/wishlist-context";

export const metadata: Metadata = {
  title: "Digimon One Page Rules",
  description: "Catálogo de productos, wish list y árbol genealógico de Digimon.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es">
      <body>
        <WishlistProvider>
          <Nav />
          <main>{children}</main>
        </WishlistProvider>
      </body>
    </html>
  );
}

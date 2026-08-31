import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { DigifarmProvider } from "@/lib/digifarm-context";

export const metadata: Metadata = {
  title: "Digimon One Page Rules",
  description: "Catálogo de digimons, DigiFarm y árbol genealógico de Digimon.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es">
      <body>
        <DigifarmProvider>
          <Nav />
          <main>{children}</main>
          <Footer />
        </DigifarmProvider>
      </body>
    </html>
  );
}

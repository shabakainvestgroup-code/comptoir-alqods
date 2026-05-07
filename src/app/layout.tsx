import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingWhatsAppButton } from "@/components/FloatingWhatsAppButton";
import { CartProvider } from "@/components/CartProvider";

export const metadata: Metadata = {
  title: "Comptoir AlQods | Matériel de bricolage et chantier à Marrakech",
  description: "Comptoir AlQods, votre site marchand à Marrakech pour l'électricité, sanitaires, plomberie, outillage, quincaillerie et peintures. Paiement par carte ou à la livraison.",
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <FloatingWhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}

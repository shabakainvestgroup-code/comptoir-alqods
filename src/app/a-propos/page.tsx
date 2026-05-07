import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "À propos | Comptoir AlQods",
  description: "Découvrez Comptoir AlQods, comptoir de vente de matériel bâtiment, bricolage et chantier à Marrakech."
};

export default function AboutPage() {
  return (
    <LegalPage
      title="À propos de nous"
      intro="Comptoir AlQods accompagne particuliers, artisans et professionnels dans leurs achats de matériel bâtiment, bricolage, rénovation et second œuvre."
      sections={[
        {
          title: "Notre mission",
          text: "Proposer une sélection claire de produits fiables, disponibles et adaptés aux besoins des chantiers au Maroc, avec un service de conseil avant achat."
        },
        {
          title: "Nos rayons",
          text: "Électricité, sanitaires, plomberie, outillage, quincaillerie et peintures : l’offre est pensée pour couvrir les besoins courants des travaux résidentiels, professionnels et de rénovation."
        },
        {
          title: "Notre approche",
          text: "Un comptoir efficace, des prix justes, une relation de proximité et une commande en ligne simple, avec livraison à Marrakech et partout au Maroc selon disponibilité."
        }
      ]}
    />
  );
}

import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Nos services | Comptoir AlQods",
  description: "Conseil, devis, livraison et accompagnement chantier avec Comptoir AlQods."
};

export default function ServicesPage() {
  return (
    <LegalPage
      title="Nos services"
      intro="Comptoir AlQods ne vend pas seulement des produits : l’équipe accompagne les clients dans le choix des solutions adaptées à leurs travaux."
      sections={[
        {
          title: "Conseil avant achat",
          text: "L’équipe peut orienter le client vers les références adaptées selon l’usage, les quantités, les contraintes techniques et le budget."
        },
        {
          title: "Devis chantier",
          text: "Pour les commandes professionnelles ou les volumes importants, une demande de devis peut être transmise via le formulaire de contact ou WhatsApp."
        },
        {
          title: "Livraison",
          text: "Les commandes peuvent être livrées à Marrakech ou hors Marrakech selon la disponibilité, le volume et les conditions de transport."
        },
        {
          title: "Préparation de commande",
          text: "Les produits sont préparés pour faciliter le retrait, la livraison ou la validation avec les équipes de chantier."
        }
      ]}
    />
  );
}

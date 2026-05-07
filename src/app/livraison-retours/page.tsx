import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Livraison & retours | Comptoir AlQods",
  description: "Conditions de livraison, retrait, retour et échange pour les commandes Comptoir AlQods à Marrakech et partout au Maroc."
};

export default function DeliveryReturnsPage() {
  return (
    <LegalPage
      title="Livraison & retours"
      intro="Comptoir AlQods organise la livraison selon la disponibilité des produits, la ville de destination et les contraintes liées aux produits de chantier."
      sections={[
        {
          title: "Livraison à Marrakech",
          text: "Les commandes livrables à Marrakech sont préparées après validation. Les frais de livraison indicatifs sont actuellement de 30 DH et peuvent être ajustés selon le volume, le poids ou la zone de livraison."
        },
        {
          title: "Livraison hors Marrakech",
          text: "Pour les autres villes du Maroc, les frais indicatifs sont de 60 DH. Pour les articles volumineux, lourds ou fragiles, l’équipe Comptoir AlQods peut confirmer un tarif spécifique avant expédition."
        },
        {
          title: "Retrait en magasin",
          text: "Le retrait en magasin peut être proposé selon disponibilité. L’équipe confirme la préparation de la commande avant passage du client."
        },
        {
          title: "Retours et échanges",
          text: "Les retours et échanges sont étudiés selon l’état du produit, son emballage, sa nature et les conditions de vente applicables. Les produits coupés, utilisés, installés ou commandés spécialement peuvent ne pas être repris."
        }
      ]}
    />
  );
}

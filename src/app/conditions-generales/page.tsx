import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Conditions générales | Comptoir AlQods",
  description: "Conditions générales de vente du site marchand Comptoir AlQods."
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Conditions générales"
      intro="Ces conditions encadrent les commandes passées auprès de Comptoir AlQods. Elles devront être validées juridiquement avant exploitation commerciale définitive."
      sections={[
        {
          title: "Produits et disponibilité",
          text: "Les produits présentés sur le site sont proposés selon les stocks disponibles. Comptoir AlQods peut contacter le client pour confirmer une référence, une quantité, une équivalence ou un délai."
        },
        {
          title: "Prix",
          text: "Les prix sont indiqués en dirhams marocains TTC lorsque cela est précisé. Les tarifs peuvent évoluer selon les arrivages, les fournisseurs et les conditions commerciales."
        },
        {
          title: "Commande",
          text: "Une commande passée sur le site est enregistrée puis préparée après validation des informations client, de la disponibilité des produits et du mode de livraison choisi."
        },
        {
          title: "Paiement",
          text: "Le site prévoit le paiement par carte bancaire via un prestataire de paiement adapté au Maroc et le paiement à la livraison. Le paiement par carte sera activé après contractualisation avec le prestataire choisi."
        },
        {
          title: "Responsabilité",
          text: "Le client doit vérifier la compatibilité des produits avec son projet. L’équipe Comptoir AlQods peut conseiller le client, mais l’installation doit être réalisée conformément aux normes et règles professionnelles."
        }
      ]}
    />
  );
}

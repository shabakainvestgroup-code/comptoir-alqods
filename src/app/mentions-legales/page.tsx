import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { store } from "@/data/store";

export const metadata: Metadata = {
  title: "Mentions légales | Comptoir AlQods",
  description: "Mentions légales du site Comptoir AlQods."
};

export default function LegalNoticePage() {
  return (
    <LegalPage
      title="Mentions légales"
      intro="Cette page regroupe les informations légales principales du site Comptoir AlQods. Les informations administratives pourront être complétées avant lancement commercial définitif."
      sections={[
        {
          title: "Éditeur du site",
          text: `${store.legalName}, enseigne spécialisée dans les produits de bricolage, bâtiment, rénovation et second œuvre, basée à ${store.city}, ${store.country}.`
        },
        {
          title: "Contact",
          text: `Téléphone : ${store.phone}. WhatsApp : ${store.whatsapp}. Email : ${store.email}. Adresse : ${store.address}.`
        },
        {
          title: "Hébergement",
          text: "Le site est hébergé sur Vercel pour la version web publique. Les informations d’hébergement pourront être complétées avec les coordonnées officielles de l’hébergeur."
        },
        {
          title: "Propriété intellectuelle",
          text: "Les textes, visuels, logos, éléments graphiques et contenus du site sont destinés à Comptoir AlQods et ne peuvent pas être réutilisés sans autorisation."
        }
      ]}
    />
  );
}

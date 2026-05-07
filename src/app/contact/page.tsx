import type { Metadata } from "next";
import { MapPin, Mail, Phone, MessageCircle } from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ContactForm } from "@/components/ContactForm";
import { BenefitStrip } from "@/components/BenefitStrip";
import { store } from "@/data/store";

export const metadata: Metadata = {
  title: "Contact | Comptoir AlQods Marrakech",
  description: "Contactez Comptoir AlQods à Marrakech pour une question, un devis ou un conseil sur vos produits de bricolage, bâtiment et chantier."
};

export default function ContactPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Contact" }]} />
      <section className="bg-soft-bg py-10">
        <div className="container-page">
          <div className="mb-8 max-w-3xl">
            <h1 className="text-4xl font-black text-navy">Contactez Comptoir AlQods</h1>
            <p className="mt-3 text-lg text-muted">Une question, un besoin de devis ou une demande spécifique ? Notre équipe vous accompagne dans le choix de vos produits et solutions.</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
            <div className="space-y-4">
              {[
                [Phone, "Téléphone", store.phone],
                [MessageCircle, "WhatsApp", store.whatsapp],
                [Mail, "Email", store.email],
                [MapPin, "Adresse", store.address]
              ].map(([Icon, title, text]) => {
                const TypedIcon = Icon as typeof Phone;
                return <div key={String(title)} className="flex gap-3 rounded-md border border-line bg-white p-5 shadow-sm"><TypedIcon className="text-turquoise" /><div><p className="font-extrabold text-navy">{String(title)}</p><p className="text-muted">{String(text)}</p></div></div>;
              })}
              <div className="overflow-hidden rounded-md border border-line bg-white shadow-sm">
                <iframe
                  title="Carte Comptoir AlQods"
                  src={store.mapEmbedUrl}
                  className="h-72 w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <a href={store.mapsSearchUrl} className="block px-5 py-3 text-sm font-bold text-turquoise" target="_blank" rel="noreferrer">
                  Ouvrir dans Google Maps →
                </a>
              </div>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>
      <BenefitStrip />
    </>
  );
}

import type { Metadata } from "next";
import { MapPin, Mail, Phone, MessageCircle } from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ContactForm } from "@/components/ContactForm";
import { BenefitStrip } from "@/components/BenefitStrip";

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
                [Phone, "Téléphone", "05 22 12 34 56"],
                [MessageCircle, "WhatsApp", "06 61 23 45 67"],
                [Mail, "Email", "contact@comptoiralqods.ma"],
                [MapPin, "Adresse", "Marrakech, Maroc"]
              ].map(([Icon, title, text]) => {
                const TypedIcon = Icon as typeof Phone;
                return <div key={String(title)} className="flex gap-3 rounded-md border border-line bg-white p-5 shadow-sm"><TypedIcon className="text-turquoise" /><div><p className="font-extrabold text-navy">{String(title)}</p><p className="text-muted">{String(text)}</p></div></div>;
              })}
              <div className="grid h-72 place-items-center rounded-md border border-line bg-white p-5 text-center text-muted shadow-sm">
                <div><MapPin className="mx-auto mb-3 text-turquoise" size={42} /><p className="font-extrabold text-navy">Carte Google Maps</p><p>Placeholder emplacement magasin à Marrakech</p></div>
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

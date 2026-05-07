import { CreditCard, Headphones, PackageCheck, RefreshCcw, Truck } from "lucide-react";

const benefits = [
  { icon: CreditCard, title: "Paiement sécurisé", text: "Carte bancaire ou paiement à la livraison" },
  { icon: Truck, title: "Livraison rapide", text: "Marrakech et partout au Maroc" },
  { icon: PackageCheck, title: "Produits de qualité", text: "Sélection professionnelle" },
  { icon: Headphones, title: "Service client", text: "Conseils avant achat" },
  { icon: RefreshCcw, title: "Retour / échange", text: "Selon conditions de vente" }
];

export function BenefitStrip() {
  return (
    <section className="border-y border-line bg-white">
      <div className="container-page grid gap-4 py-6 sm:grid-cols-2 lg:grid-cols-5">
        {benefits.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-turquoise/10 text-turquoise"><Icon size={20} /></div>
            <div><p className="font-extrabold text-navy">{title}</p><p className="text-sm text-muted">{text}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}

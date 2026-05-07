import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { categories } from "@/data/categories";
import { legalPages, store } from "@/data/store";

export function Footer() {
  return (
    <footer className="bg-navy-deep text-white">
      <div className="container-page grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-1">
          <BrandLogo />
          <p className="mt-4 text-sm text-white/75">Votre partenaire de confiance pour tous vos travaux, chantiers et aménagements.</p>
          <p className="mt-4 text-sm font-bold text-turquoise-light">Facebook · Instagram · LinkedIn</p>
        </div>
        <div>
          <h3 className="mb-4 font-extrabold">Catégories</h3>
          <div className="space-y-2 text-sm text-white/75">
            {categories.map((category) => (
              <Link key={category.slug} className="block hover:text-turquoise-light" href={`/${category.slug}`}>
                {category.name}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-4 font-extrabold">Informations</h3>
          <div className="space-y-2 text-sm text-white/75">
            {legalPages.map((item) => (
              <Link key={item.href} className="block hover:text-turquoise-light" href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-4 font-extrabold">Horaires</h3>
          <div className="space-y-2 text-sm text-white/75">
            <p>{store.hours.weekdays}</p>
            <p>{store.hours.saturday}</p>
            <p>{store.hours.sunday}</p>
          </div>
        </div>
        <div>
          <h3 className="mb-4 font-extrabold">Contact</h3>
          <div className="space-y-2 text-sm text-white/75">
            <p>{store.address}</p>
            <p>{store.phone}</p>
            <p>{store.email}</p>
            <p>WhatsApp : {store.whatsapp}</p>
          </div>
          <div className="mt-4 rounded-md border border-white/15 p-3 text-xs text-white/70">
            Paiement sécurisé par carte bancaire<br />Paiement à la livraison disponible<br />Livraison à Marrakech et partout au Maroc
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-sm text-white/60">© 2024 Comptoir AlQods. Tous droits réservés.</div>
    </footer>
  );
}

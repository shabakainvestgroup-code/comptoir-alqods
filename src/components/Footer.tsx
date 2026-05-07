import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { categories } from "@/data/categories";

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
          <div className="space-y-2 text-sm text-white/75">{categories.map((category) => <Link key={category.slug} className="block hover:text-turquoise-light" href={`/${category.slug}`}>{category.name}</Link>)}</div>
        </div>
        <div>
          <h3 className="mb-4 font-extrabold">Informations</h3>
          <div className="space-y-2 text-sm text-white/75">
            {["À propos de nous", "Nos services", "Livraison & retours", "Conditions générales", "Mentions légales", "Contact"].map((item) => <p key={item}>{item}</p>)}
          </div>
        </div>
        <div>
          <h3 className="mb-4 font-extrabold">Horaires</h3>
          <div className="space-y-2 text-sm text-white/75">
            <p>Lundi - Vendredi : 08h30 - 18h30</p>
            <p>Samedi : 08h30 - 17h00</p>
            <p>Dimanche : Fermé</p>
          </div>
        </div>
        <div>
          <h3 className="mb-4 font-extrabold">Contact</h3>
          <div className="space-y-2 text-sm text-white/75">
            <p>Marrakech, Maroc</p>
            <p>05 22 12 34 56</p>
            <p>contact@comptoiralqods.ma</p>
            <p>WhatsApp : 06 61 23 45 67</p>
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

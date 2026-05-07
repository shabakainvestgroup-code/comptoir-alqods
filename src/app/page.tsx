import Link from "next/link";
import { Star } from "lucide-react";
import { categories } from "@/data/categories";
import { featuredProducts } from "@/data/products";
import { CategoryCard } from "@/components/CategoryCard";
import { ProductGrid } from "@/components/ProductGrid";
import { HeroBanner } from "@/components/HeroBanner";
import { PromoBanner } from "@/components/PromoBanner";
import { BenefitStrip } from "@/components/BenefitStrip";

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <section id="rayons" className="bg-soft-bg py-12">
        <div className="container-page">
          <h2 className="text-3xl font-extrabold text-navy">Nos rayons</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{categories.map((category) => <CategoryCard key={category.slug} category={category} />)}</div>
        </div>
      </section>
      <section className="bg-white py-12">
        <div className="container-page">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-3xl font-extrabold text-navy">Produits phares</h2>
            <Link href="/electricite" className="font-bold text-turquoise">Voir tous les produits →</Link>
          </div>
          <div className="mt-6"><ProductGrid products={featuredProducts} /></div>
        </div>
      </section>
      <section className="bg-soft-bg py-12">
        <div className="container-page">
          <h2 className="text-3xl font-extrabold text-navy">Pourquoi choisir Comptoir AlQods ?</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-4">
            {[
              ["Produits de qualité", "Sélection rigoureuse de marques fiables pour des résultats durables."],
              ["Conseils d’experts", "Une équipe à votre écoute pour vous accompagner dans tous vos projets."],
              ["Prix justes & compétitifs", "Des produits adaptés aux particuliers, artisans et professionnels."],
              ["Livraison rapide", "Livraison à Marrakech et partout au Maroc selon disponibilité."]
            ].map(([title, text]) => <div key={title} className="rounded-md border border-line bg-white p-5 shadow-sm"><h3 className="font-extrabold text-navy">{title}</h3><p className="mt-2 text-sm text-muted">{text}</p></div>)}
          </div>
        </div>
      </section>
      <PromoBanner title="Rénover à prix léger !" text="Jusqu’à -20% sur une sélection de peintures et d’outillage" button="En profiter" />
      <section className="bg-white py-12">
        <div className="container-page max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold text-navy">Ils nous font confiance</h2>
          <div className="mt-5 flex justify-center gap-1 text-turquoise">{Array.from({ length: 5 }).map((_, index) => <Star key={index} fill="currentColor" />)}</div>
          <p className="mt-4 text-lg text-muted">Très bon accueil, produits de qualité et conseils professionnels. Mon fournisseur de confiance pour mes chantiers.</p>
          <p className="mt-3 font-extrabold text-navy">Youssef B. — Marrakech</p>
        </div>
      </section>
      <BenefitStrip />
    </>
  );
}

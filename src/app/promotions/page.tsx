import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BenefitStrip } from "@/components/BenefitStrip";
import { ProductCard } from "@/components/ProductCard";
import { getPromotions } from "@/lib/promotions";
import { getPromotionalProducts } from "@/lib/productRepository";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Promotions | Comptoir AlQods Marrakech",
  description: "Découvrez les offres et promotions Comptoir AlQods sur les produits de bricolage, bâtiment, outillage, plomberie, sanitaires et peintures à Marrakech."
};

export default async function PromotionsPage() {
  const promotions = await getPromotions({ activeOnly: true });
  const stockPromotions = await getPromotionalProducts();
  const campaignProducts = promotions.flatMap((promotion) => promotion.products || []);
  const promotedProducts = [...campaignProducts, ...stockPromotions].filter((product, index, all) => all.findIndex((item) => item.id === product.id) === index);

  return (
    <>
      <Breadcrumb items={[{ label: "Promotions" }]} />
      <section className="bg-soft-bg py-10">
        <div className="container-page">
          <div className="mb-8 max-w-3xl">
            <p className="text-sm font-extrabold uppercase text-turquoise">Offres Comptoir AlQods</p>
            <h1 className="mt-2 text-4xl font-black text-navy">Promotions en cours</h1>
            <p className="mt-3 text-lg text-muted">Retrouvez les offres disponibles pour vos travaux, chantiers et projets de rénovation.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {promotions.map((promotion) => (
              <article key={promotion.id} className="overflow-hidden rounded-md border border-line bg-white shadow-sm">
                {promotion.image && <div className="h-52 bg-cover bg-center" style={{ backgroundImage: `url(${promotion.image})` }} />}
                <div className="p-5">
                  {promotion.subtitle && <p className="text-sm font-extrabold uppercase text-turquoise">{promotion.subtitle}</p>}
                  <h2 className="mt-2 text-2xl font-black text-navy">{promotion.title}</h2>
                  {promotion.description && <p className="mt-3 text-muted">{promotion.description}</p>}
                  {(promotion.products || []).length > 0 && (
                    <p className="mt-3 text-sm font-extrabold text-alert">
                      {promotion.discount_percent ? `-${promotion.discount_percent}%` : "Prix promo"} sur {promotion.products?.length} produit(s)
                    </p>
                  )}
                  <Link href={promotion.cta_href || "/contact"} className="mt-5 inline-flex rounded-md bg-turquoise px-5 py-3 font-extrabold text-white">
                    {promotion.cta_label || "Voir l'offre"}
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {promotions.length === 0 && promotedProducts.length === 0 && (
            <div className="rounded-md border border-line bg-white p-8 text-muted shadow-sm">
              Aucune promotion active pour le moment. Revenez bientôt pour découvrir nos prochaines offres.
            </div>
          )}

          {promotedProducts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-3xl font-black text-navy">Produits en promotion</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {promotedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      <BenefitStrip />
    </>
  );
}

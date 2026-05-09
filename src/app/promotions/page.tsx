import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BenefitStrip } from "@/components/BenefitStrip";
import { ProductCard } from "@/components/ProductCard";
import { formatPrice } from "@/lib/formatPrice";
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
  const featuredProduct = promotedProducts[0];
  const featuredPromotion = promotions[0];

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

          {featuredProduct ? (
            <section className="mb-10 overflow-hidden rounded-md border border-line bg-white shadow-sm lg:grid lg:grid-cols-[1.1fr_0.9fr]">
              <div className="min-h-[260px] bg-soft-bg bg-contain bg-center bg-no-repeat lg:min-h-[360px]" style={{ backgroundImage: `url(${featuredProduct.image})` }} />
              <div className="flex flex-col justify-center p-6 lg:p-8">
                <p className="text-sm font-extrabold uppercase text-turquoise">Promotion du moment</p>
                <h2 className="mt-3 text-3xl font-black text-navy lg:text-4xl">{featuredProduct.name}</h2>
                <p className="mt-3 text-muted">Offre spéciale sur un produit disponible dans le stock Comptoir AlQods. Quantités disponibles selon arrivage.</p>
                <div className="mt-5 flex flex-wrap items-end gap-3">
                  <span className="text-3xl font-black text-alert">{featuredProduct.priceLabel}</span>
                  {featuredProduct.oldPrice && <span className="pb-1 text-lg font-bold text-muted line-through">{formatPrice(featuredProduct.oldPrice)}</span>}
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href={`/produit/${featuredProduct.slug}`} className="rounded-md bg-turquoise px-5 py-3 font-extrabold text-white">
                    Voir le produit
                  </Link>
                  <Link href="/contact" className="rounded-md border border-line px-5 py-3 font-extrabold text-navy">
                    Demander un devis
                  </Link>
                </div>
              </div>
            </section>
          ) : featuredPromotion ? (
            <section className="mb-10 overflow-hidden rounded-md border border-line bg-white shadow-sm lg:grid lg:grid-cols-[1.1fr_0.9fr]">
              {featuredPromotion.image && <div className="min-h-[260px] bg-cover bg-center lg:min-h-[360px]" style={{ backgroundImage: `url(${featuredPromotion.image})` }} />}
              <div className="flex flex-col justify-center p-6 lg:p-8">
                <p className="text-sm font-extrabold uppercase text-turquoise">{featuredPromotion.subtitle || "Promotion du moment"}</p>
                <h2 className="mt-3 text-3xl font-black text-navy lg:text-4xl">{featuredPromotion.title}</h2>
                {featuredPromotion.description && <p className="mt-3 text-muted">{featuredPromotion.description}</p>}
                <Link href={featuredPromotion.cta_href || "/contact"} className="mt-5 inline-flex w-fit rounded-md bg-turquoise px-5 py-3 font-extrabold text-white">
                  {featuredPromotion.cta_label || "Voir l'offre"}
                </Link>
              </div>
            </section>
          ) : null}

          {promotions.length > 0 && (
            <div className="mb-10">
              <h2 className="mb-5 text-3xl font-black text-navy">Offres mises en avant</h2>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {promotions.map((promotion) => (
                  <article key={promotion.id} className="overflow-hidden rounded-md border border-line bg-white shadow-sm">
                    {promotion.image && <div className="h-52 bg-cover bg-center" style={{ backgroundImage: `url(${promotion.image})` }} />}
                    <div className="p-5">
                      {promotion.subtitle && <p className="text-sm font-extrabold uppercase text-turquoise">{promotion.subtitle}</p>}
                      <h3 className="mt-2 text-2xl font-black text-navy">{promotion.title}</h3>
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
            </div>
          )}

          {promotions.length === 0 && promotedProducts.length === 0 && (
            <div className="rounded-md border border-line bg-white p-8 text-muted shadow-sm">
              Aucune promotion active pour le moment. Revenez bientôt pour découvrir nos prochaines offres.
            </div>
          )}

          {promotedProducts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-3xl font-black text-navy">Toutes les promotions en cours</h2>
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

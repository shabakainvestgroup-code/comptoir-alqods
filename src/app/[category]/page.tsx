import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories, categorySlugs } from "@/data/categories";
import { getProductsByCategory } from "@/lib/productRepository";
import { Breadcrumb } from "@/components/Breadcrumb";
import { FilterSidebar } from "@/components/FilterSidebar";
import { ProductGrid } from "@/components/ProductGrid";
import { AdviceBlock } from "@/components/AdviceBlock";
import { PromoBanner } from "@/components/PromoBanner";
import { BenefitStrip } from "@/components/BenefitStrip";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return categorySlugs.map((category) => ({ category }));
}

export function generateMetadata({ params }: { params: { category: string } }): Metadata {
  const category = categories.find((item) => item.slug === params.category);
  if (!category) return {};
  return {
    title: `${category.name} | Comptoir AlQods Marrakech`,
    description: `${category.name} chez Comptoir AlQods à Marrakech. Commandez en ligne avec paiement par carte bancaire ou paiement à la livraison.`
  };
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const category = categories.find((item) => item.slug === params.category);
  if (!category) notFound();
  const categoryProducts = await getProductsByCategory(category.name);

  return (
    <>
      <Breadcrumb items={[{ label: category.name }]} />
      <section className="image-cover bg-navy" style={{ backgroundImage: `linear-gradient(90deg, rgba(2,27,63,.86), rgba(2,27,63,.42)), url(${category.heroImage})` }}>
        <div className="container-page py-16 text-white">
          <h1 className="text-5xl font-black">{category.name}</h1>
          <p className="mt-4 max-w-3xl text-lg text-white/85">{category.description}</p>
        </div>
      </section>
      <section className="bg-soft-bg py-10">
        <div className="container-page grid gap-6 lg:grid-cols-[280px_1fr]">
          <FilterSidebar category={category} />
          <div>
            <div className="mb-5 rounded-md border border-line bg-white p-5 shadow-sm">
              <p className="text-sm font-extrabold uppercase text-muted">Sous-catégories</p>
              <div className="mt-3 flex flex-wrap gap-2">{category.subcategories.map((item) => <span key={item} className="rounded-full border border-line bg-soft-bg px-3 py-2 text-sm font-semibold text-navy">{item}</span>)}</div>
            </div>
            <ProductGrid products={categoryProducts} />
          </div>
        </div>
      </section>
      <AdviceBlock title={category.adviceTitle} text={category.adviceText} button={category.adviceButton} />
      <PromoBanner title={category.promoTitle} text={category.promoText} button={category.promoButton} image={category.cardImage} />
      <BenefitStrip />
    </>
  );
}

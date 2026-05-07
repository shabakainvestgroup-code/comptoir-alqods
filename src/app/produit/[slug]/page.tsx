import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/data/products";
import { getProductBySlug, getProductsByCategory } from "@/lib/productRepository";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ProductGrid } from "@/components/ProductGrid";
import { ProductActions } from "@/components/ProductActions";
import { BenefitStrip } from "@/components/BenefitStrip";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return {};
  return { title: `${product.name} | Comptoir AlQods`, description: product.description };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();
  const similar = (await getProductsByCategory(product.category)).filter((item) => item.id !== product.id).slice(0, 4);

  return (
    <>
      <Breadcrumb items={[{ label: product.category, href: `/${product.category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}` }, { label: product.name }]} />
      <section className="bg-white py-10">
        <div className="container-page grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div>
            <div className="h-[430px] rounded-md border border-line bg-cover bg-center shadow-sm" style={{ backgroundImage: `url(${product.image})` }} />
            <div className="mt-4 grid grid-cols-4 gap-3">{[product.image, ...(product.gallery || [])].slice(0, 4).map((src) => <div key={src} className="h-20 rounded-md border border-line bg-cover bg-center" style={{ backgroundImage: `url(${src})` }} />)}</div>
          </div>
          <div>
            <p className="text-sm font-extrabold uppercase text-turquoise">{product.category} / {product.subcategory}</p>
            <h1 className="mt-2 text-4xl font-black text-navy">{product.name}</h1>
            <div className="mt-5 flex items-baseline gap-3">
              <span className="text-3xl font-black text-navy">{product.priceLabel}</span>
              {product.oldPrice && <span className="text-lg text-muted line-through">{product.oldPrice.toLocaleString("fr-MA")} DH</span>}
            </div>
            <div className="mt-5 grid gap-2 rounded-md bg-soft-bg p-4 text-sm">
              <p><strong>Disponibilité :</strong> <span className={product.isAvailable ? "text-stock" : "text-alert"}>{product.isAvailable ? "En stock" : "Indisponible"}</span></p>
              <p><strong>Marque :</strong> {product.brand || "Sélection Comptoir AlQods"}</p>
              <p><strong>Référence :</strong> {product.reference}</p>
              <p><strong>Livraison :</strong> Marrakech et partout au Maroc</p>
            </div>
            <p className="mt-5 text-muted">{product.description}</p>
            <ProductActions product={product} />
            <Link href="/contact" className="mt-4 inline-block font-bold text-turquoise">Demander conseil</Link>
            <div className="mt-8">
              <h2 className="text-xl font-extrabold text-navy">Caractéristiques techniques</h2>
              <ul className="mt-3 grid gap-2 text-muted">{(product.features || ["Produit sélectionné pour les travaux du bâtiment", "Disponible selon stock magasin", "Conseil Comptoir AlQods avant achat"]).map((feature) => <li key={feature}>• {feature}</li>)}</ul>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-soft-bg py-10">
        <div className="container-page">
          <h2 className="text-3xl font-extrabold text-navy">Produits similaires</h2>
          <div className="mt-6"><ProductGrid products={similar} /></div>
        </div>
      </section>
      <BenefitStrip />
    </>
  );
}

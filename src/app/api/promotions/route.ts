import { NextResponse } from "next/server";
import { getPromotions } from "@/lib/promotions";
import { getPromotionalProducts } from "@/lib/productRepository";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const placement = url.searchParams.get("placement") || "";
  const promotions = await getPromotions({ activeOnly: true, placement });
  const stockPromotions = await getPromotionalProducts();
  const productPromotions = stockPromotions.map((product, index) => ({
        id: `stock-promo-${product.id}`,
        title: product.name,
        subtitle: "Promotion du moment",
        description: product.oldPrice
          ? `Prix promo : ${product.priceLabel} au lieu de ${product.oldPrice.toLocaleString("fr-MA")} DH.`
          : `Prix promo : ${product.priceLabel}.`,
        image: product.image,
        cta_label: "Voir le produit",
        cta_href: `/produit/${product.slug}`,
        placement: "popup",
        is_active: true,
        priority: 90 - index,
        products: [product]
      }));
  const responsePromotions = placement === "popup" ? [...promotions, ...productPromotions] : promotions;

  return NextResponse.json({
    ok: true,
    promotions: responsePromotions
  });
}

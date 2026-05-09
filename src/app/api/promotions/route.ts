import { NextResponse } from "next/server";
import { getPromotions } from "@/lib/promotions";
import { getPromotionalProducts } from "@/lib/productRepository";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const placement = url.searchParams.get("placement") || "";
  const promotions = await getPromotions({ activeOnly: true, placement });
  const stockPromotions = await getPromotionalProducts();
  const firstProduct = stockPromotions[0];
  const productPromotion = firstProduct
    ? [{
        id: `stock-promo-${firstProduct.id}`,
        title: firstProduct.name,
        subtitle: "Promotion du moment",
        description: firstProduct.oldPrice
          ? `Prix promo : ${firstProduct.priceLabel} au lieu de ${firstProduct.oldPrice.toLocaleString("fr-MA")} DH.`
          : `Prix promo : ${firstProduct.priceLabel}.`,
        image: firstProduct.image,
        cta_label: "Voir les promotions",
        cta_href: "/promotions",
        placement: "popup",
        is_active: true,
        priority: 90,
        products: [firstProduct]
      }]
    : [];
  const responsePromotions = placement === "popup" ? [...promotions, ...productPromotion] : promotions;

  return NextResponse.json({
    ok: true,
    promotions: responsePromotions
  });
}

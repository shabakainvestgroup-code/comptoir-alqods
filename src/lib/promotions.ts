import { formatPrice } from "@/lib/formatPrice";
import { getProducts } from "@/lib/productRepository";
import { deleteRows, insertRow, isSupabaseConfigured, listRows, updateRow, upsertRows } from "@/lib/supabaseRest";
import type { Promotion } from "@/types/promotion";
import type { Product } from "@/types/product";

type PromotionProductRow = {
  id: string;
  promotion_id: string;
  product_id: string;
};

const demoPromotions: Promotion[] = [
  {
    id: "promo-demo-renovation",
    title: "Rénover à prix léger",
    subtitle: "Offre spéciale Comptoir AlQods",
    description: "Profitez d'une sélection de produits pour vos travaux, avec des prix étudiés pour vos chantiers à Marrakech.",
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1200&q=80",
    cta_label: "Voir les offres",
    cta_href: "/promotions",
    placement: "popup",
    is_active: true,
    priority: 10,
    discount_percent: 15,
    product_ids: [],
    products: []
  }
];

function isPromotionVisible(promotion: Promotion, now = Date.now()) {
  if (!promotion.is_active) return false;
  if (promotion.starts_at && new Date(promotion.starts_at).getTime() > now) return false;
  if (promotion.ends_at && new Date(promotion.ends_at).getTime() < now) return false;
  return true;
}

function sortPromotions(promotions: Promotion[]) {
  return [...promotions].sort((a, b) => Number(b.priority || 0) - Number(a.priority || 0));
}

function applyPromotionPrice(product: Product, promotion: Promotion): Product {
  const discountPercent = Number(promotion.discount_percent || 0);
  const fixedPromoPrice = Number(promotion.promo_price || 0);
  const promoPrice = fixedPromoPrice > 0 ? fixedPromoPrice : discountPercent > 0 ? Math.max(0, product.price * (1 - discountPercent / 100)) : product.price;

  if (promoPrice >= product.price) {
    return { ...product, badge: "Promo" };
  }

  return {
    ...product,
    price: Number(promoPrice.toFixed(2)),
    priceLabel: formatPrice(Number(promoPrice.toFixed(2))),
    oldPrice: product.price,
    badge: "Promo"
  };
}

async function enrichPromotions(promotions: Promotion[]) {
  if (promotions.length === 0) return promotions;

  if (!isSupabaseConfigured()) return promotions;

  const [links, products] = await Promise.all([
    listRows<PromotionProductRow>("promotion_products", { select: "*", limit: 10000 }),
    getProducts()
  ]);

  return promotions.map((promotion) => {
    const productIds = links.filter((link) => link.promotion_id === promotion.id).map((link) => link.product_id);
    const linkedProducts = products
      .filter((product) => productIds.includes(product.id))
      .map((product) => applyPromotionPrice(product, promotion));

    return {
      ...promotion,
      product_ids: productIds,
      products: linkedProducts
    };
  });
}

async function replacePromotionProducts(promotionId: string, productIds: string[] = []) {
  if (!isSupabaseConfigured()) return;

  await deleteRows("promotion_products", { promotion_id: promotionId }).catch(() => []);
  const uniqueProductIds = Array.from(new Set(productIds.filter(Boolean)));
  if (uniqueProductIds.length === 0) return;

  await upsertRows<PromotionProductRow>(
    "promotion_products",
    uniqueProductIds.map((productId) => ({ promotion_id: promotionId, product_id: productId })),
    "promotion_id,product_id"
  );
}

export async function getPromotions({ activeOnly = false, placement = "" }: { activeOnly?: boolean; placement?: string } = {}) {
  const promotions = isSupabaseConfigured()
    ? await listRows<Promotion>("promotions", { select: "*", order: "priority.desc,created_at.desc", limit: 10000 })
    : demoPromotions;

  const filtered = sortPromotions(promotions).filter((promotion) => {
    const matchesPlacement = !placement || promotion.placement === placement || promotion.placement === "page";
    const matchesActive = !activeOnly || isPromotionVisible(promotion);
    return matchesPlacement && matchesActive;
  });

  return enrichPromotions(filtered);
}

export async function savePromotion(input: Partial<Promotion>) {
  const now = new Date().toISOString();
  const promotion = {
    title: input.title || "Nouvelle promotion",
    subtitle: input.subtitle || "",
    description: input.description || "",
    image: input.image || "",
    cta_label: input.cta_label || "Voir l'offre",
    cta_href: input.cta_href || "/promotions",
    placement: input.placement || "popup",
    category_slug: input.category_slug || "",
    starts_at: input.starts_at || null,
    ends_at: input.ends_at || null,
    is_active: input.is_active ?? true,
    priority: Number(input.priority || 0),
    discount_percent: Number(input.discount_percent || 0),
    promo_price: input.promo_price ? Number(input.promo_price) : null,
    created_at: now,
    updated_at: now
  };

  if (!isSupabaseConfigured()) {
    return { id: `promo-demo-${Date.now()}`, ...promotion };
  }

  const savedPromotion = await insertRow<Promotion>("promotions", promotion);
  await replacePromotionProducts(savedPromotion.id, input.product_ids);
  return (await enrichPromotions([savedPromotion]))[0];
}

export async function updatePromotion(id: string, input: Partial<Promotion>) {
  const payload = {
    ...input,
    category_slug: input.category_slug || "",
    starts_at: input.starts_at || null,
    ends_at: input.ends_at || null,
    priority: input.priority !== undefined ? Number(input.priority) : undefined,
    discount_percent: input.discount_percent !== undefined ? Number(input.discount_percent) : undefined,
    promo_price: input.promo_price ? Number(input.promo_price) : null,
    product_ids: undefined,
    products: undefined,
    updated_at: new Date().toISOString()
  };

  if (!isSupabaseConfigured()) {
    return { id, ...payload };
  }

  const savedPromotion = await updateRow<Promotion>("promotions", id, payload);
  if (input.product_ids) await replacePromotionProducts(id, input.product_ids);
  return (await enrichPromotions([savedPromotion]))[0];
}

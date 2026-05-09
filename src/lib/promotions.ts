import { isSupabaseConfigured, insertRow, listRows, updateRow } from "@/lib/supabaseRest";
import type { Promotion } from "@/types/promotion";

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
    priority: 10
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

export async function getPromotions({ activeOnly = false, placement = "" }: { activeOnly?: boolean; placement?: string } = {}) {
  const promotions = isSupabaseConfigured()
    ? await listRows<Promotion>("promotions", { select: "*", order: "priority.desc,created_at.desc", limit: 10000 })
    : demoPromotions;

  return sortPromotions(promotions).filter((promotion) => {
    const matchesPlacement = !placement || promotion.placement === placement || promotion.placement === "page";
    const matchesActive = !activeOnly || isPromotionVisible(promotion);
    return matchesPlacement && matchesActive;
  });
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
    created_at: now,
    updated_at: now
  };

  if (!isSupabaseConfigured()) {
    return { id: `promo-demo-${Date.now()}`, ...promotion };
  }

  return insertRow<Promotion>("promotions", promotion);
}

export async function updatePromotion(id: string, input: Partial<Promotion>) {
  const payload = {
    ...input,
    category_slug: input.category_slug || "",
    starts_at: input.starts_at || null,
    ends_at: input.ends_at || null,
    priority: input.priority !== undefined ? Number(input.priority) : undefined,
    updated_at: new Date().toISOString()
  };

  if (!isSupabaseConfigured()) {
    return { id, ...payload };
  }

  return updateRow<Promotion>("promotions", id, payload);
}

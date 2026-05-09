import type { Product } from "@/types/product";

export type PromotionPlacement = "popup" | "banner" | "page" | "category";

export type Promotion = {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  cta_label?: string;
  cta_href?: string;
  placement: PromotionPlacement;
  category_slug?: string;
  starts_at?: string;
  ends_at?: string;
  is_active: boolean;
  priority: number;
  discount_percent?: number;
  promo_price?: number;
  product_ids?: string[];
  products?: Product[];
  created_at?: string;
  updated_at?: string;
};

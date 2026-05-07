export type ProductBadge = "Nouveau" | "Promo" | "En stock";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  subcategory: string;
  brand?: string;
  reference?: string;
  description: string;
  features?: string[];
  price: number;
  priceLabel: string;
  oldPrice?: number;
  image: string;
  gallery?: string[];
  badge?: ProductBadge;
  stock: number;
  isAvailable: boolean;
  deliveryAvailable: boolean;
};

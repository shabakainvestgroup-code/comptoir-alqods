export type Category = {
  slug: string;
  name: string;
  description: string;
  heroImage: string;
  cardImage: string;
  icon: string;
  subcategories: string[];
  brands?: string[];
  adviceTitle: string;
  adviceText: string;
  adviceButton: string;
  promoTitle: string;
  promoText: string;
  promoButton: string;
};

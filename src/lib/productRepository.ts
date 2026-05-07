import { products as localProducts } from "@/data/products";
import { formatPrice } from "@/lib/formatPrice";
import { isSupabaseConfigured, listRows, updateRow, upsertRows } from "@/lib/supabaseRest";
import type { Product, ProductBadge } from "@/types/product";

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  category: string;
  subcategory: string;
  brand?: string | null;
  reference?: string | null;
  description: string;
  features?: string[] | null;
  price: number;
  price_label: string;
  old_price?: number | null;
  image: string;
  gallery?: string[] | null;
  badge?: ProductBadge | null;
  stock: number;
  is_available: boolean;
  delivery_available: boolean;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function productToRow(product: Product): ProductRow {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category,
    subcategory: product.subcategory,
    brand: product.brand || null,
    reference: product.reference || null,
    description: product.description,
    features: product.features || [],
    price: product.price,
    price_label: product.priceLabel || formatPrice(product.price),
    old_price: product.oldPrice || null,
    image: product.image,
    gallery: product.gallery || [],
    badge: product.badge || null,
    stock: product.stock,
    is_available: product.isAvailable,
    delivery_available: product.deliveryAvailable
  };
}

export function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    subcategory: row.subcategory,
    brand: row.brand || undefined,
    reference: row.reference || undefined,
    description: row.description,
    features: row.features || [],
    price: Number(row.price),
    priceLabel: row.price_label || formatPrice(Number(row.price)),
    oldPrice: row.old_price ? Number(row.old_price) : undefined,
    image: row.image,
    gallery: row.gallery || [],
    badge: row.badge || undefined,
    stock: Number(row.stock),
    isAvailable: row.is_available,
    deliveryAvailable: row.delivery_available
  };
}

export function normalizeProductInput(input: Partial<Product>): Product {
  const name = String(input.name || "Nouveau produit");
  const price = Number(input.price || 0);
  const id = input.id || `product-${Date.now()}`;

  return {
    id,
    slug: input.slug || slugify(name),
    name,
    category: input.category || "Électricité",
    subcategory: input.subcategory || "Général",
    brand: input.brand || undefined,
    reference: input.reference || id.toUpperCase(),
    description: input.description || "Produit disponible chez Comptoir AlQods.",
    features: input.features || [],
    price,
    priceLabel: input.priceLabel || formatPrice(price),
    oldPrice: input.oldPrice ? Number(input.oldPrice) : undefined,
    image: input.image || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80",
    gallery: input.gallery || [],
    badge: input.badge || "En stock",
    stock: Number(input.stock ?? 0),
    isAvailable: input.isAvailable ?? true,
    deliveryAvailable: input.deliveryAvailable ?? true
  };
}

export async function getProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) return localProducts;

  try {
    const rows = await listRows<ProductRow>("products", {
      select: "*",
      order: "name.asc",
      limit: 500
    });

    return rows.length > 0 ? rows.map(rowToProduct) : localProducts;
  } catch {
    return localProducts;
  }
}

export async function getFeaturedProducts() {
  return (await getProducts()).filter((product) => product.isAvailable).slice(0, 6);
}

export async function getProductsByCategory(categoryName: string) {
  return (await getProducts()).filter((product) => product.category === categoryName && product.isAvailable);
}

export async function getProductBySlug(slug: string) {
  return (await getProducts()).find((product) => product.slug === slug && product.isAvailable);
}

export async function importLocalProductsToSupabase() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured");
  }

  const rows = localProducts.map(productToRow);
  return upsertRows<ProductRow>("products", rows).then((result) => result.map(rowToProduct));
}

export async function saveProduct(input: Partial<Product>) {
  if (!isSupabaseConfigured()) {
    return normalizeProductInput(input);
  }

  const product = normalizeProductInput(input);
  const rows = await upsertRows<ProductRow>("products", [productToRow(product)]);
  return rowToProduct(rows[0]);
}

export async function updateProduct(id: string, input: Partial<Product>) {
  if (!isSupabaseConfigured()) {
    return normalizeProductInput({ id, ...input });
  }

  const currentProducts = await getProducts();
  const current = currentProducts.find((product) => product.id === id);
  const merged = normalizeProductInput({ ...(current || {}), ...input, id });
  const row = await updateRow<ProductRow>("products", id, productToRow(merged));
  return rowToProduct(row);
}

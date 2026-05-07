"use client";

import { products } from "@/data/products";
import type { Product } from "@/types/product";

export type CartLine = {
  productId: string;
  quantity: number;
  product?: Product;
};

const CART_KEY = "comptoir-alqods-cart";

export function readCart(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}

export function writeCart(lines: CartLine[]) {
  window.localStorage.setItem(CART_KEY, JSON.stringify(lines));
  window.dispatchEvent(new Event("cart:updated"));
}

export function addToCart(product: Product | string, quantity = 1) {
  const productId = typeof product === "string" ? product : product.id;
  const snapshot = typeof product === "string" ? undefined : product;
  const lines = readCart();
  const existing = lines.find((line) => line.productId === productId);
  if (existing) {
    existing.quantity += quantity;
    if (snapshot) existing.product = snapshot;
  } else {
    lines.push({ productId, quantity, product: snapshot });
  }
  writeCart(lines);
}

export function setCartQuantity(productId: string, quantity: number) {
  writeCart(readCart().map((line) => line.productId === productId ? { ...line, quantity } : line).filter((line) => line.quantity > 0));
}

export function removeFromCart(productId: string) {
  writeCart(readCart().filter((line) => line.productId !== productId));
}

export function clearCart() {
  writeCart([]);
}

export function hydrateCart(lines: CartLine[]) {
  return lines
    .map((line) => {
      const product = line.product || products.find((item) => item.id === line.productId);
      return product ? { ...line, product, lineTotal: line.quantity * product.price } : null;
    })
    .filter(Boolean) as { productId: string; quantity: number; product: Product; lineTotal: number }[];
}

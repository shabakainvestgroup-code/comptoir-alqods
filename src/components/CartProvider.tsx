"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CartLine, addToCart, clearCart, hydrateCart, readCart, removeFromCart, setCartQuantity } from "@/lib/cart";
import type { Product } from "@/types/product";

type CartContextValue = {
  lines: ReturnType<typeof hydrateCart>;
  count: number;
  subtotal: number;
  add: (product: Product | string, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [rawLines, setRawLines] = useState<CartLine[]>([]);

  useEffect(() => {
    const sync = () => setRawLines(readCart());
    sync();
    window.addEventListener("cart:updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("cart:updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const value = useMemo(() => {
    const lines = hydrateCart(rawLines);
    return {
      lines,
      count: lines.reduce((sum, line) => sum + line.quantity, 0),
      subtotal: lines.reduce((sum, line) => sum + line.lineTotal, 0),
      add: addToCart,
      setQuantity: setCartQuantity,
      remove: removeFromCart,
      clear: clearCart
    };
  }, [rawLines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}

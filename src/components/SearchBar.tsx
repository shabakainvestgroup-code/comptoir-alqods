"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { products } from "@/data/products";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (value.length < 2) return [];
    return products
      .filter((product) => `${product.name} ${product.category} ${product.brand || ""}`.toLowerCase().includes(value))
      .slice(0, 5);
  }, [query]);

  return (
    <div className="relative w-full">
      <div className="flex overflow-hidden rounded-md border border-line bg-white">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="min-w-0 flex-1 px-4 py-3 text-sm outline-none"
          placeholder="Rechercher un produit, une marque..."
        />
        <button className="grid w-14 place-items-center bg-turquoise text-white transition hover:bg-turquoise-light" aria-label="Rechercher">
          <Search size={20} />
        </button>
      </div>
      {results.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-md border border-line bg-white shadow-soft">
          {results.map((product) => (
            <Link key={product.id} href={`/produit/${product.slug}`} onClick={() => setQuery("")} className="flex items-center justify-between gap-4 border-b border-line px-4 py-3 text-sm last:border-0 hover:bg-soft-bg">
              <span className="font-semibold text-navy">{product.name}</span>
              <span className="shrink-0 text-turquoise">{product.priceLabel}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

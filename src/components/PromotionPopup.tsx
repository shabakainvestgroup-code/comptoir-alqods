"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Tag, X } from "lucide-react";
import type { Promotion } from "@/types/promotion";

function pickRandomPromotion(promotions: Promotion[]) {
  if (promotions.length === 0) return null;
  return promotions[Math.floor(Math.random() * promotions.length)];
}

export function PromotionPopup() {
  const pathname = usePathname();
  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [open, setOpen] = useState(false);
  const product = promotion?.products?.[0];

  useEffect(() => {
    let cancelled = false;

    if (pathname !== "/") {
      setOpen(false);
      return;
    }

    setPromotion(null);
    setOpen(false);

    const loadRandomPromotion = () => {
      fetch(`/api/promotions?placement=popup&t=${Date.now()}`, { cache: "no-store" })
        .then((response) => response.json())
        .then((data) => {
          if (cancelled) return;
          const randomPromotion = pickRandomPromotion(data.promotions || []);
          if (randomPromotion) {
            setPromotion(randomPromotion);
            setOpen(true);
          }
          else {
            setPromotion(null);
            setOpen(false);
          }
        })
        .catch(() => undefined);
    };

    loadRandomPromotion();

    const showAgainWhenReturning = () => {
      if (document.visibilityState === "visible") {
        loadRandomPromotion();
      }
    };

    const showAgainAfterBrowserRestore = (event: PageTransitionEvent) => {
      if (event.persisted) {
        loadRandomPromotion();
      }
    };

    window.addEventListener("pageshow", showAgainAfterBrowserRestore);
    document.addEventListener("visibilitychange", showAgainWhenReturning);

    return () => {
      cancelled = true;
      window.removeEventListener("pageshow", showAgainAfterBrowserRestore);
      document.removeEventListener("visibilitychange", showAgainWhenReturning);
    };
  }, [pathname]);

  if (!promotion || !open) return null;

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-navy-deep/70 p-4">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-md bg-white shadow-soft">
        <button onClick={() => setOpen(false)} className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-md bg-white/95 text-navy shadow-sm" aria-label="Fermer">
          <X size={20} />
        </button>
        <div className="grid md:grid-cols-[1fr_0.95fr]">
          {promotion.image && (
            <div className="min-h-[260px] bg-soft-bg bg-contain bg-center bg-no-repeat md:min-h-[420px]" style={{ backgroundImage: `url(${promotion.image})` }} />
          )}
          <div className="flex flex-col justify-center p-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-md bg-alert px-3 py-2 text-sm font-black uppercase text-white">
              <Tag size={16} />
              Promotion
            </div>
            {promotion.subtitle && <p className="mt-5 text-sm font-extrabold uppercase text-turquoise">{promotion.subtitle}</p>}
            <h2 className="mt-2 text-3xl font-black text-navy">{promotion.title}</h2>
            {promotion.description && <p className="mt-3 text-muted">{promotion.description}</p>}
            {product && (
              <div className="mt-5 rounded-md border border-line bg-soft-bg p-4">
                <p className="text-sm font-bold text-muted">Prix promotionnel</p>
                <div className="mt-1 flex flex-wrap items-end gap-3">
                  <span className="text-2xl font-black text-alert">{product.priceLabel}</span>
                  {product.oldPrice && <span className="pb-1 font-bold text-muted line-through">{product.oldPrice.toLocaleString("fr-MA")} DH TTC</span>}
                </div>
              </div>
            )}
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href={promotion.cta_href || "/promotions"} onClick={() => setOpen(false)} className="rounded-md bg-turquoise px-5 py-3 font-extrabold text-white">
                {promotion.cta_label || "Voir l'offre"}
              </Link>
              <Link href="/promotions" onClick={() => setOpen(false)} className="rounded-md border border-line px-5 py-3 font-extrabold text-navy">
                Toutes les promos
              </Link>
              <button onClick={() => setOpen(false)} className="rounded-md border border-line px-5 py-3 font-extrabold text-navy">Plus tard</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

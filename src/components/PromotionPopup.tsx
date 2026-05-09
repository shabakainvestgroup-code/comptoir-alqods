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
    <div className="fixed inset-0 z-[100] grid place-items-center bg-navy-deep/70 p-3 sm:p-4">
      <div className="relative max-h-[88svh] w-full max-w-[22rem] overflow-y-auto rounded-md bg-white shadow-soft sm:max-w-xl md:max-w-3xl">
        <button onClick={() => setOpen(false)} className="sticky right-3 top-3 z-10 float-right -mb-12 mr-3 mt-3 grid h-11 w-11 place-items-center rounded-md bg-white text-navy shadow-md ring-1 ring-line" aria-label="Fermer">
          <X size={22} />
        </button>
        <div className="grid md:grid-cols-[1fr_0.95fr]">
          {promotion.image && (
            <div className="h-40 bg-soft-bg bg-contain bg-center bg-no-repeat sm:h-52 md:h-auto md:min-h-[420px]" style={{ backgroundImage: `url(${promotion.image})` }} />
          )}
          <div className="flex flex-col justify-center p-5 pt-8 sm:p-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-md bg-alert px-3 py-2 text-xs font-black uppercase text-white sm:text-sm">
              <Tag size={15} />
              Promotion
            </div>
            {promotion.subtitle && <p className="mt-4 text-xs font-extrabold uppercase text-turquoise sm:text-sm">{promotion.subtitle}</p>}
            <h2 className="mt-2 text-2xl font-black leading-tight text-navy sm:text-3xl">{promotion.title}</h2>
            {promotion.description && <p className="mt-3 text-sm text-muted sm:text-base">{promotion.description}</p>}
            {product && (
              <div className="mt-4 rounded-md border border-line bg-soft-bg p-3 sm:p-4">
                <p className="text-sm font-bold text-muted">Prix promotionnel</p>
                <div className="mt-1 flex flex-wrap items-end gap-3">
                  <span className="text-xl font-black text-alert sm:text-2xl">{product.priceLabel}</span>
                  {product.oldPrice && <span className="pb-1 text-sm font-bold text-muted line-through sm:text-base">{product.oldPrice.toLocaleString("fr-MA")} DH TTC</span>}
                </div>
              </div>
            )}
            <div className="mt-4 grid gap-2 sm:flex sm:flex-wrap sm:gap-3">
              <Link href={promotion.cta_href || "/promotions"} onClick={() => setOpen(false)} className="rounded-md bg-turquoise px-4 py-3 text-center font-extrabold text-white">
                {promotion.cta_label || "Voir l'offre"}
              </Link>
              <Link href="/promotions" onClick={() => setOpen(false)} className="rounded-md border border-line px-4 py-3 text-center font-extrabold text-navy">
                Toutes les promos
              </Link>
              <button onClick={() => setOpen(false)} className="rounded-md border border-line px-4 py-3 font-extrabold text-navy">Plus tard</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

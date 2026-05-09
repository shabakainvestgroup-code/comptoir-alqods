"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Promotion } from "@/types/promotion";

export function PromotionPopup() {
  const pathname = usePathname();
  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (pathname !== "/") {
      setOpen(false);
      return;
    }

    setPromotion(null);
    setOpen(false);

    fetch("/api/promotions?placement=popup", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        if (cancelled) return;
        const firstPromotion = data.promotions?.[0];
        if (firstPromotion) {
          setPromotion(firstPromotion);
          setOpen(true);
        }
        else {
          setPromotion(null);
          setOpen(false);
        }
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  if (!promotion || !open) return null;

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-navy-deep/65 p-4">
      <div className="relative w-full max-w-xl overflow-hidden rounded-md bg-white shadow-soft">
        <button onClick={() => setOpen(false)} className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-md bg-white/95 text-navy shadow-sm" aria-label="Fermer">
          <X size={20} />
        </button>
        {promotion.image && <div className="h-52 bg-cover bg-center sm:h-64" style={{ backgroundImage: `url(${promotion.image})` }} />}
        <div className="p-6">
          {promotion.subtitle && <p className="text-sm font-extrabold uppercase text-turquoise">{promotion.subtitle}</p>}
          <h2 className="mt-2 text-3xl font-black text-navy">{promotion.title}</h2>
          {promotion.description && <p className="mt-3 text-muted">{promotion.description}</p>}
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href={promotion.cta_href || "/promotions"} onClick={() => setOpen(false)} className="rounded-md bg-turquoise px-5 py-3 font-extrabold text-white">
              {promotion.cta_label || "Voir l'offre"}
            </Link>
            <button onClick={() => setOpen(false)} className="rounded-md border border-line px-5 py-3 font-extrabold text-navy">Plus tard</button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Promotion } from "@/types/promotion";

const SESSION_KEY = "comptoir_alqods_promotion_popup_seen";

export function PromotionPopup() {
  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;

    fetch("/api/promotions?placement=popup")
      .then((response) => response.json())
      .then((data) => {
        const firstPromotion = data.promotions?.[0];
        if (firstPromotion) {
          setPromotion(firstPromotion);
          setOpen(true);
          sessionStorage.setItem(SESSION_KEY, "1");
        }
      })
      .catch(() => undefined);
  }, []);

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

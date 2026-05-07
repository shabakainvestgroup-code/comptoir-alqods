"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BenefitStrip } from "@/components/BenefitStrip";
import { formatPrice } from "@/lib/formatPrice";
import { useEffect, useState } from "react";

type LastOrder = {
  orderNumber: string;
  order_number?: string;
  customer: { fullName: string; address: string; city: string; district?: string };
  items: { name: string; quantity: number; totalPrice: number }[];
  delivery_fee?: number;
  total: number;
  payment_method?: "card" | "cash_on_delivery";
  deliveryFee: number;
  paymentMethod: "card" | "cash_on_delivery";
};

export default function ConfirmationPage() {
  const [order, setOrder] = useState<LastOrder | null>(null);

  useEffect(() => {
    const raw = window.localStorage.getItem("comptoir-alqods-last-order");
    if (raw) setOrder(JSON.parse(raw));
  }, []);

  return (
    <>
      <Breadcrumb items={[{ label: "Confirmation" }]} />
      <section className="bg-soft-bg py-10">
        <div className="container-page max-w-4xl">
          <div className="rounded-md border border-line bg-white p-8 text-center shadow-sm">
            <CheckCircle2 className="mx-auto text-stock" size={64} />
            <h1 className="mt-4 text-3xl font-black text-navy">Commande confirmée</h1>
            <p className="mx-auto mt-3 max-w-2xl text-muted">Merci pour votre commande. Votre commande a bien été enregistrée. L’équipe Comptoir AlQods vous contactera si nécessaire pour confirmer les détails de livraison.</p>
            <p className="mt-4 text-xl font-extrabold text-turquoise">Numéro de commande : {order?.orderNumber || order?.order_number || "CA-DEMO"}</p>
          </div>
          <div className="mt-6 rounded-md border border-line bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-extrabold text-navy">Récapitulatif</h2>
            {order ? (
              <>
                <div className="mt-4 space-y-3">{order.items.map((item) => <div key={item.name} className="flex justify-between gap-3 border-b border-line pb-2"><span>{item.quantity} × {item.name}</span><strong>{formatPrice(item.totalPrice)}</strong></div>)}</div>
                <div className="mt-4 grid gap-2 text-muted">
                  <p><strong className="text-navy">Total :</strong> {formatPrice(order.total)}</p>
                  <p><strong className="text-navy">Mode de paiement :</strong> {(order.paymentMethod || order.payment_method) === "card" ? "Paiement par carte bancaire" : "Paiement à la livraison"}</p>
                  <p><strong className="text-navy">Adresse :</strong> {order.customer.address}, {order.customer.district} {order.customer.city}</p>
                </div>
              </>
            ) : (
              <p className="mt-3 text-muted">Aucune commande récente trouvée sur cet appareil.</p>
            )}
            <Link href="/" className="mt-6 inline-block rounded-md bg-turquoise px-5 py-3 font-extrabold text-white">Retour à l’accueil</Link>
          </div>
        </div>
      </section>
      <BenefitStrip />
    </>
  );
}

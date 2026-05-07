import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "Mes commandes | Comptoir AlQods",
  description: "Historique simulé des commandes Comptoir AlQods."
};

export default function OrdersPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Mes commandes" }]} />
      <section className="bg-soft-bg py-12">
        <div className="container-page">
          <h1 className="text-3xl font-black text-navy">Mes commandes</h1>
          <div className="mt-6 overflow-hidden rounded-md border border-line bg-white shadow-sm">
            <div className="grid gap-3 border-b border-line p-5 font-extrabold text-navy md:grid-cols-5">
              <span>Commande</span><span>Date</span><span>Total</span><span>Paiement</span><span>Statut</span>
            </div>
            <div className="grid gap-3 p-5 text-muted md:grid-cols-5">
              <span>CA-DEMO</span><span>06/05/2026</span><span>1 245,00 DH TTC</span><span>Paiement à la livraison</span><span className="font-bold text-stock">Confirmée</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

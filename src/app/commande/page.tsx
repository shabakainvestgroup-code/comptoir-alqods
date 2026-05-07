import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CheckoutForm } from "@/components/CheckoutForm";
import { BenefitStrip } from "@/components/BenefitStrip";

export const metadata: Metadata = {
  title: "Commande | Comptoir AlQods",
  description: "Finalisez votre commande Comptoir AlQods avec livraison à Marrakech ou partout au Maroc, paiement par carte ou paiement à la livraison."
};

export default function CheckoutPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Commande" }]} />
      <section className="bg-soft-bg py-10">
        <div className="container-page">
          <h1 className="mb-6 text-3xl font-black text-navy">Finaliser ma commande</h1>
          <CheckoutForm />
        </div>
      </section>
      <BenefitStrip />
    </>
  );
}

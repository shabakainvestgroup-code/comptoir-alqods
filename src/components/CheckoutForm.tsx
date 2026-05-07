"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, HandCoins } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import { calculateDeliveryFee } from "@/lib/delivery";
import { formatPrice } from "@/lib/formatPrice";
import { preparePayment } from "@/lib/payments";
import type { PaymentMethod } from "@/types/order";

export function CheckoutForm() {
  const cart = useCart();
  const router = useRouter();
  const [city, setCity] = useState("Marrakech");
  const [deliveryMethod, setDeliveryMethod] = useState("home");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash_on_delivery");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileEnabled = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
  const deliveryFee = useMemo(() => calculateDeliveryFee(city, deliveryMethod), [city, deliveryMethod]);
  const total = cart.subtotal + deliveryFee;

  async function submitOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (turnstileEnabled && !turnstileToken) {
      setError("Veuillez attendre la validation humaine Cloudflare avant de confirmer la commande.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const form = new FormData(event.currentTarget);
    const payment = preparePayment(paymentMethod);
    const payload = {
      customer: {
        fullName: String(form.get("fullName") || ""),
        phone: String(form.get("phone") || ""),
        email: String(form.get("email") || ""),
        address: String(form.get("address") || ""),
        city,
        district: String(form.get("district") || ""),
        customerType: String(form.get("customerType") || "particulier")
      },
      items: cart.lines.map((line) => ({
        productId: line.productId,
        name: line.product.name,
        quantity: line.quantity,
        unitPrice: line.product.price,
        totalPrice: line.lineTotal
      })),
      paymentMethod,
      turnstileToken
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Order failed");

      const data = await response.json();
      window.localStorage.setItem("comptoir-alqods-last-order", JSON.stringify(data.order));
      cart.clear();
      router.push(payment.redirectUrl || "/commande/confirmation");
    } catch {
      setError("Impossible d’enregistrer la commande. Vérifiez la validation humaine et les informations saisies.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={submitOrder} className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <section className="rounded-md border border-line bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-extrabold text-navy">1. Informations client</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-navy">Nom complet<input required name="fullName" className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise" /></label>
            <label className="grid gap-2 text-sm font-bold text-navy">Téléphone<input required name="phone" className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise" /></label>
            <label className="grid gap-2 text-sm font-bold text-navy">Email<input required type="email" name="email" className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise" /></label>
            <label className="grid gap-2 text-sm font-bold text-navy">Ville<input required value={city} onChange={(event) => setCity(event.target.value)} className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise" /></label>
            <label className="grid gap-2 text-sm font-bold text-navy md:col-span-2">Adresse de livraison<input required name="address" className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise" /></label>
            <label className="grid gap-2 text-sm font-bold text-navy">Quartier<input name="district" className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise" /></label>
            <label className="grid gap-2 text-sm font-bold text-navy">Type de client<select name="customerType" className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise"><option value="particulier">Particulier</option><option value="professionnel">Professionnel</option><option value="artisan">Artisan</option><option value="entreprise">Entreprise</option></select></label>
            <label className="grid gap-2 text-sm font-bold text-navy md:col-span-2">Notes de livraison<textarea rows={3} name="notes" className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise" /></label>
          </div>
        </section>
        <section className="rounded-md border border-line bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-extrabold text-navy">2. Livraison</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {[["home", "Livraison à domicile à Marrakech"], ["outside", "Livraison hors Marrakech"], ["pickup", "Retrait en magasin"]].map(([value, label]) => (
              <label key={value} className={`rounded-md border p-4 font-bold ${deliveryMethod === value ? "border-turquoise bg-turquoise/10 text-navy" : "border-line text-muted"}`}>
                <input type="radio" name="delivery" value={value} checked={deliveryMethod === value} onChange={() => setDeliveryMethod(value)} className="mr-2 accent-turquoise" />{label}
              </label>
            ))}
          </div>
        </section>
        <section className="rounded-md border border-line bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-extrabold text-navy">3. Paiement</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <label className={`rounded-md border p-5 ${paymentMethod === "card" ? "border-turquoise bg-turquoise/10" : "border-line"}`}>
              <input type="radio" name="payment" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} className="mr-2 accent-turquoise" />
              <span className="inline-flex items-center gap-2 font-extrabold text-navy"><CreditCard /> Paiement par carte bancaire</span>
              <p className="mt-2 text-sm text-muted">Préparé pour une intégration CMI, PayZone, PayPal ou autre prestataire adapté au Maroc.</p>
            </label>
            <label className={`rounded-md border p-5 ${paymentMethod === "cash_on_delivery" ? "border-turquoise bg-turquoise/10" : "border-line"}`}>
              <input type="radio" name="payment" checked={paymentMethod === "cash_on_delivery"} onChange={() => setPaymentMethod("cash_on_delivery")} className="mr-2 accent-turquoise" />
              <span className="inline-flex items-center gap-2 font-extrabold text-navy"><HandCoins /> Paiement à la livraison</span>
              <p className="mt-2 text-sm text-muted">Payez votre commande à la réception, en espèces ou selon les modalités proposées par Comptoir AlQods.</p>
            </label>
          </div>
        </section>
      </div>
      <aside className="h-fit rounded-md border border-line bg-white p-6 shadow-sm">
        <h2 className="text-xl font-extrabold text-navy">4. Confirmation</h2>
        <div className="mt-4 space-y-3 text-sm">
          {cart.lines.map((line) => <div key={line.productId} className="flex justify-between gap-3"><span>{line.quantity} × {line.product.name}</span><strong>{formatPrice(line.lineTotal)}</strong></div>)}
        </div>
        <div className="mt-5 space-y-2 border-t border-line pt-4">
          <div className="flex justify-between"><span>Sous-total</span><strong>{formatPrice(cart.subtotal)}</strong></div>
          <div className="flex justify-between"><span>Livraison</span><strong>{formatPrice(deliveryFee)}</strong></div>
          <div className="flex justify-between text-xl font-extrabold text-navy"><span>Total</span><span>{formatPrice(total)}</span></div>
        </div>
        <div className="mt-5">
          <TurnstileWidget action="checkout" onVerify={setTurnstileToken} />
        </div>
        {error && <p className="mt-4 rounded-md bg-alert/10 p-3 text-sm font-bold text-alert">{error}</p>}
        <button disabled={cart.lines.length === 0 || isSubmitting || (turnstileEnabled && !turnstileToken)} className="mt-5 w-full rounded-md bg-turquoise px-5 py-3 font-extrabold text-white disabled:cursor-not-allowed disabled:bg-muted">
          {isSubmitting ? "Enregistrement..." : turnstileEnabled && !turnstileToken ? "Validation humaine en cours..." : "Confirmer ma commande"}
        </button>
      </aside>
    </form>
  );
}

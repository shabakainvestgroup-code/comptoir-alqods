import type { PaymentMethod } from "@/types/order";

export type PaymentResult = {
  status: "redirect_required" | "confirmed";
  provider?: "CMI" | "PayZone" | "PayPal" | "Stripe";
  redirectUrl?: string;
  paymentStatus: "pending" | "pending_on_delivery";
};

export function preparePayment(paymentMethod: PaymentMethod): PaymentResult {
  if (paymentMethod === "card") {
    return {
      status: "redirect_required",
      provider: "CMI",
      redirectUrl: "/commande/confirmation?payment=card-demo",
      paymentStatus: "pending"
    };
  }

  return {
    status: "confirmed",
    paymentStatus: "pending_on_delivery"
  };
}

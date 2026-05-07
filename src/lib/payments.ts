import type { PaymentMethod } from "@/types/order";
import { env } from "@/lib/env";

export type PaymentResult = {
  status: "redirect_required" | "confirmed";
  provider?: "CMI" | "PayZone" | "PayPal" | "Stripe" | "Demo";
  redirectUrl?: string;
  paymentStatus: "pending" | "pending_on_delivery";
};

export function preparePayment(paymentMethod: PaymentMethod): PaymentResult {
  if (paymentMethod === "card") {
    if (env.paymentProvider === "cmi" && env.cmiGatewayUrl) {
      return {
        status: "redirect_required",
        provider: "CMI",
        redirectUrl: env.cmiGatewayUrl,
        paymentStatus: "pending"
      };
    }

    if (env.paymentProvider === "payzone" && env.payzoneGatewayUrl) {
      return {
        status: "redirect_required",
        provider: "PayZone",
        redirectUrl: env.payzoneGatewayUrl,
        paymentStatus: "pending"
      };
    }

    return {
      status: "redirect_required",
      provider: "Demo",
      redirectUrl: "/commande/confirmation?payment=card-demo",
      paymentStatus: "pending"
    };
  }

  return {
    status: "confirmed",
    paymentStatus: "pending_on_delivery"
  };
}

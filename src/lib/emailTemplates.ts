import type { Order } from "@/types/order";
import { formatPrice } from "@/lib/formatPrice";
import { store } from "@/data/store";

export function buildOrderConfirmationEmail(order: Order) {
  const items = order.items
    .map((item) => `${item.quantity} x ${item.name} - ${formatPrice(item.totalPrice)}`)
    .join("\n");

  return {
    subject: `Commande ${order.orderNumber} confirmée - ${store.name}`,
    text: [
      `Bonjour ${order.customer.fullName},`,
      "",
      `Merci pour votre commande ${order.orderNumber}.`,
      "Votre commande a bien été enregistrée. L’équipe Comptoir AlQods vous contactera si nécessaire pour confirmer les détails de livraison.",
      "",
      "Récapitulatif :",
      items,
      "",
      `Livraison : ${formatPrice(order.deliveryFee)}`,
      `Total : ${formatPrice(order.total)}`,
      `Mode de paiement : ${order.paymentMethod === "card" ? "Carte bancaire" : "Paiement à la livraison"}`,
      "",
      `${store.name} - ${store.city}, ${store.country}`,
      `${store.phone} - ${store.email}`
    ].join("\n")
  };
}

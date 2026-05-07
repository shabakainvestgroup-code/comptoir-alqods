import type { Order, PaymentMethod } from "@/types/order";
import { calculateDeliveryFee } from "@/lib/delivery";
import { preparePayment } from "@/lib/payments";

export type CreateOrderInput = {
  customer: Order["customer"];
  items: Order["items"];
  paymentMethod: PaymentMethod;
};

export function createOrder(input: CreateOrderInput): Order {
  const subtotal = input.items.reduce((sum, item) => sum + item.totalPrice, 0);
  const deliveryFee = calculateDeliveryFee(input.customer.city);
  const payment = preparePayment(input.paymentMethod);

  return {
    id: crypto.randomUUID(),
    orderNumber: `CA-${Date.now().toString().slice(-6)}`,
    customer: input.customer,
    items: input.items,
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
    paymentMethod: input.paymentMethod,
    paymentStatus: payment.paymentStatus,
    orderStatus: input.paymentMethod === "cash_on_delivery" ? "confirmed" : "pending",
    createdAt: new Date().toISOString()
  };
}

export const orderStatuses: Order["orderStatus"][] = [
  "pending",
  "confirmed",
  "preparing",
  "shipped",
  "delivered",
  "cancelled"
];

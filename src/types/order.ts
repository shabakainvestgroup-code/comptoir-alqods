export type PaymentMethod = "card" | "cash_on_delivery";

export type Order = {
  id: string;
  orderNumber: string;
  customer: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    district?: string;
    customerType: "particulier" | "professionnel" | "artisan" | "entreprise";
  };
  items: {
    productId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: "pending" | "paid" | "failed" | "pending_on_delivery";
  orderStatus: "pending" | "confirmed" | "preparing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
};

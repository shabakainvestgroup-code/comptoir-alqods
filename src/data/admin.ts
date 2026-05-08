import type { Order } from "@/types/order";
import { products } from "@/data/products";

export const adminStats = {
  products: products.length,
  ordersToday: 3,
  pendingOrders: 2,
  revenueToday: 3545
};

export const demoOrders: Order[] = [
  {
    id: "order-demo-1",
    orderNumber: "CA-102451",
    customer: {
      fullName: "Youssef B.",
      phone: "+212 668 734 724",
      email: "client@example.com",
      address: "Quartier Gueliz",
      city: "Marrakech",
      district: "Gueliz",
      customerType: "professionnel"
    },
    items: [
      {
        productId: "p1",
        name: "Ampoule LED E27 12W - Blanc froid",
        quantity: 10,
        unitPrice: 35,
        totalPrice: 350
      },
      {
        productId: "p4",
        name: "Perceuse à percussion 750W",
        quantity: 1,
        unitPrice: 699,
        totalPrice: 699
      }
    ],
    subtotal: 1049,
    deliveryFee: 30,
    total: 1079,
    paymentMethod: "cash_on_delivery",
    paymentStatus: "pending_on_delivery",
    orderStatus: "confirmed",
    createdAt: "2026-05-07T08:30:00.000Z"
  },
  {
    id: "order-demo-2",
    orderNumber: "CA-102452",
    customer: {
      fullName: "Entreprise Atlas Travaux",
      phone: "06 70 00 00 00",
      email: "achats@example.com",
      address: "Route de Safi",
      city: "Marrakech",
      district: "Sidi Ghanem",
      customerType: "entreprise"
    },
    items: [
      {
        productId: "p33",
        name: "Peinture murale mate blanc intense 15L",
        quantity: 4,
        unitPrice: 420,
        totalPrice: 1680
      }
    ],
    subtotal: 1680,
    deliveryFee: 30,
    total: 1710,
    paymentMethod: "card",
    paymentStatus: "pending",
    orderStatus: "pending",
    createdAt: "2026-05-07T10:10:00.000Z"
  }
];

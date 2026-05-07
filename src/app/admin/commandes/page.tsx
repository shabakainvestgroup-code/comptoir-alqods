import type { Metadata } from "next";
import { AdminLoginGate } from "@/components/AdminLoginGate";
import { AdminOrders } from "@/components/AdminOrders";
import { AdminShell } from "@/components/AdminShell";

export const metadata: Metadata = {
  title: "Commandes | Comptoir AlQods",
  description: "Gestion des commandes Comptoir AlQods."
};

export default function AdminOrdersPage() {
  return (
    <AdminLoginGate>
      <AdminShell>
        <AdminOrders />
      </AdminShell>
    </AdminLoginGate>
  );
}

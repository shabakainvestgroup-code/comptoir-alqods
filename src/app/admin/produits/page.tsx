import type { Metadata } from "next";
import { AdminLoginGate } from "@/components/AdminLoginGate";
import { AdminProducts } from "@/components/AdminProducts";
import { AdminShell } from "@/components/AdminShell";

export const metadata: Metadata = {
  title: "Produits | Comptoir AlQods",
  description: "Gestion du catalogue produits Comptoir AlQods."
};

export default function AdminProductsPage() {
  return (
    <AdminLoginGate>
      <AdminShell>
        <AdminProducts />
      </AdminShell>
    </AdminLoginGate>
  );
}

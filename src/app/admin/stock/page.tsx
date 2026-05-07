import type { Metadata } from "next";
import { AdminLoginGate } from "@/components/AdminLoginGate";
import { AdminShell } from "@/components/AdminShell";
import { AdminStock } from "@/components/AdminStock";

export const metadata: Metadata = {
  title: "Stock | Comptoir AlQods",
  description: "Suivi du stock Comptoir AlQods."
};

export default function AdminStockPage() {
  return (
    <AdminLoginGate>
      <AdminShell>
        <AdminStock />
      </AdminShell>
    </AdminLoginGate>
  );
}

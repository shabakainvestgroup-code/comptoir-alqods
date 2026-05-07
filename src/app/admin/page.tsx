import type { Metadata } from "next";
import { AdminDashboard } from "@/components/AdminDashboard";

export const metadata: Metadata = {
  title: "Back-office | Comptoir AlQods",
  description: "Back-office sécurisé pour la gestion produits et commandes Comptoir AlQods."
};

export default function AdminPage() {
  return <AdminDashboard />;
}

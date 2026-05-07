import type { Metadata } from "next";
import { AdminLoginGate } from "@/components/AdminLoginGate";
import { AdminShell } from "@/components/AdminShell";

export const metadata: Metadata = {
  title: "Paramètres | Comptoir AlQods",
  description: "Paramètres du back-office Comptoir AlQods."
};

export default function AdminSettingsPage() {
  return (
    <AdminLoginGate>
      <AdminShell>
        <section className="rounded-md border border-line bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-extrabold text-navy">Paramètres</h2>
          <p className="mt-2 text-muted">Le seuil de stock faible se règle pour l’instant depuis la page Stock. Les prochains réglages pourront inclure frais de livraison, email admin et options de paiement.</p>
        </section>
      </AdminShell>
    </AdminLoginGate>
  );
}

import { AdminLoginGate } from "@/components/AdminLoginGate";
import { AdminPromotions } from "@/components/AdminPromotions";
import { AdminShell } from "@/components/AdminShell";

export const metadata = {
  title: "Promotions | Admin Comptoir AlQods",
  robots: { index: false, follow: false }
};

export default function AdminPromotionsPage() {
  return (
    <AdminLoginGate>
      <AdminShell>
        <AdminPromotions />
      </AdminShell>
    </AdminLoginGate>
  );
}

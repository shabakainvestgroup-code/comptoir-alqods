import { AdminCustomers } from "@/components/AdminCustomers";
import { AdminLoginGate } from "@/components/AdminLoginGate";
import { AdminShell } from "@/components/AdminShell";

export const metadata = {
  title: "Clients | Admin Comptoir AlQods",
  robots: { index: false, follow: false }
};

export default function AdminCustomersPage() {
  return (
    <AdminLoginGate>
      <AdminShell>
        <AdminCustomers />
      </AdminShell>
    </AdminLoginGate>
  );
}

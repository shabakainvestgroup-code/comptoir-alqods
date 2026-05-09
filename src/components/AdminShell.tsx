"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BadgePercent, Boxes, LayoutDashboard, PackageSearch, Settings, ShoppingBag, Users } from "lucide-react";

const links = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/commandes", label: "Commandes", icon: ShoppingBag },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/promotions", label: "Promotions", icon: BadgePercent },
  { href: "/admin/produits", label: "Produits", icon: PackageSearch },
  { href: "/admin/stock", label: "Stock", icon: Boxes },
  { href: "/admin/parametres", label: "Paramètres", icon: Settings }
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <section className="min-h-screen bg-soft-bg py-8">
      <div className="container-page">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-extrabold uppercase text-turquoise">Administration</p>
            <h1 className="text-4xl font-black text-navy">Back-office Comptoir AlQods</h1>
          </div>
          <Link href="/" className="rounded-md border border-navy px-5 py-3 font-extrabold text-navy">Retour boutique</Link>
        </div>
        <nav className="mb-6 flex gap-2 overflow-x-auto rounded-md border border-line bg-white p-2 shadow-sm">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} className={`inline-flex shrink-0 items-center gap-2 rounded-md px-4 py-3 text-sm font-extrabold ${active ? "bg-navy text-white" : "text-navy hover:bg-soft-bg"}`}>
                <Icon size={18} /> {label}
              </Link>
            );
          })}
        </nav>
        {children}
      </div>
    </section>
  );
}

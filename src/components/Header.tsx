"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, FileText, MapPin, Menu, Phone, ShoppingCart, Truck, User, X } from "lucide-react";
import { useState } from "react";
import { categories } from "@/data/categories";
import { store } from "@/data/store";
import { BrandLogo } from "@/components/BrandLogo";
import { SearchBar } from "@/components/SearchBar";
import { CartDrawer } from "@/components/CartDrawer";
import { useCart } from "@/components/CartProvider";

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const cart = useCart();
  const links = [{ href: "/", label: "Accueil" }, ...categories.map((category) => ({ href: `/${category.slug}`, label: category.name })), { href: "/contact", label: "Contact" }];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="bg-navy-deep text-white">
        <div className="container-page flex items-center justify-between gap-3 py-2 text-xs">
          <div className="flex min-w-0 items-center gap-4">
            <span className="inline-flex min-w-0 items-center gap-2 whitespace-nowrap"><Truck size={14} className="shrink-0" /> <span className="truncate">Livraison partout au Maroc</span></span>
            <span className="hidden items-center gap-2 whitespace-nowrap md:inline-flex"><FileText size={14} /> Conseils d'experts & devis gratuits</span>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <span>Suivez-nous :</span>
            <span className="font-bold">Facebook</span>
            <span className="font-bold">Instagram</span>
            <span className="font-bold">LinkedIn</span>
            <Link className="inline-flex items-center gap-1 whitespace-nowrap" href="/mon-compte"><User size={14} /> Mon compte</Link>
            <button onClick={() => setCartOpen(true)} className="inline-flex items-center gap-1 whitespace-nowrap font-bold">
              <ShoppingCart size={14} /> Panier ({cart.count})
            </button>
          </div>
        </div>
      </div>
      <div className="container-page flex items-center gap-3 py-3 md:gap-5 md:py-4">
        <Link href="/" className="min-w-0 shrink"><BrandLogo compact /></Link>
        <div className="hidden flex-1 md:block"><SearchBar /></div>
        <div className="ml-auto hidden items-center gap-6 lg:flex">
          <div className="flex items-center gap-2"><Phone className="text-turquoise" /><div><p className="text-xs text-muted">Appelez-nous</p><p className="font-extrabold text-navy">{store.phone}</p></div></div>
          <div className="flex items-center gap-2"><MapPin className="text-turquoise" /><div><p className="text-xs text-muted">Où nous trouver ?</p><p className="font-extrabold text-navy">{store.city}, {store.country}</p></div></div>
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-2 md:hidden">
          <Link href="/mon-compte" className="grid h-11 w-11 place-items-center rounded-md border border-line" aria-label="Mon compte"><User size={20} /></Link>
          <button onClick={() => setCartOpen(true)} className="relative grid h-11 w-11 place-items-center rounded-md border border-line" aria-label="Panier">
            <ShoppingCart size={20} />
            {cart.count > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-turquoise px-1 text-xs font-black text-white">{cart.count}</span>}
          </button>
        </div>
        <button className="grid h-11 w-11 shrink-0 place-items-center rounded-md border border-line md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>
      <div className="border-t border-line md:hidden">
        <div className="container-page py-2"><SearchBar /></div>
      </div>
      <nav className={`${menuOpen ? "block" : "hidden"} bg-navy text-white md:block`}>
        <div className="container-page flex flex-col md:flex-row md:items-center">
          {links.map((link) => {
            const active = pathname === link.href;
            const isCategory = categories.some((category) => `/${category.slug}` === link.href);
            return (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className={`flex items-center gap-1 border-b border-white/10 px-3 py-3 text-sm font-bold transition hover:text-turquoise-light md:border-b-0 ${active ? "text-turquoise-light" : ""}`}>
                {link.label} {isCategory && <ChevronDown size={14} />}
              </Link>
            );
          })}
        </div>
      </nav>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}

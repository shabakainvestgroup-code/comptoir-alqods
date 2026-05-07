import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "Mon compte | Comptoir AlQods",
  description: "Espace client Comptoir AlQods."
};

export default function AccountPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Mon compte" }]} />
      <section className="bg-soft-bg py-12">
        <div className="container-page max-w-3xl rounded-md border border-line bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-black text-navy">Mon compte</h1>
          <p className="mt-3 text-muted">Cette première version prépare l’espace client : coordonnées, adresses, commandes et préférences de livraison.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/mes-commandes" className="rounded-md bg-turquoise px-5 py-3 font-extrabold text-white">Voir mes commandes</Link>
            <Link href="/contact" className="rounded-md border border-navy px-5 py-3 font-extrabold text-navy">Contacter l’équipe</Link>
          </div>
        </div>
      </section>
    </>
  );
}

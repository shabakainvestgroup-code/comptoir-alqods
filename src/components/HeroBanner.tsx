import Link from "next/link";
import { Award, PackageCheck, Truck } from "lucide-react";

export function HeroBanner() {
  return (
    <section className="image-cover min-h-[560px] bg-navy" style={{ backgroundImage: "linear-gradient(90deg, rgba(2,27,63,.9), rgba(2,27,63,.52), rgba(2,27,63,.12)), url(https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?auto=format&fit=crop&w=1800&q=80)" }}>
      <div className="container-page flex min-h-[560px] items-center">
        <div className="max-w-2xl py-12 text-white">
          <h1 className="text-4xl font-black leading-tight md:text-6xl">Votre comptoir des solutions pour vos <span className="text-turquoise-light">chantiers et vos travaux</span></h1>
          <p className="mt-5 text-lg text-white/85">Un large choix de produits de qualité, des marques reconnues et des conseils d’experts pour réussir tous vos projets.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/electricite" className="rounded-md bg-turquoise px-5 py-3 font-extrabold text-white">Découvrir les rayons</Link>
            <Link href="/contact" className="rounded-md border border-white px-5 py-3 font-extrabold text-white">Demander un devis</Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[{ icon: PackageCheck, title: "Produits de qualité", text: "Des marques fiables" }, { icon: Award, title: "Prix compétitifs", text: "Le meilleur rapport qualité/prix" }, { icon: Truck, title: "Livraison rapide", text: "Partout au Maroc" }].map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-3 rounded-md bg-white/10 p-3 backdrop-blur">
                <Icon className="text-turquoise-light" />
                <div><p className="font-bold">{title}</p><p className="text-sm text-white/75">{text}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

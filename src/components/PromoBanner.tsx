import Link from "next/link";

export function PromoBanner({ title, text, button, image }: { title: string; text: string; button: string; image?: string }) {
  return (
    <section className="bg-navy">
      <div className="container-page grid items-center gap-6 py-8 md:grid-cols-[1.4fr_.8fr]">
        <div>
          <p className="text-sm font-extrabold uppercase text-turquoise-light">Promotion</p>
          <h2 className="mt-1 text-3xl font-extrabold text-white">{title}</h2>
          <p className="mt-2 text-white/80">{text}</p>
          <Link href="/peintures" className="mt-5 inline-block rounded-md bg-turquoise px-5 py-3 font-bold text-white">{button} →</Link>
        </div>
        <div className="h-48 rounded-md bg-cover bg-center shadow-soft" style={{ backgroundImage: `url(${image || "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=900&q=80"})` }} />
      </div>
    </section>
  );
}

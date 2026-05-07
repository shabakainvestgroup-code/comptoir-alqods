import Link from "next/link";
import { Bath, Bolt, Hammer, PaintRoller, Wrench, Zap } from "lucide-react";
import type { Category } from "@/types/category";

const icons = { Zap, Bath, Wrench, Drill: Hammer, Nut: Bolt, PaintRoller };

export function CategoryCard({ category }: { category: Category }) {
  const Icon = icons[category.icon as keyof typeof icons] || Hammer;
  return (
    <Link href={`/${category.slug}`} className="group overflow-hidden rounded-md border border-line bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
      <div className="h-44 bg-cover bg-center" style={{ backgroundImage: `url(${category.cardImage})` }} />
      <div className="p-5">
        <div className="-mt-12 mb-4 grid h-14 w-14 place-items-center rounded-full border-4 border-white bg-turquoise text-white shadow-soft"><Icon size={26} /></div>
        <h3 className="text-xl font-extrabold text-navy">{category.name}</h3>
        <p className="mt-2 text-sm text-muted line-clamp-2">{category.description}</p>
        <p className="mt-4 font-bold text-turquoise">Voir les produits →</p>
      </div>
    </Link>
  );
}

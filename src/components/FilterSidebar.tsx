import type { Category } from "@/types/category";

export function FilterSidebar({ category }: { category: Category }) {
  return (
    <aside className="rounded-md border border-line bg-white p-5 shadow-sm">
      <h2 className="text-lg font-extrabold text-navy">Filtres</h2>
      <div className="mt-5">
        <p className="mb-3 text-sm font-extrabold uppercase text-muted">Sous-catégories</p>
        <div className="space-y-2">
          {category.subcategories.map((item) => <label key={item} className="flex items-center gap-2 text-sm text-navy"><input type="checkbox" className="h-4 w-4 accent-turquoise" /> {item}</label>)}
        </div>
      </div>
      <div className="mt-6">
        <p className="mb-3 text-sm font-extrabold uppercase text-muted">{category.slug === "peintures" ? "Type / usage" : "Marques"}</p>
        <div className="space-y-2">
          {(category.brands || []).map((item) => <label key={item} className="flex items-center gap-2 text-sm text-navy"><input type="checkbox" className="h-4 w-4 accent-turquoise" /> {item}</label>)}
        </div>
      </div>
      <div className="mt-6">
        <p className="mb-3 text-sm font-extrabold uppercase text-muted">Disponibilité</p>
        <label className="flex items-center gap-2 text-sm text-navy"><input type="checkbox" className="h-4 w-4 accent-turquoise" defaultChecked /> En stock</label>
      </div>
    </aside>
  );
}

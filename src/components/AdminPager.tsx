"use client";

export function AdminPager({ page, totalPages, onPageChange }: { page: number; totalPages: number; onPageChange: (page: number) => void }) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1).filter((item) => item === 1 || item === totalPages || Math.abs(item - page) <= 2);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line p-4">
      <button disabled={page <= 1} onClick={() => onPageChange(page - 1)} className="rounded-md border border-line px-4 py-2 font-bold text-navy disabled:opacity-40">Précédent</button>
      <div className="flex flex-wrap gap-2">
        {pages.map((item) => (
          <button key={item} onClick={() => onPageChange(item)} className={`h-10 min-w-10 rounded-md px-3 font-bold ${item === page ? "bg-navy text-white" : "border border-line text-navy"}`}>{item}</button>
        ))}
      </div>
      <button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} className="rounded-md border border-line px-4 py-2 font-bold text-navy disabled:opacity-40">Suivant</button>
    </div>
  );
}

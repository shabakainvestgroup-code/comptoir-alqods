import Link from "next/link";

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <div className="container-page py-4 text-sm text-muted">
      <Link className="font-semibold text-navy" href="/">Accueil</Link>
      {items.map((item) => (
        <span key={item.label}>
          <span className="mx-2">/</span>
          {item.href ? <Link className="font-semibold text-navy" href={item.href}>{item.label}</Link> : <span>{item.label}</span>}
        </span>
      ))}
    </div>
  );
}

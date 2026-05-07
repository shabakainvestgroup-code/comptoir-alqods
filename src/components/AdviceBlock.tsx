import Link from "next/link";

export function AdviceBlock({ title, text, button }: { title: string; text: string; button: string }) {
  return (
    <section className="bg-soft-bg">
      <div className="container-page py-10">
        <div className="rounded-md border border-line bg-white p-6 shadow-sm md:flex md:items-center md:justify-between md:gap-8">
          <div>
            <h2 className="text-2xl font-extrabold text-navy">{title}</h2>
            <p className="mt-2 max-w-3xl text-muted">{text}</p>
          </div>
          <Link href="/contact" className="mt-5 inline-block shrink-0 rounded-md border border-turquoise px-5 py-3 font-bold text-turquoise md:mt-0">{button} →</Link>
        </div>
      </div>
    </section>
  );
}

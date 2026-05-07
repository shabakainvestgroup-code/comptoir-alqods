import { Breadcrumb } from "@/components/Breadcrumb";
import { BenefitStrip } from "@/components/BenefitStrip";

type Section = {
  title: string;
  text: string;
};

export function LegalPage({ title, intro, sections }: { title: string; intro: string; sections: Section[] }) {
  return (
    <>
      <Breadcrumb items={[{ label: title }]} />
      <section className="bg-soft-bg py-12">
        <div className="container-page max-w-4xl">
          <div className="rounded-md border border-line bg-white p-8 shadow-sm">
            <h1 className="text-4xl font-black text-navy">{title}</h1>
            <p className="mt-4 text-lg text-muted">{intro}</p>
            <div className="mt-8 space-y-6">
              {sections.map((section) => (
                <section key={section.title}>
                  <h2 className="text-2xl font-extrabold text-navy">{section.title}</h2>
                  <p className="mt-2 leading-7 text-muted">{section.text}</p>
                </section>
              ))}
            </div>
          </div>
        </div>
      </section>
      <BenefitStrip />
    </>
  );
}

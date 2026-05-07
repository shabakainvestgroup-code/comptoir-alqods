export function ContactForm() {
  return (
    <form className="grid gap-4 rounded-md border border-line bg-white p-6 shadow-sm">
      {["Nom complet", "Téléphone", "Email", "Sujet"].map((label) => (
        <label key={label} className="grid gap-2 text-sm font-bold text-navy">{label}<input className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise" /></label>
      ))}
      <label className="grid gap-2 text-sm font-bold text-navy">Catégorie concernée<select className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise"><option>Électricité</option><option>Sanitaires</option><option>Plomberie</option><option>Outillage</option><option>Quincaillerie</option><option>Peintures</option></select></label>
      <label className="grid gap-2 text-sm font-bold text-navy">Message<textarea rows={5} className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise" /></label>
      <button className="rounded-md bg-turquoise px-5 py-3 font-extrabold text-white">Envoyer ma demande</button>
    </form>
  );
}

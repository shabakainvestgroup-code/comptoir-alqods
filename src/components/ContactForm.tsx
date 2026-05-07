"use client";

import { useState } from "react";
import { TurnstileWidget } from "@/components/TurnstileWidget";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [turnstileToken, setTurnstileToken] = useState("");

  async function submitContact(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const form = new FormData(event.currentTarget);
    const payload = { ...Object.fromEntries(form.entries()), turnstileToken };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      setStatus(response.ok ? "sent" : "error");
      if (response.ok) event.currentTarget.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={submitContact} className="grid gap-4 rounded-md border border-line bg-white p-6 shadow-sm">
      <label className="grid gap-2 text-sm font-bold text-navy">Nom complet<input name="fullName" required className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise" /></label>
      <label className="grid gap-2 text-sm font-bold text-navy">Téléphone<input name="phone" required className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise" /></label>
      <label className="grid gap-2 text-sm font-bold text-navy">Email<input name="email" type="email" required className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise" /></label>
      <label className="grid gap-2 text-sm font-bold text-navy">Sujet<input name="subject" required className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise" /></label>
      <label className="grid gap-2 text-sm font-bold text-navy">Catégorie concernée<select name="category" className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise"><option>Électricité</option><option>Sanitaires</option><option>Plomberie</option><option>Outillage</option><option>Quincaillerie</option><option>Peintures</option></select></label>
      <label className="grid gap-2 text-sm font-bold text-navy">Message<textarea name="message" required rows={5} className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise" /></label>
      <TurnstileWidget action="contact" onVerify={setTurnstileToken} />
      {status === "sent" && <p className="rounded-md bg-stock/10 p-3 text-sm font-bold text-stock">Votre demande a bien été enregistrée. L’équipe Comptoir AlQods vous répondra rapidement.</p>}
      {status === "error" && <p className="rounded-md bg-alert/10 p-3 text-sm font-bold text-alert">Impossible d’envoyer la demande. Vérifiez la validation humaine ou contactez-nous par téléphone.</p>}
      <button disabled={status === "sending"} className="rounded-md bg-turquoise px-5 py-3 font-extrabold text-white disabled:bg-muted">
        {status === "sending" ? "Envoi en cours..." : "Envoyer ma demande"}
      </button>
    </form>
  );
}

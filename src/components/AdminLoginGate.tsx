"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function AdminLoginGate({ children }: { children: React.ReactNode }) {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/products?pageSize=10").then((response) => setAuthenticated(response.status !== 401)).catch(() => setAuthenticated(false));
  }, []);

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });

    if (!response.ok) {
      setMessage("Mot de passe incorrect.");
      return;
    }

    setAuthenticated(true);
    setPassword("");
  }

  if (authenticated === null) {
    return <section className="bg-soft-bg py-12"><div className="container-page text-navy">Chargement...</div></section>;
  }

  if (!authenticated) {
    return (
      <section className="bg-soft-bg py-12">
        <div className="container-page max-w-md">
          <form onSubmit={login} className="rounded-md border border-line bg-white p-8 shadow-sm">
            <p className="text-sm font-extrabold uppercase text-turquoise">Administration</p>
            <h1 className="mt-2 text-3xl font-black text-navy">Connexion back-office</h1>
            <p className="mt-2 text-sm text-muted">Accès réservé à l’équipe Comptoir AlQods.</p>
            <label className="mt-6 grid gap-2 text-sm font-bold text-navy">
              Mot de passe
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise" />
            </label>
            {message && <p className="mt-4 rounded-md bg-alert/10 p-3 text-sm font-bold text-alert">{message}</p>}
            <button className="mt-5 w-full rounded-md bg-turquoise px-5 py-3 font-extrabold text-white">Se connecter</button>
            <Link href="/" className="mt-4 block text-center text-sm font-bold text-navy">Retour boutique</Link>
          </form>
        </div>
      </section>
    );
  }

  return <>{children}</>;
}

"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

let turnstileScriptPromise: Promise<void> | null = null;

function loadTurnstileScript() {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();

  if (!turnstileScriptPromise) {
    turnstileScriptPromise = new Promise((resolve, reject) => {
      let settled = false;

      function finish(success: boolean) {
        if (settled) return;
        settled = true;
        window.clearInterval(timer);
        window.clearTimeout(timeout);
        if (success) resolve();
        else reject(new Error("Turnstile script unavailable"));
      }

      const timer = window.setInterval(() => {
        if (window.turnstile) finish(true);
      }, 100);
      const timeout = window.setTimeout(() => finish(false), 15000);
      const existingScript = document.querySelector<HTMLScriptElement>('script[src*="challenges.cloudflare.com/turnstile"]');

      if (existingScript) {
        existingScript.addEventListener("load", () => finish(true), { once: true });
        existingScript.addEventListener("error", () => finish(false), { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.onload = () => finish(true);
      script.onerror = () => finish(false);
      document.head.appendChild(script);
    });
  }

  return turnstileScriptPromise;
}

export function TurnstileWidget({ onVerify, action }: { onVerify: (token: string) => void; action: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onVerifyRef = useRef(onVerify);
  const [scriptReady, setScriptReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    onVerifyRef.current = onVerify;
  }, [onVerify]);

  useEffect(() => {
    if (!siteKey) return undefined;

    let cancelled = false;
    setFailed(false);

    loadTurnstileScript()
      .then(() => {
        if (cancelled) return;
        setScriptReady(true);
        setFailed(false);
      })
      .catch(() => {
        if (cancelled) return;
        setScriptReady(false);
        setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [siteKey]);

  useEffect(() => {
    if (!siteKey || !scriptReady || !containerRef.current || !window.turnstile || widgetIdRef.current) return undefined;

    try {
      containerRef.current.innerHTML = "";
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        theme: "light",
        size: "normal",
        action,
        language: "fr",
        appearance: "always",
        callback: (token: string) => onVerifyRef.current(token),
        "expired-callback": () => onVerifyRef.current(""),
        "error-callback": () => onVerifyRef.current("")
      });
    } catch {
      setFailed(true);
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
      onVerifyRef.current("");
    };
  }, [action, scriptReady, siteKey]);

  if (!siteKey) {
    return <p className="rounded-md bg-soft-bg p-3 text-xs font-bold text-muted">Vérification humaine désactivée en mode configuration.</p>;
  }

  return (
    <div className="min-h-[88px] rounded-md border border-line bg-white p-3">
      {!scriptReady && !failed && <p className="text-sm font-bold text-muted">Chargement de la vérification humaine...</p>}
      {failed && <p className="text-sm font-bold text-alert">Cloudflare ne s’est pas chargé. Rechargez la page ou désactivez le bloqueur de scripts.</p>}
      <div ref={containerRef} />
    </div>
  );
}

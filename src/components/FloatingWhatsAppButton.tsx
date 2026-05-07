import { MessageCircle } from "lucide-react";

export function FloatingWhatsAppButton() {
  return (
    <a href="https://wa.me/212661234567" className="fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-stock text-white shadow-soft transition hover:scale-105" aria-label="Contacter Comptoir AlQods sur WhatsApp">
      <MessageCircle size={28} />
    </a>
  );
}

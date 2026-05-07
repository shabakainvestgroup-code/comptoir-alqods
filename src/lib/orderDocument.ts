import { store } from "@/data/store";
import { formatPrice } from "@/lib/formatPrice";

type OrderItem = {
  name: string;
  quantity: number;
  unitPrice?: number;
  unit_price?: number;
  totalPrice?: number;
  total_price?: number;
};

type DocumentOrder = {
  id: string;
  orderNumber?: string;
  order_number?: string;
  customer: {
    fullName?: string;
    full_name?: string;
    phone?: string;
    email?: string;
    cni?: string;
    address?: string;
    city?: string;
    district?: string;
    customerType?: string;
    customer_type?: string;
  };
  items: OrderItem[];
  subtotal?: number;
  deliveryFee?: number;
  delivery_fee?: number;
  total: number;
  paymentMethod?: string;
  payment_method?: string;
  paymentStatus?: string;
  payment_status?: string;
  orderStatus?: string;
  order_status?: string;
  createdAt?: string;
  created_at?: string;
};

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function orderNumber(order: DocumentOrder) {
  return order.orderNumber || order.order_number || "Commande";
}

function customerName(order: DocumentOrder) {
  return order.customer.fullName || order.customer.full_name || "Client Comptoir AlQods";
}

function dateLabel(order: DocumentOrder) {
  const value = order.createdAt || order.created_at;
  return value ? new Date(value).toLocaleDateString("fr-FR") : new Date().toLocaleDateString("fr-FR");
}

function paymentLabel(order: DocumentOrder) {
  return (order.paymentMethod || order.payment_method) === "card" ? "Carte bancaire" : "Paiement à la livraison";
}

export function renderOrderDocumentHtml(order: DocumentOrder, type: "invoice" | "quote", origin: string) {
  const isInvoice = type === "invoice";
  const title = isInvoice ? "Facture" : "Devis";
  const reference = `${isInvoice ? "FAC" : "DEV"}-${orderNumber(order).replace(/^CA-/, "")}`;
  const subtotal = Number(order.subtotal || 0);
  const deliveryFee = Number(order.deliveryFee ?? order.delivery_fee ?? 0);
  const total = Number(order.total || 0);

  const itemRows = (order.items || []).map((item) => {
    const unit = Number(item.unitPrice ?? item.unit_price ?? 0);
    const lineTotal = Number(item.totalPrice ?? item.total_price ?? unit * Number(item.quantity || 0));
    return `
      <tr>
        <td>${escapeHtml(item.name)}</td>
        <td class="center">${escapeHtml(item.quantity)}</td>
        <td class="right">${escapeHtml(formatPrice(unit))}</td>
        <td class="right">${escapeHtml(formatPrice(lineTotal))}</td>
      </tr>
    `;
  }).join("");

  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)} ${escapeHtml(reference)} | Comptoir AlQods</title>
  <style>
    :root { --navy: #062A5B; --deep: #021B3F; --turquoise: #00AEB8; --line: #E5EAF0; --muted: #5F6368; }
    * { box-sizing: border-box; }
    body { margin: 0; background: #f5f7fa; color: var(--deep); font-family: Arial, Helvetica, sans-serif; }
    .toolbar { position: sticky; top: 0; display: flex; justify-content: flex-end; gap: 12px; padding: 14px 24px; background: white; border-bottom: 1px solid var(--line); }
    .button { border: 0; border-radius: 6px; padding: 12px 18px; background: var(--turquoise); color: white; font-weight: 800; cursor: pointer; }
    .button.secondary { background: var(--navy); }
    .page { width: 210mm; min-height: 297mm; margin: 24px auto; padding: 20mm; background: white; box-shadow: 0 18px 45px rgba(2, 27, 63, .12); }
    .header { display: grid; grid-template-columns: 1fr auto; gap: 32px; align-items: start; border-bottom: 4px solid var(--turquoise); padding-bottom: 22px; }
    .logo { width: 210px; height: auto; }
    .company { margin-top: 14px; color: var(--muted); line-height: 1.55; font-size: 13px; }
    .doc-title { text-align: right; }
    h1 { margin: 0; color: var(--navy); font-size: 38px; text-transform: uppercase; letter-spacing: 0; }
    .reference { margin-top: 8px; font-weight: 800; color: var(--turquoise); }
    .meta { margin-top: 8px; color: var(--muted); font-size: 13px; }
    .blocks { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 28px; }
    .block { border: 1px solid var(--line); border-radius: 8px; padding: 16px; min-height: 130px; }
    .block h2 { margin: 0 0 12px; color: var(--navy); font-size: 15px; text-transform: uppercase; }
    .block p { margin: 5px 0; color: var(--muted); line-height: 1.45; }
    table { width: 100%; border-collapse: collapse; margin-top: 28px; }
    th { background: var(--navy); color: white; text-align: left; padding: 12px; font-size: 13px; }
    td { border-bottom: 1px solid var(--line); padding: 12px; vertical-align: top; }
    .center { text-align: center; }
    .right { text-align: right; }
    .totals { margin: 24px 0 0 auto; width: 330px; border: 1px solid var(--line); border-radius: 8px; overflow: hidden; }
    .totals-row { display: flex; justify-content: space-between; gap: 12px; padding: 12px 14px; border-bottom: 1px solid var(--line); }
    .totals-row:last-child { border-bottom: 0; }
    .grand { background: var(--navy); color: white; font-size: 18px; font-weight: 900; }
    .note { margin-top: 28px; border-left: 4px solid var(--turquoise); padding: 12px 16px; color: var(--muted); line-height: 1.5; background: #F5F7FA; }
    .footer { margin-top: 36px; padding-top: 18px; border-top: 1px solid var(--line); color: var(--muted); font-size: 12px; text-align: center; line-height: 1.5; }
    @media print {
      body { background: white; }
      .toolbar { display: none; }
      .page { margin: 0; box-shadow: none; width: auto; min-height: auto; }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <button class="button secondary" onclick="window.close()">Fermer</button>
    <button class="button" onclick="window.print()">Imprimer / Enregistrer en PDF</button>
  </div>
  <main class="page">
    <header class="header">
      <div>
        <img class="logo" src="${escapeHtml(origin)}/images/logo-comptoir-alqods.png" alt="Comptoir AlQods" />
        <div class="company">
          <strong>${escapeHtml(store.name)}</strong><br />
          ${escapeHtml(store.address)}<br />
          Tél : ${escapeHtml(store.phone)} · WhatsApp : ${escapeHtml(store.whatsapp)}<br />
          Email : ${escapeHtml(store.email)}
        </div>
      </div>
      <div class="doc-title">
        <h1>${escapeHtml(title)}</h1>
        <div class="reference">${escapeHtml(reference)}</div>
        <div class="meta">Date : ${escapeHtml(dateLabel(order))}</div>
        <div class="meta">Commande : ${escapeHtml(orderNumber(order))}</div>
      </div>
    </header>

    <section class="blocks">
      <div class="block">
        <h2>Client</h2>
        <p><strong>${escapeHtml(customerName(order))}</strong></p>
        <p>Téléphone : ${escapeHtml(order.customer.phone || "")}</p>
        <p>Email : ${escapeHtml(order.customer.email || "Non renseigné")}</p>
        <p>CNI : ${escapeHtml(order.customer.cni || "Non renseignée")}</p>
      </div>
      <div class="block">
        <h2>Livraison</h2>
        <p>${escapeHtml(order.customer.address || "Adresse non renseignée")}</p>
        <p>${escapeHtml(order.customer.district || "")} ${escapeHtml(order.customer.city || "")}</p>
        <p>Mode de paiement : ${escapeHtml(paymentLabel(order))}</p>
      </div>
    </section>

    <table>
      <thead>
        <tr>
          <th>Produit</th>
          <th class="center">Qté</th>
          <th class="right">Prix unitaire</th>
          <th class="right">Total</th>
        </tr>
      </thead>
      <tbody>${itemRows || '<tr><td colspan="4">Aucun produit renseigné.</td></tr>'}</tbody>
    </table>

    <section class="totals">
      <div class="totals-row"><span>Sous-total</span><strong>${escapeHtml(formatPrice(subtotal))}</strong></div>
      <div class="totals-row"><span>Livraison</span><strong>${escapeHtml(formatPrice(deliveryFee))}</strong></div>
      <div class="totals-row grand"><span>Total TTC</span><span>${escapeHtml(formatPrice(total))}</span></div>
    </section>

    <div class="note">
      ${isInvoice
        ? "Merci pour votre commande. Cette facture reprend les produits commandés auprès de Comptoir AlQods."
        : "Ce devis est établi selon les informations disponibles au moment de la demande. Les prix et disponibilités peuvent être confirmés par l’équipe Comptoir AlQods."}
    </div>

    <footer class="footer">
      ${escapeHtml(store.name)} · ${escapeHtml(store.city)}, ${escapeHtml(store.country)} · ${escapeHtml(store.email)} · ${escapeHtml(store.phone)}<br />
      Paiement sécurisé par carte bancaire ou paiement à la livraison selon disponibilité.
    </footer>
  </main>
</body>
</html>`;
}

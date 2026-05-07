import type { Order } from "@/types/order";
import { env } from "@/lib/env";
import { buildOrderConfirmationEmail } from "@/lib/emailTemplates";

type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
};

export async function sendEmail(input: SendEmailInput) {
  if (!env.resendApiKey) {
    return { ok: false, skipped: true, reason: "RESEND_API_KEY is not configured" };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.resendApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: env.emailFrom,
      to: input.to,
      subject: input.subject,
      text: input.text
    })
  });

  return { ok: response.ok, skipped: false };
}

export async function sendOrderEmails(order: Order) {
  const customerEmail = buildOrderConfirmationEmail(order);
  const adminEmail = {
    subject: `Nouvelle commande ${order.orderNumber}`,
    text: [
      `Nouvelle commande ${order.orderNumber}`,
      `Client : ${order.customer.fullName}`,
      `Téléphone : ${order.customer.phone}`,
      `Email : ${order.customer.email}`,
      `Ville : ${order.customer.city}`,
      `Total : ${order.total} DH`,
      `Paiement : ${order.paymentMethod}`
    ].join("\n")
  };

  const results = await Promise.allSettled([
    sendEmail({ to: order.customer.email, ...customerEmail }),
    sendEmail({ to: env.adminEmail, ...adminEmail })
  ]);

  return results.map((result) => result.status === "fulfilled" ? result.value : { ok: false, skipped: false });
}

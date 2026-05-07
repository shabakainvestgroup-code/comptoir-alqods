import { sendEmail } from "@/lib/email";
import { insertRow, listRows, updateRow, updateRows } from "@/lib/supabaseRest";
import type { Customer } from "@/lib/customers";

type VerificationCode = {
  id: string;
  customer_id: string;
  channel: "email" | "sms";
  destination: string;
  code: string;
  expires_at: string;
  used_at?: string | null;
};

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function sendEmailVerificationCode(customer: Customer) {
  if (!customer.id || !customer.email) {
    throw new Error("Customer email is required");
  }

  const code = generateCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  await insertRow("verification_codes", {
    customer_id: customer.id,
    channel: "email",
    destination: customer.email,
    code,
    expires_at: expiresAt
  });

  await sendEmail({
    to: customer.email,
    subject: "Code de vérification email - Comptoir AlQods",
    text: [
      `Bonjour ${customer.full_name},`,
      "",
      "Voici votre code de vérification email Comptoir AlQods :",
      "",
      code,
      "",
      "Ce code expire dans 10 minutes.",
      "Si vous n’êtes pas à l’origine de cette demande, ignorez cet email."
    ].join("\n")
  });

  return { ok: true, expiresAt };
}

export async function verifyEmailCode(customerId: string, code: string) {
  const rows = await listRows<VerificationCode>("verification_codes", {
    select: "*",
    filters: {
      customer_id: customerId,
      channel: "email",
      code
    },
    order: "created_at.desc",
    limit: 1
  });

  const verification = rows[0];
  if (!verification || verification.used_at || new Date(verification.expires_at).getTime() < Date.now()) {
    return { ok: false };
  }

  await updateRow("verification_codes", verification.id, {
    used_at: new Date().toISOString()
  });

  await updateRows("customers", { id: customerId }, {
    email_verified: true,
    updated_at: new Date().toISOString()
  });

  return { ok: true };
}

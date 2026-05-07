import { env } from "@/lib/env";

type SendSmsInput = {
  to: string;
  message: string;
};

function normalizeMoroccoPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (digits.startsWith("212")) return `+${digits}`;
  if (digits.startsWith("0")) return `+212${digits.slice(1)}`;
  if (digits.length === 9) return `+212${digits}`;

  return phone.startsWith("+") ? phone : `+${digits}`;
}

async function sendWithTwilio({ to, message }: SendSmsInput) {
  if (!env.twilioAccountSid || !env.twilioAuthToken) {
    throw new Error("Twilio is not configured");
  }

  const body = new URLSearchParams();
  body.set("To", normalizeMoroccoPhone(to));
  body.set("Body", message);

  if (env.twilioMessagingServiceSid) {
    body.set("MessagingServiceSid", env.twilioMessagingServiceSid);
  } else if (env.twilioFromNumber) {
    body.set("From", env.twilioFromNumber);
  } else {
    throw new Error("Twilio sender is not configured");
  }

  const credentials = Buffer.from(`${env.twilioAccountSid}:${env.twilioAuthToken}`).toString("base64");
  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${env.twilioAccountSid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body,
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Twilio request failed: ${response.status}`);
  }

  return response.json();
}

export async function sendSms(input: SendSmsInput) {
  if (env.smsProvider === "twilio") {
    await sendWithTwilio(input);
    return { ok: true, provider: "twilio" };
  }

  console.info("[SMS demo]", {
    to: normalizeMoroccoPhone(input.to),
    message: input.message
  });

  return { ok: true, provider: "demo" };
}

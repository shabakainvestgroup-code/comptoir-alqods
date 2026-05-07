export const env = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  adminEmail: process.env.ADMIN_ORDER_EMAIL || "contact@comptoiralqods.ma",
  resendApiKey: process.env.RESEND_API_KEY,
  paymentProvider: process.env.PAYMENT_PROVIDER || "demo",
  cmiMerchantId: process.env.CMI_MERCHANT_ID,
  cmiStoreKey: process.env.CMI_STORE_KEY,
  cmiGatewayUrl: process.env.CMI_GATEWAY_URL,
  payzoneMerchantId: process.env.PAYZONE_MERCHANT_ID,
  payzoneSecretKey: process.env.PAYZONE_SECRET_KEY,
  payzoneGatewayUrl: process.env.PAYZONE_GATEWAY_URL
};

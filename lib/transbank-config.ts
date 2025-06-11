export interface TransactionRequest {
  amount: number;
  sessionId: string;
  buyOrder: string;
}

export const TRANSBANK_CONFIG = {
  // Para testing usa estas URLs
  WEBPAY_URL:
    process.env.TRANSBANK_ENVIRONMENT === "production"
      ? "https://webpay3g.transbank.cl"
      : "https://webpay3gint.transbank.cl", // URL de integración

  COMMERCE_CODE: process.env.TRANSBANK_COMMERCE_CODE || "597055555532", // Código de comercio de prueba
  API_KEY:
    process.env.TRANSBANK_API_KEY ||
    "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C", // API Key de prueba

  RETURN_URL:
    process.env.TRANSBANK_RETURN_URL ||
    "https://v0-docut-api-di.vercel.app/api/transbank/return",
  APP_URL: process.env.APP_URL || "http://localhost:8100",
};

console.log("=== TRANSBANK CONFIG ===");
console.log("Environment:", process.env.TRANSBANK_ENVIRONMENT || "integration");
console.log("WebPay URL:", TRANSBANK_CONFIG.WEBPAY_URL);
console.log("Commerce Code:", TRANSBANK_CONFIG.COMMERCE_CODE);
console.log("Return URL:", TRANSBANK_CONFIG.RETURN_URL);
console.log("API Key existe:", !!TRANSBANK_CONFIG.API_KEY);

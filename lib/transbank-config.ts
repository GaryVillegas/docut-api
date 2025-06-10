// Configuración de Transbank WebPay Plus
export const TRANSBANK_CONFIG = {
  // URLs de integración (ambiente de pruebas)
  WEBPAY_URL: "https://webpay3gint.transbank.cl",

  // Credenciales de integración (estas son públicas para testing)
  COMMERCE_CODE: "597055555532",
  API_KEY: "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C",

  // URLs de tu aplicación (cambiar por las tuyas en producción)
  RETURN_URL: process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}/api/transbank/return`
    : "http://localhost:3000/api/transbank/return",
};

// Tipos TypeScript para mejor desarrollo
export interface TransactionRequest {
  amount: number;
  sessionId: string;
  buyOrder: string;
}

export interface TransactionResponse {
  token: string;
  url: string;
}

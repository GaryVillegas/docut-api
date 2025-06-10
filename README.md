# API Transbank para Ionic Angular

## Configuración

1. **Variables de entorno** (crear archivo `.env.local`):
   \`\`\`

# Para producción, cambiar por tus credenciales reales

TRANSBANK_COMMERCE_CODE=597055555532
TRANSBANK_API_KEY=579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C
\`\`\`

## Endpoints disponibles

### 1. Crear transacción

**POST** `/api/transbank/create`

\`\`\`json
{
"amount": 10000,
"sessionId": "session123",
"buyOrder": "order123"
}
\`\`\`

**Respuesta:**
\`\`\`json
{
"success": true,
"token": "token_aqui",
"url": "https://webpay3gint.transbank.cl/webpayserver/initTransaction",
"message": "Transacción creada exitosamente"
}
\`\`\`

### 2. Confirmar transacción

**POST** `/api/transbank/confirm`

\`\`\`json
{
"token": "token_de_transbank"
}
\`\`\`

## Uso en tu app Ionic Angular

\`\`\`typescript
// En tu servicio de pagos
async createPayment(amount: number, orderId: string) {
const response = await fetch('https://tu-api.vercel.app/api/transbank/create', {
method: 'POST',
headers: {
'Content-Type': 'application/json'
},
body: JSON.stringify({
amount: amount,
sessionId: `session_${Date.now()}`,
buyOrder: orderId
})
});

const data = await response.json();

if (data.success) {
// Redireccionar al usuario a data.url para pagar
window.location.href = data.url;
}
}
\`\`\`

## Despliegue en Vercel

1. Conecta tu repositorio a Vercel
2. Las variables de entorno se configuran automáticamente
3. Vercel detectará que es Next.js y configurará todo automáticamente

## Notas importantes

- Las credenciales incluidas son para el ambiente de integración
- Para producción necesitarás solicitar credenciales reales a Transbank
- El flujo completo: Crear → Pagar → Confirmar
- Siempre confirma las transacciones en el backend por seguridad

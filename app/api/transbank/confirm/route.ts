import { type NextRequest, NextResponse } from "next/server";
import { TRANSBANK_CONFIG } from "@/lib/transbank-config";

export async function POST(request: NextRequest) {
  try {
    // Obtener el token de la transacción
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: "Token requerido" }, { status: 400 });
    }

    // Confirmar transacción con Transbank
    const response = await fetch(
      `${TRANSBANK_CONFIG.WEBPAY_URL}/rswebpaytransaction/api/webpay/v1.2/transactions/${token}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Tbk-Api-Key-Id": TRANSBANK_CONFIG.COMMERCE_CODE,
          "Tbk-Api-Key-Secret": TRANSBANK_CONFIG.API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error confirmando transacción: ${response.status}`);
    }

    const result = await response.json();

    // Verificar si la transacción fue exitosa
    const isSuccessful = result.status === "AUTHORIZED";

    return NextResponse.json({
      success: isSuccessful,
      transaction: result,
      message: isSuccessful ? "Pago exitoso" : "Pago rechazado",
    });
  } catch (error) {
    console.error("Error confirmando transacción:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error confirmando transacción",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}

import { type NextRequest, NextResponse } from "next/server";
import {
  TRANSBANK_CONFIG,
  type TransactionRequest,
} from "@/lib/transbank-config";

export async function POST(request: NextRequest) {
  try {
    // Obtener datos del cuerpo de la petición
    const body: TransactionRequest = await request.json();

    // Validar datos requeridos
    if (!body.amount || !body.sessionId || !body.buyOrder) {
      return NextResponse.json(
        { error: "Faltan datos requeridos: amount, sessionId, buyOrder" },
        { status: 400 }
      );
    }

    // Preparar datos para Transbank
    const transactionData = {
      buy_order: body.buyOrder,
      session_id: body.sessionId,
      amount: body.amount,
      return_url: TRANSBANK_CONFIG.RETURN_URL,
    };

    // Llamar a la API de Transbank
    const response = await fetch(
      `${TRANSBANK_CONFIG.WEBPAY_URL}/rswebpaytransaction/api/webpay/v1.2/transactions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Tbk-Api-Key-Id": TRANSBANK_CONFIG.COMMERCE_CODE,
          "Tbk-Api-Key-Secret": TRANSBANK_CONFIG.API_KEY,
        },
        body: JSON.stringify(transactionData),
      }
    );

    if (!response.ok) {
      throw new Error(`Error de Transbank: ${response.status}`);
    }

    const result = await response.json();

    // Devolver token y URL para redireccionar al usuario
    return NextResponse.json({
      success: true,
      token: result.token,
      url: result.url,
      message: "Transacción creada exitosamente",
    });
  } catch (error) {
    console.error("Error creando transacción:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error interno del servidor",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}

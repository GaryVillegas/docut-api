import { type NextRequest, NextResponse } from "next/server";
import { TRANSBANK_CONFIG } from "@/lib/transbank-config";

export async function POST(request: NextRequest) {
  try {
    // Transbank envía el token como form data
    const formData = await request.formData();
    const token = formData.get("token_ws") as string;

    if (!token) {
      // Redireccionar a la app con error
      return NextResponse.redirect(`${TRANSBANK_CONFIG.APP_URL}/error`);
    }

    // Confirmar la transacción directamente aquí
    const confirmResponse = await fetch(
      `${TRANSBANK_CONFIG.WEBPAY_URL}/webpayserver/init_transaction?${token}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Tbk-Api-Key-Id": TRANSBANK_CONFIG.COMMERCE_CODE,
          "Tbk-Api-Key-Secret": TRANSBANK_CONFIG.API_KEY,
        },
      }
    );

    const result = await confirmResponse.json();
    const isSuccessful = result.status === "AUTHORIZED";

    // Redireccionar a tu app con los resultados
    const appRedirectUrl = new URL(TRANSBANK_CONFIG.APP_URL);
    appRedirectUrl.searchParams.set(
      "status",
      isSuccessful ? "success" : "failure"
    );
    appRedirectUrl.searchParams.set("order", result.buy_order || "");
    appRedirectUrl.searchParams.set("amount", result.amount?.toString() || "");

    if (isSuccessful) {
      appRedirectUrl.searchParams.set(
        "authCode",
        result.authorization_code || ""
      );
    }

    return NextResponse.redirect(appRedirectUrl.toString());
  } catch (error) {
    console.error("Error en return URL:", error);
    return NextResponse.redirect(`${TRANSBANK_CONFIG.APP_URL}/error`);
  }
}

// También manejar GET por si acaso
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token_ws");

  if (!token) {
    return NextResponse.redirect(`${TRANSBANK_CONFIG.APP_URL}/error`);
  }

  // Mismo proceso que en POST
  try {
    const confirmResponse = await fetch(
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

    const result = await confirmResponse.json();
    const isSuccessful = result.status === "AUTHORIZED";

    const appRedirectUrl = new URL(TRANSBANK_CONFIG.APP_URL);
    appRedirectUrl.searchParams.set(
      "status",
      isSuccessful ? "success" : "failure"
    );
    appRedirectUrl.searchParams.set("order", result.buy_order || "");
    appRedirectUrl.searchParams.set("amount", result.amount?.toString() || "");

    if (isSuccessful) {
      appRedirectUrl.searchParams.set(
        "authCode",
        result.authorization_code || ""
      );
    }

    return NextResponse.redirect(appRedirectUrl.toString());
  } catch (error) {
    console.error("Error en return URL:", error);
    return NextResponse.redirect(`${TRANSBANK_CONFIG.APP_URL}/error`);
  }
}

import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Transbank envía el token como form data
    const formData = await request.formData();
    const token = formData.get("token_ws") as string;

    if (!token) {
      // Redireccionar a página de error en tu app
      return NextResponse.redirect(new URL("/payment/error", request.url));
    }

    // Redireccionar a tu app con el token para confirmar
    const redirectUrl = new URL("/payment/confirm", request.url);
    redirectUrl.searchParams.set("token", token);

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("Error en return URL:", error);
    return NextResponse.redirect(new URL("/payment/error", request.url));
  }
}

// También manejar GET por si acaso
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token_ws");

  if (!token) {
    return NextResponse.redirect(new URL("/payment/error", request.url));
  }

  const redirectUrl = new URL("/payment/confirm", request.url);
  redirectUrl.searchParams.set("token", token);

  return NextResponse.redirect(redirectUrl);
}

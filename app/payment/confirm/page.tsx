"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function PaymentConfirm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      confirmPayment(token);
    } else {
      setError("Token no encontrado");
      setLoading(false);
    }
  }, [token]);

  const confirmPayment = async (token: string) => {
    try {
      const response = await fetch("/api/transbank/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError("Error confirmando el pago");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <p>Confirmando pago...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "0 auto",
        padding: "20px",
        border: "1px solid #ccc",
      }}
    >
      <h1 style={{ textAlign: "center" }}>
        {result?.success ? "Pago Exitoso" : "Pago Fallido"}
      </h1>

      {result?.success ? (
        <div>
          <p>
            <strong>Orden:</strong> {result.transaction?.buy_order}
          </p>
          <p>
            <strong>Monto:</strong> ${result.transaction?.amount}
          </p>
          <p>
            <strong>Código autorización:</strong>{" "}
            {result.transaction?.authorization_code}
          </p>
        </div>
      ) : (
        <div>
          <p style={{ color: "red" }}>
            {error || result?.message || "Error procesando el pago"}
          </p>
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          onClick={() => (window.location.href = "/")}
          style={{
            padding: "10px 20px",
            background: "#0070f3",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}

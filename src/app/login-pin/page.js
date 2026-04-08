"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/app/i18n";

export default function PINLoginPage() {
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();
  const { t, i18n } = useTranslation("maintenance");

  const PIN_LENGTH = 4;
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL_DEV;

  // se già loggato, vai alla dashboard
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) router.push("/select-ship");
  }, [router]);

  const handleButtonClick = (value) => {
    if (isLoading) return; // blocca se stai loggando

    if (value === "delete") {
      setPin((prev) => prev.slice(0, -1));
      return;
    }

    if (pin.length < PIN_LENGTH) {
      const newPin = pin + value;
      setPin(newPin);

      if (newPin.length === PIN_LENGTH) {
        handleLogin(newPin);
      }
    }
  };

  const handleLogin = async (enteredPin) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/api/auth/login-pin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: enteredPin }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Errore login");

      localStorage.setItem("token", data.token);
      router.push("/select-ship");
    } catch (err) {
      setError(true);
      setPin("");
      setIsLoading(false);
    }
  };

  if (!i18n.isInitialized) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#001c38] text-white">
      <h2 className="text-2xl font-semibold mb-6">{t("insert_pin")}</h2>
      {error && <p className="text-red-500 mt-4">{t("login_pin_error")}</p>}

      {/* Cerchi PIN */}
      <div className="flex gap-3 mb-12 mt-6">
        {Array.from({ length: PIN_LENGTH }).map((_, index) => (
          <div
            key={index}
            className={`w-4 h-4 rounded-full transition ${
              index < pin.length
                ? "bg-white"
                : "border border-white opacity-50"
            }`}
          />
        ))}
      </div>

      {/* Tastierino o loader */}
      {isLoading ? (
        <div className="mt-6"> {t("loading") || "Loading..."}</div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, ".", 0, "delete"].map((value, index) => (
            <button
              key={index}
              className="w-24 h-14 flex items-center justify-center text-lg font-semibold rounded-lg bg-[#022a52] hover:bg-blue-500 transition"
              onClick={() => handleButtonClick(value)}
            >
              {value === "delete" ? "⌫" : value}
            </button>
          ))}
        </div>
      )}

      <button
        className="mt-4 text-sm text-white hover:underline"
        onClick={() => router.push("/login")}
        disabled={isLoading}
      >
        {t("traditional_login")}
      </button>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/app/i18n";
import { loginPin } from "@/api/admin/auth";

export default function AdminLoginPin() {
  const [pin, setPin] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const PIN_LENGTH = 4;

  const handleButtonClick = (value) => {
    if (value === "delete") {
      setPin(pin.slice(0, -1));
    } else if (pin.length < PIN_LENGTH) {
      setPin(pin + value);
    }
  };

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) router.push("/admin");
    setError(null);
  }, []);

  useEffect(() => {
    if (pin.length === PIN_LENGTH && !isLoggingIn) {
      handleLogin();
    }
  }, [pin]);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setError(null);

    try {
      const data = await loginPin(pin);

      localStorage.setItem("token", data.token);
      router.push("/admin");
    } catch (err) {
      console.error("Errore login PIN:", err);
      setError(err.message);
      setPin("");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const { t, i18n } = useTranslation("maintenance");
  if (!i18n.isInitialized) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A2038] text-white">
      <h1 className="text-3xl font-bold mb-2">
        <span>Wake</span>{" "}
        <span className="italic font-light text-lg">Admin</span>
      </h1>
      <h2 className="text-md font-regular mb-6">{t("insert_pin")}</h2>

      <div className="flex gap-3 mb-12 mt-6">
        {Array.from({ length: PIN_LENGTH }).map((_, index) => (
          <div
            key={index}
            className={`w-4 h-4 rounded-full ${
              index < pin.length ? "bg-white" : "border border-white opacity-50"
            }`}
          ></div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, ".", 0, "delete"].map((value, index) => (
          <button
            key={index}
            className="w-24 h-14 flex items-center justify-center text-lg font-semibold rounded-lg bg-[#022a52] hover:bg-[#4C79D8] transition"
            onClick={() => handleButtonClick(value)}
            disabled={isLoggingIn}
          >
            {value === "delete" ? "⌫" : value}
          </button>
        ))}
      </div>

      <button
        className="mt-4 text-sm text-white hover:underline"
        onClick={() => router.push("/login")}
        disabled={isLoggingIn}
      >
        {t("traditional_login")}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}

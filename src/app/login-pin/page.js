"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "@/app/i18n";
import { jwtDecode } from "jwt-decode";

const PIN_LENGTH = 4;

function PINLoginContent() {
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [shipName, setShipName] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, i18n } = useTranslation("maintenance");

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL_DEV;
  const shipId = searchParams.get("shipId");

  useEffect(() => {
    if (!shipId) {
      router.replace("/select-ship");
      return;
    }
    // Recupera il nome della nave dalla cache per mostrarlo
    try {
      const ships = JSON.parse(localStorage.getItem("ships") || "[]");
      const ship = ships.find((s) => String(s.shipId) === String(shipId));
      if (ship) setShipName(ship.shipName);
    } catch {}
  }, [shipId, router]);

  const handleButtonClick = (value) => {
    if (isLoading) return;
    if (value === "delete") {
      setPin((prev) => prev.slice(0, -1));
      setError(false);
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
    setError(false);

    try {
      const response = await fetch(`${BASE_URL}/api/auth/login-pin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Passa sia il PIN che la nave selezionata
        body: JSON.stringify({ pin: enteredPin, shipId: Number(shipId) }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Errore login");

      // Valida il token ricevuto
      const decoded = jwtDecode(data.token);
      const now = Date.now() / 1000;
      if (decoded.exp && decoded.exp < now) throw new Error("Token scaduto");

      localStorage.setItem("token", data.token);
      localStorage.setItem("selectedShipId", shipId);

      router.replace("/dashboard");
    } catch {
      setError(true);
      setPin("");
      setIsLoading(false);
    }
  };

  if (!i18n.isInitialized) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#001c38] text-white">
      {shipName && (
        <p className="text-[#789fd6] text-sm mb-2 font-mono uppercase tracking-widest">
          {shipName}
        </p>
      )}
      <h2 className="text-2xl font-semibold mb-2">{t("insert_pin")}</h2>
      <p className="text-white/40 text-sm mb-6">Inserisci il tuo PIN personale</p>

      {error && (
        <p className="text-red-400 text-sm mb-4">{t("login_pin_error")}</p>
      )}

      {/* Cerchi PIN */}
      <div className="flex gap-3 mb-10">
        {Array.from({ length: PIN_LENGTH }).map((_, index) => (
          <div
            key={index}
            className={`w-4 h-4 rounded-full transition-all duration-150 ${
              index < pin.length ? "bg-white scale-110" : "border border-white opacity-30"
            }`}
          />
        ))}
      </div>

      {/* Tastierino */}
      {isLoading ? (
        <p className="text-white/50">{t("loading") || "Verifica in corso..."}</p>
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
        className="mt-8 text-sm text-white/40 hover:text-white transition"
        onClick={() => router.push("/select-ship")}
        disabled={isLoading}
      >
        ← Torna alla selezione nave
      </button>
    </div>
  );
}

// Necessario perché useSearchParams richiede Suspense in Next.js
export default function PINLoginPage() {
  return (
    <Suspense>
      <PINLoginContent />
    </Suspense>
  );
}
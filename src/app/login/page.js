"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "@/app/i18n";
import Cookies from "js-cookie";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isClient, setIsClient] = useState(false);
  const { t, i18n } = useTranslation("maintenance");

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL_DEV;

  useEffect(() => {
    setIsClient(true);
    // Se ci sono già credenziali salvate, vai direttamente al selettore navi
    const savedEmail = Cookies.get("auth_email");
    const savedPassword = Cookies.get("auth_password");
    if (savedEmail && savedPassword) {
      router.replace("/select-ship");
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Errore login");

      // Salva credenziali in cookie (7 giorni)
      Cookies.set("auth_email", email, { expires: 7, secure: true, sameSite: "strict" });
      Cookies.set("auth_password", password, { expires: 7, secure: true, sameSite: "strict" });
      // Salva la lista navi
      localStorage.setItem("ships", JSON.stringify(data.ships));

      router.replace("/select-ship");
    } catch (err) {
      setError(err.message || "Errore di connessione al server");
    } finally {
      setLoading(false);
    }
  };

  if (!i18n.isInitialized || !isClient) return null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#001c38]">
      <div className="w-full max-w-md p-8 rounded-lg">
        <h2 className="text-2xl font-semibold text-white text-center mb-6">
          {t("login")}
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[#789fd6] block mb-2">{t("email")}</label>
            <input
              type="email"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-[#1E2A3D] text-white focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md"
              required
            />
          </div>
          <div>
            <label className="text-[#789fd6] block mb-2">{t("password")}</label>
            <input
              type="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-[#1E2A3D] text-white focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md"
              required
            />
          </div>

          <div className="w-full text-center">
            <Link href="/reset-password" className="text-white text-sm hover:underline">
              {t("forgot_password")}
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-6 w-full bg-[#789fd6] hover:bg-blue-500 text-white font-bold py-4 px-4 transition duration-200 rounded-md ${
              loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            {loading ? "Accesso in corso..." : t("log_in")}
          </button>

          <div className="w-full text-center">
            <Link href="/adminLogin" className="text-white text-sm hover:underline">
              {t("admin_access")}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
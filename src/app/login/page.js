"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "@/app/i18n";
import { jwtDecode } from "jwt-decode";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isClient, setIsClient] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL_DEV;

  // Esegui solo lato client
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsClient(true);

      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const now = Date.now() / 1000;
          if (decoded.exp && decoded.exp > now) {
            router.replace("/dashboard");
          }
        } catch {
          localStorage.removeItem("token");
        }
      }
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      localStorage.setItem("auth_in_progress", "true");

      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Errore login");

      localStorage.setItem("token", data.token);

      try {
        const decoded = jwtDecode(data.token);
        const now = Date.now() / 1000;
        if (decoded.exp && decoded.exp < now) {
          throw new Error("Token scaduto, effettua di nuovo il login.");
        }
      } catch {
        localStorage.removeItem("token");
        throw new Error("Token non valido.");
      }

      setSuccess("Login effettuato con successo! Reindirizzamento in corso...");

      await new Promise((resolve) => setTimeout(resolve, 800));

      router.replace("/dashboard");
    } catch (err) {
      setError(err.message || "Errore di connessione al server");
    } finally {
      localStorage.removeItem("auth_in_progress");
      setLoading(false);
    }
  };

  const { t, i18n } = useTranslation("maintenance");
  if (!i18n.isInitialized || !isClient) return null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#001c38]">
      <div className="w-full max-w-md p-8 rounded-lg">
        <h2 className="text-2xl font-semibold text-white text-center mb-6">
          {t("login")}
        </h2>

        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}

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
            <Link
              href="/reset-password"
              className="text-white text-sm hover:underline"
            >
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

          <div className="flex items-center">
            <div className="w-full text-center">
            <Link
              href="/login-pin"
              className="text-white text-sm hover:underline"
            >
              {t("rapid_pin")}
            </Link>
            </div>

            <div className="w-full text-center">
              <Link
                href="/adminLogin"
                className="text-white text-sm hover:underline"
              >
                {t("admin_access")}
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

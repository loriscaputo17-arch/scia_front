"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "@/app/i18n";
import { login } from "@/api/admin/auth";

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (token) {
      router.push("/dashboard");
    }

    setIsClient(true);
    setError("");
    setSuccess("");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await login(email, password); // utilizziamo la funzione importata

      localStorage.setItem("token", data.token);

      router.push("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const { t, i18n } = useTranslation("maintenance");
  if (!i18n.isInitialized || !isClient) return null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#001c38]">
      <div className="w-full max-w-md p-8 rounded-lg bg-[#102740] shadow-lg">
        <h1 className="text-3xl text-center mb-6">
          <span className="font-bold text-white">Scia</span>{" "}
          <span className="italic text-white text-lg font-light">Admin</span>
        </h1>

        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[#a0b9d9] block mb-2">{t("email")}</label>
            <input
              type="email"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-[#1C2A3F] text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
              required
            />
          </div>
          <div>
            <label className="text-[#a0b9d9] block mb-2">{t("password")}</label>
            <input
              type="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-[#1C2A3F] text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
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
            className={`mt-6 w-full bg-[#4C79D8] hover:bg-blue-600 text-white font-semibold py-4 px-4 transition duration-200 rounded-md ${
              loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            {loading ? "Caricamento..." : t("log_in")}
          </button>
        </form>
      </div>
    </div>
  );
}

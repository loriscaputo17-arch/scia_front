"use client";
import { useState, useEffect } from "react";
import { useTranslation } from "@/app/i18n";

export default function InstructionModal({ onClose, text }) {

  const { t, i18n } = useTranslation("maintenance");
  const [mounted, setMounted] = useState(false);
          
  useEffect(() => {
    setMounted(true);
  }, []);
          
  if (!mounted || !i18n.isInitialized) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#022a52] p-5 rounded-md text-white w-[80%] max-w-lg shadow-lg">

        <h2 className="text-xl font-semibold mb-4">{t("instructions")}</h2>

        <p className="whitespace-pre-line text-sm leading-relaxed">
          {text || "No instructions available"}
        </p>

        <button 
          onClick={onClose} 
          className="mt-6 w-full bg-[#789fd6] py-2 rounded-md text-white hover:bg-blue-500 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}

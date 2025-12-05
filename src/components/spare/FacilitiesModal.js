"use client";

import { useState } from "react";
import FacilitiesList from "@/components/facilities/FacilitiesListxModal";
import { useTranslation } from "@/app/i18n";

export default function NotesModal({ isOpen, onClose2, onSelectCode }) {
  /** -------------------------------------------------
   * HOOKS (obbligatoriamente all’inizio)
   * ------------------------------------------------- */
  const [search, setSearch] = useState("");
  const [selectedCode, setSelectedCode] = useState(null);

  const { t, i18n } = useTranslation("maintenance");

  /** -------------------------------------------------
   * EARLY RETURN (dopo i hook!)
   * ------------------------------------------------- */
  if (!i18n?.isInitialized) return null;
  if (!isOpen) return null;

  /** -------------------------------------------------
   * HANDLERS
   * ------------------------------------------------- */
  const handleConfirm = () => {
    onSelectCode(selectedCode);
    onClose2();
  };

  /** -------------------------------------------------
   * UI
   * ------------------------------------------------- */
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-10">
      <div className="bg-[#022a52] sm:w-[70%] w-full sm:h-auto h-full p-6 rounded-md shadow-lg text-white overflow-y-auto max-h-[95vh]">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[22px] font-semibold">{t("system_filter")}</h2>

          <button className="text-white text-xl cursor-pointer" onClick={onClose2}>
            <svg width="24px" height="24px" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
              <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
            </svg>
          </button>
        </div>

        {/* SEARCH FIELD */}
        <input
          type="text"
          placeholder={t("search_here")}
          className="w-full px-4 py-2 pr-10 bg-[#ffffff10] text-white rounded-md mb-4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* LIST */}
        <FacilitiesList
          search={search}
          modal="yes"
          onSelect={(code) => setSelectedCode(code)}
        />

        {/* CONFIRM BUTTON */}
        <button
          className="w-full bg-[#789fd6] p-3 mt-6 text-white font-semibold rounded-md"
          onClick={handleConfirm}
          disabled={!selectedCode}
        >
          {t("confirm")}
        </button>

      </div>
    </div>
  );
}

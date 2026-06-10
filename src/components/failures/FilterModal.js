"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "@/app/i18n";

export default function FilterModal({ isOpen, onClose, onApply, currentFilters }) {
  const { t, i18n } = useTranslation("failures");

  const [filters, setFilters] = useState(currentFilters || {
    gravity: {
      critica: false,
      alta: false,
      media: false,
      bassa: false,
    },
    squadra: {
      connected_user: false,
      crew: false,
      maintenance: false,
      command: false,
    },
  });

  const teamTranslationKeys = {
    connected_user: "user_types.connected_user",
    crew: "user_types.crew",
    maintenance: "user_types.maintenance",
    command: "user_types.command",
  };

  useEffect(() => {
    if (currentFilters) setFilters(currentFilters);
  }, [currentFilters]);

  const toggleFilter = (category, key) => {
    console.log("toggle:", category, key);
    setFilters(prev => {
      const next = { ...prev, [category]: { ...prev[category], [key]: !prev[category][key] } };
      console.log("nuovo filters:", JSON.stringify(next));
      return next;
    });
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) onClose();
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  if (!i18n.isInitialized) return null;

  return isOpen ? (
    <div className="fixed inset-0 flex justify-end bg-black/50 z-10">
      <div ref={sidebarRef} className="w-80 h-full bg-[#022a52] text-white p-5 overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4">{t("filters")}</h2>

        <div className="mb-5">
          <h3 className="text-[#789fd6] mb-3">{t("severity")}</h3>
          {[
            { key: "critica", label: t("gravities.critica"), color: "bg-red-500" },
            { key: "alta", label: t("gravities.alta"), color: "bg-orange-500" },
            { key: "media", label: t("gravities.media"), color: "bg-yellow-500" },
            { key: "bassa", label: t("gravities.bassa"), color: "bg-green-500" },
          ].map((item) => (
            <label key={item.key} className="flex justify-between items-center mb-2 cursor-pointer">
              <span className={`w-5 h-5 ${item.color} rounded-sm`}></span>
              &nbsp;{item.label}

              <input
                type="checkbox"
                checked={filters.gravity[item.key]}
                onChange={() => toggleFilter("gravity", item.key)}
                className="mr-2 cursor-pointer w-[20px] h-[20px] appearance-none border-2 border-[#ffffff20] bg-transparent rounded-sm transition-all duration-200 
                checked:bg-[#789fd6] checked:border-[#789fd6] hover:opacity-80 focus:outline-none ml-auto"
              />
            </label>
          ))}
        </div>

        <div className="mb-5">
          <h3 className="text-[#789fd6] mb-3">{t("team")}</h3>
          {Object.entries(filters.squadra).map(([key, val]) => (
            <label key={key} className="flex justify-between items-center mb-2 cursor-pointer">
              <span>{t(teamTranslationKeys[key])}</span>
              <input
                type="checkbox"
                checked={val}
                onChange={() => toggleFilter("squadra", key)}
                className="mr-2 cursor-pointer w-[20px] h-[20px] appearance-none border-2 border-[#ffffff20] bg-transparent rounded-sm transition-all duration-200 
                checked:bg-[#789fd6] checked:border-[#789fd6] hover:opacity-80 focus:outline-none ml-auto"
              />
            </label>
          ))}
        </div>

        <button
          onClick={handleApply}
          className="w-full bg-[#789fd6] p-3 mt-8 rounded-md text-white font-semibold"
        >
          {t("apply_filters")}
        </button>
      </div>
    </div>
  ) : null;
}
"use client";

import { useState, useRef, useEffect } from "react";
import Image from 'next/image';
import FacilitiesModal from "./FacilitiesModal";
import { useTranslation } from "@/app/i18n";
 
export default function FilterSidebar({ isOpen, onClose, filters, toggleFilter }) {

  const [facilitiesOpen, setFacilitiesOpen] = useState(false);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const renderCheckboxes = (category, filterList) => (
    filterList.map(({ key, label, iconSrc, iconAlt }) => (
      <label key={key} className="flex items-center gap-2 mb-4 cursor-pointer">
        {iconSrc && (
          <Image src={iconSrc} alt={iconAlt} width={18} height={18} />
        )}
        <span>{label}</span>

        <input
          type="checkbox"
          checked={filters[category][key]}
          onChange={() => toggleFilter(category, key)}
          className="mr-2 cursor-pointer w-[20px] h-[20px] appearance-none border-2 border-[#ffffff20] bg-transparent rounded-sm transition-all duration-200 
            checked:bg-[#789fd6] checked:border-[#789fd6] hover:opacity-80 focus:outline-none ml-auto"
        />
      </label>
    ))
  );

  const { t, i18n } = useTranslation("maintenance");
    const [mounted, setMounted] = useState(false);
      
    useEffect(() => {
      setMounted(true);
    }, []);
      
    if (!mounted || !i18n.isInitialized) return null;

  return isOpen ? (
    <div className="fixed inset-0 flex justify-end bg-black/50 z-10">
      <div ref={sidebarRef} className="w-80 h-screen bg-[#022a52] text-white p-5" style={{ height: '100%', overflowY: 'scroll'}}>
        <h2 className="text-2xl font-semibold mb-4">{t("filters")}</h2>

        {/* Task Filter */}
        <div className="mb-5">
          <h3 className="text-[16px] text-[#789fd6] mb-3">Task</h3>
          {renderCheckboxes("task", [
            { key: "nascondiTaskEseguiti", label: "Nascondi Task Eseguiti" },
          ])}
        </div>

        {/* Squadra di assegnazione Filter */}
        <div className="mb-5">
          <h3 className="text-[16px] text-[#789fd6] mb-2">{t("assignment_team")}</h3>
          {renderCheckboxes("squadraDiAssegnazione", [
            { key: "operatori", label: "Operatori" },
            { key: "equipaggio", label: "Equipaggio" },
            { key: "manutentori", label: "Manutentori" },
            { key: "comando", label: "Comando" },
          ])}
        </div>

        {/* Macrogruppo e ESWBS */}
        <div className="mb-5">
          <h3 className="text-[16px] text-[#789fd6] mb-2">{t("macrogroup")}</h3>
          {renderCheckboxes("macrogruppoESWBS", [
            { key: "100 - Scafo", label: "100 - Scafo" },
            { key: "200 - Propulsioni/Motori", label: "200 - Propulsioni/Motori" },
            { key: "300 - Impianto elettrico", label: "300 - Impianto elettrico" },
            { key: "400 - Comando, controllo e sorveglianza", label: "400 - Comando, controllo e sorveglianza" },
            { key: "500 - Impianti ausiliari", label: "500 - Impianti ausiliari" },
            { key: "600 - Allestimento e arredamento", label: "600 - Allestimento e arredamento" },
            { key: "700 - Armamenti", label: "700 - Armamenti" },
            { key: "800 - Integration / Engineering", label: "800 - Integration / Engineering" },
            { key: "900 - Ship assembly / Support services", label: "900 - Ship assembly / Support services" },
          ])}
        </div>

        <button
          className="w-full bg-[#789fd6] p-3 mt-8 text-white font-semibold cursor-pointer rounded-md"
          onClick={onClose}
        >
          {t("confirm")}
        </button>
      </div>

      <FacilitiesModal isOpen={facilitiesOpen} onClose2={() => setFacilitiesOpen(false)} />
    </div>
  ) : null;
}

"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useTranslation } from "@/app/i18n";

export default function FilterSidebar({ isOpen, onClose, filters, toggleFilter }) {
  /** -------------------------------------------------
   *  HOOKS — devono essere sempre in cima al componente
   *  ------------------------------------------------- */
  const sidebarRef = useRef(null);

  const { t, i18n } = useTranslation("maintenance");

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  /** -------------------------------------------------
   *  EARLY RETURN (DOPO GLI HOOK!)
   *  ------------------------------------------------- */
  if (!i18n?.isInitialized) return null;
  if (!isOpen) return null;

  /** -------------------------------------------------
   *  HELPERS
   *  ------------------------------------------------- */
  const renderCheckboxes = (category, items) => {
    return items.map(({ key, label, iconSrc, iconAlt }) => (
      <label key={key} className="flex items-center gap-2 mb-4 cursor-pointer">

        {iconSrc && (
          <Image src={iconSrc} alt={iconAlt} width={18} height={18} />
        )}

        <span>{label}</span>

        <input
          type="checkbox"
          checked={filters[category][key]}
          onChange={() => toggleFilter(category, key)}
          className="mr-2 cursor-pointer w-[20px] h-[20px] appearance-none
                     border-2 border-[#ffffff20] bg-transparent rounded-sm 
                     transition-all duration-200 checked:bg-[#789fd6] 
                     checked:border-[#789fd6] ml-auto"
        />
      </label>
    ));
  };

  /** -------------------------------------------------
   *  RENDER UI
   *  ------------------------------------------------- */
  return (
    <div className="fixed inset-0 flex justify-end bg-black/50 z-10">
      <div
        ref={sidebarRef}
        className="w-80 h-screen bg-[#022a52] text-white p-5 overflow-y-auto"
      >
        <h2 className="text-2xl font-semibold mb-4">{t("filters")}</h2>

        {/* TASK FILTER */}
        <div className="mb-5">
          <h3 className="text-[16px] text-[#789fd6] mb-3">Task</h3>

          {renderCheckboxes("task", [
            { key: "inStock", label: t("filters2.in_stock") },
            { key: "nonDisponibile", label: t("filters2.out_of_stock") },
          ])}
        </div>

        {/* SUPPLIER */}
        <div className="mb-5">
          <h3 className="text-[16px] text-[#789fd6] mb-2">{t("supplier")}</h3>

          {Object.keys(filters.fornitore).map((key) => (
            <label key={key} className="flex items-center gap-2 mb-4 cursor-pointer">
              <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>

              <input
                type="checkbox"
                checked={filters.fornitore[key]}
                onChange={() => toggleFilter("fornitore", key)}
                className="mr-2 cursor-pointer w-[20px] h-[20px] appearance-none
                           border-2 border-[#ffffff20] bg-transparent rounded-sm
                           checked:bg-[#789fd6] checked:border-[#789fd6] ml-auto"
              />
            </label>
          ))}
        </div>

        {/* WAREHOUSES */}
        <div className="mb-5">
          <h3 className="text-[16px] text-[#789fd6] mb-2">{t("level")}</h3>

          {Object.keys(filters.magazzino).map((key) => {
            const icons = {
              onboard: "/icons/shape.png",
              dockside: "/icons/Shape-10.png",
              drydock: "/icons/Shape-11.png",
              external: "/icons/Shape-12.png",
            };

            return (
              <label key={key} className="flex items-center gap-2 mb-4 cursor-pointer">
                {icons[key] && (
                  <Image src={icons[key]} alt={key} width={18} height={18} />
                )}

                <span>
                  {key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                </span>

                <input
                  type="checkbox"
                  checked={filters.magazzino[key]}
                  onChange={() => toggleFilter("magazzino", key)}
                  className="mr-2 cursor-pointer w-[20px] h-[20px] appearance-none 
                             border-2 border-[#ffffff20] bg-transparent rounded-sm 
                             checked:bg-[#789fd6] checked:border-[#789fd6] ml-auto"
                />
              </label>
            );
          })}
        </div>

        {/* CONFIRM BUTTON */}
        <button
          className="w-full bg-[#789fd6] p-3 mt-8 text-white font-semibold rounded-md"
          onClick={onClose}
        >
          {t("confirm")}
        </button>
      </div>
    </div>
  );
}

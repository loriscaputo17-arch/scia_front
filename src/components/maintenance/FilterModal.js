"use client";

import { useState, useRef, useEffect } from "react";
import Image from 'next/image';
import FacilitiesModal from "./FacilitiesModal";
import { useTranslation } from "@/app/i18n";

export default function FilterSidebar({ isOpen, onClose, onFiltersChange, initialSystem }) {
  const [filters, setFilters] = useState({
    stato: {
      scaduta: false,
      scadutaDaPoco: false,
      inScadenza: false,
      attiva: false,
      inPausa: false,
      programmata: false,
    },
    ricorrenza: {
      settimanale: false,
      bisettimanale: false,
      mensile: false,
      bimestrale: false,
      trimestrale: false,
      semestrale: false,
      annuale: false,
      biennale: false,
      triennale: false,
    },
    livello: {
      aBordo: false,
      inBanchina: false,
      inBacino: false,
      fornitoreEsterno: false,
    },
    squadra: {
      operatori: false,
      equipaggio: false,
      manutentori: false,
      comando: false,
    },
    ricambi: {
      richiesti: false,
      richiestiDisponibili: false,
      richiestiNonDisponibili: false,
      richiestiInEsaurimento: false,
    },
    system: {
      selectedElement: initialSystem ? Number(initialSystem) : null,
    },
    ricorrenza_giorni: {
      from: "",
      to: "",
    },
  });

  const [selectedSystemName, setSelectedSystemName] = useState(null);

  useEffect(() => {
    if (initialSystem) {
      setFilters(prev => ({
        ...prev,
        system: { selectedElement: Number(initialSystem) },
      }));
      // Opzionale: mostra il codice come nome se non hai il nome disponibile
      setSelectedSystemName(initialSystem);
    }
  }, [initialSystem]);

  const toggleFilter = (category, key) => {
    setFilters((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !prev[category][key],
      },
    }));
  };

  const [facilitiesOpen, setFacilitiesOpen] = useState(false);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest('.facilities-modal') 
      ) {
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

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters]);

  const { t, i18n } = useTranslation("filters");
    const [mounted, setMounted] = useState(false);
      
    useEffect(() => {
      setMounted(true);
    }, []);
      
    if (!mounted || !i18n.isInitialized) return null;

    return isOpen ? (
      <div className="fixed inset-0 flex justify-end bg-black/50 z-10">

        <div ref={sidebarRef} className="w-80 h-screen bg-[#022a52] text-white p-5" style={{ height: '100%', overflowY: 'scroll'}}>
        <h2 className="text-2xl font-semibold mb-4">{t("filters")}</h2>

        {/* System */}
        <div className="mb-5">
          <h3 className="text-[16px] text-[#789fd6] mb-2">{t("system")}</h3>
          
          <div className="flex items-center cursor-pointer" onClick={() => setFacilitiesOpen(true)}>
            <p className={selectedSystemName ? "text-white" : "text-white/60"}>
              {selectedSystemName || t("select_systems")}
            </p>

            <div className="ml-auto flex gap-4 items-center">
            {selectedSystemName && (
              <button
                className="mr-0 text-white/40 hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSystemName(null);
                  setFilters(prev => ({ ...prev, system: { selectedElement: null } }));
                }}
              >
                ✕
              </button>
            )}
            <svg className="" fill="white" width="16px" height="16px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
              <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/>
            </svg>
            </div>
            
          </div>
        </div>

        {/* Stato */}
        <div className="mb-5">
          <h3 className="text-[16px] text-[#789fd6] mb-3">{t("state")}</h3>
          {[
            { key: "scaduta",       label: t("expired"),          color: "bg-red-500"    },  // rosso
            { key: "scadutaDaPoco", label: t("recently_expired"), color: "bg-orange-500" },  // arancione
            { key: "inScadenza",    label: t("expiring"),          color: "bg-yellow-500" },  // giallo
            { key: "attiva",        label: t("active"),            color: "bg-green-500"  },  // verde
            { key: "inPausa",       label: t("paused"),            color: "bg-gray-500"   },
            { key: "programmata",   label: t("scheduled"),         color: "bg-blue-500"   },
          ].map((item) => (
            <label key={item.key} className="flex items-center gap-2 mb-4 cursor-pointer">
              <span className={`w-5 h-5 ${item.color} rounded-sm`}></span>
              &nbsp;{item.label}

              <input
                type="checkbox"
                checked={filters.stato[item.key]}
                onChange={() => toggleFilter("stato", item.key)}
                className="mr-2 cursor-pointer w-[20px] h-[20px] appearance-none border-2 border-[#ffffff20] bg-transparent rounded-sm transition-all duration-200 
                checked:bg-[#789fd6] checked:border-[#789fd6] hover:opacity-80 focus:outline-none ml-auto"
              />
            </label>
          ))}
        </div>

        {/* Ricorrenza */}
        <div className="mb-5">
          <h3 className="text-[16px] text-[#789fd6] mb-2">{t("frequency")}</h3>
          {Object.keys(filters.ricorrenza).map((key) => (
            <label key={key} className="flex items-center gap-2 mb-4 cursor-pointer">
              {t(`recurrence.${key}`)}

              <input
                type="checkbox"
                checked={filters.ricorrenza[key]}
                onChange={() => toggleFilter("ricorrenza", key)}
                className="mr-2 cursor-pointer w-[20px] h-[20px] appearance-none border-2 border-[#ffffff20] bg-transparent rounded-sm transition-all duration-200 
                checked:bg-[#789fd6] checked:border-[#789fd6] hover:opacity-80 focus:outline-none ml-auto"
              />
            </label>
          ))}
        </div>

        <div className="mb-5">
          <h3 className="text-[16px] text-[#789fd6] mb-2">Range ore di moto</h3>
          <p className="text-white/50 text-xs mb-3">
          </p>

          <div className="flex gap-2">
            <div className="flex flex-col flex-1 w-20">
              <label className="text-xs text-white/60 mb-1">Da</label>
              <input
                type="number"
                min="0"
                value={filters.ricorrenza_giorni.from}
                onChange={(e) =>
                  setFilters(prev => ({     
                    ...prev,
                    ricorrenza_giorni: { ...prev.ricorrenza_giorni, from: e.target.value },
                  }))
                }
                placeholder="es. 100"
                className="w-full bg-[#011d38] border border-[#ffffff20] rounded-md px-3 py-2 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#789fd6]"
              />
              {/* Mostra conversione in giorni */}
              {filters.ricorrenza_giorni.from && (
                <span className="text-white/30 text-xs mt-1">
                  ≈ {Math.round(Number(filters.ricorrenza_giorni.from) / 24)} giorni
                </span>
              )}
            </div>

            <div className="flex flex-col flex-1 w-20">
              <label className="text-xs text-white/60 mb-1">A</label>
              <input
                type="number"
                min="0"
                value={filters.ricorrenza_giorni.to}
                onChange={(e) =>
                    setFilters(prev => ({       
                      ...prev,
                      ricorrenza_giorni: { ...prev.ricorrenza_giorni, to: e.target.value },
                    }))
                  }
                placeholder="es. 500"
                className="w-full bg-[#011d38] border border-[#ffffff20] rounded-md px-3 py-2 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#789fd6]"
              />
              {filters.ricorrenza_giorni.to && (
                <span className="text-white/30 text-xs mt-1">
                  ≈ {Math.round(Number(filters.ricorrenza_giorni.to) / 24)} giorni
                </span>
              )}
            </div>
          </div>

        </div>

        {/* Livello */}
        <div className="mb-5">
          <h3 className="text-[16px] text-[#789fd6] mb-2">{t("level")}</h3>
          {Object.keys(filters.livello).map((key) => (
            <label key={key} className="flex items-center gap-2 mb-4 cursor-pointer">
              
              {key === "aBordo" && (
                <Image src="/icons/shape.png" alt="A Bordo" width={18} height={18} />
              )}
              {key === "inBanchina" && (
                <Image src="/icons/Shape-10.png" alt="In Banchina" width={18} height={18} />
              )}
              {key === "inBacino" && (
                <Image src="/icons/Shape-11.png" alt="In Bacino" width={18} height={18} />
              )}
              {key === "fornitoreEsterno" && (
                <Image src="/icons/Shape-12.png" alt="Fornitore Esterno" width={18} height={18} />
              )}

              {key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}

              <input
                type="checkbox"
                checked={filters.livello[key]}
                onChange={() => toggleFilter("livello", key)}
                className="mr-2 cursor-pointer w-[20px] h-[20px] appearance-none border-2 border-[#ffffff20] bg-transparent rounded-sm transition-all duration-200 
                checked:bg-[#789fd6] checked:border-[#789fd6] hover:opacity-80 focus:outline-none ml-auto"
              />
            </label>
          ))}
        </div>

        {/* Squadra */}
        <div className="mb-5">
          <h3 className="text-[16px] text-[#789fd6] mb-2">{t("assignment_team")}</h3>

          {Object.keys(filters.squadra).map((key) => (
            <label key={key} className="flex items-center gap-2 mb-4 cursor-pointer">
              
              {/* 🚀 Traduzione dinamica */}
              {t(`teams.${key}`)}

              <input
                type="checkbox"
                checked={filters.squadra[key]}
                onChange={() => toggleFilter("squadra", key)}
                className="mr-2 cursor-pointer w-[20px] h-[20px] appearance-none border-2 border-[#ffffff20] bg-transparent rounded-sm transition-all duration-200 
                checked:bg-[#789fd6] checked:border-[#789fd6] hover:opacity-80 focus:outline-none ml-auto"
              />
            </label>
          ))}
        </div>


        

        <div>
          <h3 className="text-[16px] text-[#789fd6] mb-2">{t("spare_parts")}</h3>

          {Object.keys(filters.ricambi).map((key) => (
            <label key={key} className="flex items-center gap-2 mb-4 cursor-pointer">

              {/* ICONS */}
              {key === "richiesti" && (
                <Image src="/icons/Shape-9.png" alt="" width={18} height={18} />
              )}
              {key === "richiestiDisponibili" && (
                <Image src="/icons/Shape-7.png" alt="" width={18} height={18} />
              )}
              {key === "richiestiNonDisponibili" && (
                <Image src="/icons/Shape-8.png" alt="" width={18} height={18} />
              )}
              {key === "richiestiInEsaurimento" && (
                <Image src="/icons/Shape-6.png" alt="" width={18} height={18} />
              )}

              {/* Traduzione dinamica */}
              {t(`spares.${key}`)}

              <input
                type="checkbox"
                checked={filters.ricambi[key]}
                onChange={() => toggleFilter("ricambi", key)}
                className="mr-2 cursor-pointer w-[20px] h-[20px] appearance-none border-2 border-[#ffffff20] bg-transparent rounded-sm transition-all duration-200 
                checked:bg-[#789fd6] checked:border-[#789fd6] hover:opacity-80 focus:outline-none ml-auto"
              />
            </label>
          ))}
        </div>


        <button
          className="w-full bg-[#789fd6] p-3 mt-8 text-white font-semibold cursor-pointer rounded-md"
          onClick={onClose}
        >
          {t("confirm")}
        </button>
      </div>

      <FacilitiesModal 
          isOpen={facilitiesOpen}
          onClose2={() => setFacilitiesOpen(false)}
          eswbs={filters.system.selectedElement ? String(filters.system.selectedElement) : null}  // ← aggiunto
          onSelectSystem={(element) => {
            setSelectedSystemName(element ? element.name : null);
            setFilters(prev => ({
              ...prev,
              system: { selectedElement: element ? Number(element.eswbs_code) : null }
            }));
            setFacilitiesOpen(false);
          }}
      />

      </div>
    ) : null;
  }
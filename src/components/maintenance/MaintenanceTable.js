"use client"

import { useState, useEffect } from "react";
import MaintenanceRow from "./MaintenanceRow";
import { fetchMaintenanceJobs } from "@/api/maintenance";
import SelectModal from "./SelectModal";
import LegendModal from "./LegendModal";
import FilterModal from "./FilterModal";
import { useTranslation } from "@/app/i18n";
import { useUser } from "@/context/UserContext";
import { computeExpiryDate } from "@/utils/maintenanceDates";

const MaintenanceTable = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [legendOpen, setLegendOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [maintenancedata, setMaintenanceData] = useState([]);

  const [filters, setFilters] = useState(null);

  const { user } = useUser();
  const shipId = user?.teamInfo?.assignedShip?.id;

  const handleSelectType = (type) => {
    setSelectedType(type);
    setIsOpen(false);
  };

  useEffect(() => {
        fetchMaintenanceJobs(selectedType?.id, shipId, user?.id).then((data) => {
          setMaintenanceData(data || []);
        });
    }, [selectedType, shipId, user]);

    const applyFilters = (data) => {
      if (!Array.isArray(data)) return [];
      if (!filters) return data;

      return data.filter(item => {

        const dueDate = new Date(item.ending_date);
        const startDate = new Date(item.starting_date);
        const today = new Date();
        const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

        // ---- FILTRI STATO ----
        if (filters.stato) {
          const {
            scaduta,
            scadutaDaPoco,
            inScadenza,
            attiva,
            programmata,
            inPausa
          } = filters.stato;

          const matchScaduta = diffDays < -15;
          const matchScadutaDaPoco = diffDays >= -15 && diffDays < 0;
          const matchInScadenza = diffDays >= 0 && diffDays <= 15;
          const matchAttiva = diffDays > 15; // 👈 CORRETTO
          const matchProgrammata = startDate > today;
          const matchInPausa = item.status_id === 2 || item.execution_state === 2;

          // Controllo se almeno un filtro STATO è attivo
          const statoFiltersActive = Object.values(filters.stato).some(Boolean);

          if (statoFiltersActive) {
            const matched = [
              scaduta && matchScaduta,
              scadutaDaPoco && matchScadutaDaPoco,
              inScadenza && matchInScadenza,
              attiva && matchAttiva,
              programmata && matchProgrammata,
              inPausa && matchInPausa
            ].some(Boolean);

            if (!matched) return false;
          }
        }

    // ---- FILTRO RICORRENZA ----
    if (filters.ricorrenza) {
      const recurrenceMap = {
        settimanale: [2],
        bisettimanale: [7],
        mensile: [3],
        bimestrale: [8],
        trimestrale: [4],
        semestrale: [30, 40], // Semiannual e 6 mesi
        annuale: [5],
        biennale: [9],
        triennale: [10],
      };

      const selectedFilters = Object.entries(filters.ricorrenza)
        .filter(([_, active]) => active)
        .flatMap(([key]) => recurrenceMap[key] || []);

      // recupera il valore REALE dal dato
      const recurrency = item.maintenance_list?.recurrency_type?.id;

      // Se filtri attivi → deve matchare
      if (selectedFilters.length > 0 && !selectedFilters.includes(recurrency)) {
          return false;
        }
      }

        // ---- FILTRO LIVELLO ----
        if (filters.livello) {
          const levelMap = {
            aBordo: ["I"], 
            inBanchina: ["II"],
            inBacino: ["IV - BACINO"],
            fornitoreEsterno: ["III"],
          };

          const selectedLevels = Object.entries(filters.livello)
            .filter(([_, active]) => active)
            .flatMap(([key]) => levelMap[key] || []);

          if (selectedLevels.length > 0) {
            const levelValue = item.maintenance_list?.maintenance_level?.Level_MMI;
            if (!selectedLevels.includes(levelValue)) {
              return false;
            }
          }
        }

        // ---- FILTRO PER IMPIANTO / ELEMENT ----
    if (filters.system?.selectedElement) {
      const selectedId = Number(filters.system.selectedElement);

      const matchesByElement = item.Element?.id === selectedId;

      const matchesBySpare =
        item.spares?.some(sp => sp.element_model_id === selectedId);

      if (!matchesByElement && !matchesBySpare) {
        return false;
      }
    }

    // ---- FILTRO RICAMBI ----
    if (filters.ricambi) {
      const {
        richiesti,
        richiestiDisponibili,
        richiestiNonDisponibili,
        richiestiInEsaurimento,
      } = filters.ricambi;

      const hasSpares = Array.isArray(item.spares) && item.spares.length > 0;

      if (richiesti) {
        if (!hasSpares) return false;
      }

      /*
      if (richiestiDisponibili) {
        if (!hasSpares) return false;
      }

      if (richiestiNonDisponibili) {
        if (!hasSpares) return false;
      }

      if (richiestiInEsaurimento) {
        if (!hasSpares) return false;
      }*/
    }

     return true;
      });
};

    const countActiveFilters = () => {
      if (!filters) return 0;

      let count = 0;

      for (const categoryKey in filters) {
        const category = filters[categoryKey];
        if (typeof category === "object" && category !== null) {
          count += Object.values(category).filter(Boolean).length;
        }
      }

      return count;
    };

    const activeFilterCount = countActiveFilters();

  const { t, i18n } = useTranslation("maintenance");
  const [mounted, setMounted] = useState(false);
    
  useEffect(() => {
    setMounted(true);
  }, []);
    
  if (!mounted || !i18n.isInitialized) return null;

  return (
    <div className="w-full mx-auto rounded-lg shadow-md">
      
      <div className="items-center flex mb-2">
        <button
          className="text-white text-2xl font-semibold flex items-center gap-2 py-2 cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
         {selectedType
            ? `${selectedType.title} (${selectedType.tasks})`
            : `${t("all")} (${maintenancedata.length})`
          } &nbsp;

          <svg width="18px" height="18px" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/>
          </svg>
        </button>

        <button 
          className="block sm:hidden rounded-md flex items-center ml-auto bg-[#022a52] text-white font-bold py-2 px-6 transition duration-200 cursor-pointer"
          onClick={() => setLegendOpen(true)}>
          <span >
            <svg fill="#fff" className=" cursor-pointer" width="18px" height="18px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
          </span>
        </button>

        <button
          type="submit"
          onClick={() => setFilterOpen(true)}
          className="rounded-md flex items-center sm:ml-auto ml-2 sm:ml-inherit bg-[#022a52] text-white font-bold py-2 px-6 transition duration-200 cursor-pointer"
        >
          <svg
            width="18px"
            height="18px"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 576 512"
          >
            <path d="M3.9 22.9C10.5 8.9 24.5 0 40 0L472 0c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L396.4 195.6C316.2 212.1 256 283 256 368c0 27.4 6.3 53.4 17.5 76.5c-1.6-.8-3.2-1.8-4.7-2.9l-64-48c-8.1-6-12.8-15.5-12.8-25.6l0-79.1L9 65.3C-.7 53.4-2.8 36.8 3.9 22.9zM432 224a144 144 0 1 1 0 288 144 144 0 1 1 0-288zm59.3 107.3c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0L432 345.4l-36.7-36.7c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6L409.4 368l-36.7 36.7c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0L432 390.6l36.7 36.7c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6L454.6 368l36.7-36.7z"/>
          </svg>
          <span className="hidden sm:inline">&nbsp; {t("filters")}

            {activeFilterCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-black bg-white rounded-full">
                {activeFilterCount}
              </span>
            )}

          </span>
        </button>

      </div>

    <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] text-black/70 bg-white rounded-t-lg font-semibold" style={{ paddingLeft: `8px` }}>
        <p className="border-r border-t border-b border-[#022a52] p-3">Task / ESWBS</p>
        <p className="border border-[#022a52] p-3 text-center">{t("execution")}</p>
        <p className="border border-[#022a52] p-3 text-center">{t("notes")}</p>
        <p className="border border-[#022a52] p-3 text-center flex items-center" style={{justifyContent: "center"}}>
          {t("classification")}
          <span onClick={() => setLegendOpen(true)}>
            <svg fill="#202124" className="ml-2 cursor-pointer" width="18px" height="18px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
          </span>
        </p>
        <p className="border border-[#022a52] p-3 text-center">{t("expiry_date")}</p>
        <p className="border border-[#022a52] p-3 w-8 text-center"></p>
      </div>

      {applyFilters(maintenancedata)
        .sort((a, b) => {
          const expA = computeExpiryDate({
            executionDate: a.execution_date,
            endingDate: a.ending_date,
            startingDate: a.starting_date,
            recurrency: a.maintenance_list?.recurrency_type?.name,
            maintenanceList: a.job?.maintenance_list,
          });

          const expB = computeExpiryDate({
            executionDate: b.execution_date,
            endingDate: b.ending_date,
            startingDate: b.starting_date,
            recurrency: b.maintenance_list?.recurrency_type?.name,
            maintenanceList: b.job?.maintenance_list,
          });

          // fallback se per qualche motivo non c’è expiry
          const dateA = expA ? new Date(expA) : new Date(a.ending_date || a.starting_date);
          const dateB = expB ? new Date(expB) : new Date(b.ending_date || b.starting_date);

          // ASC: prima la più vicina (29/09/2025), poi 01/12, 02/12, 09/12, 2026, ecc.
          return dateA - dateB;
        })
        .filter(
          (item) =>
            (!selectedType || item.recurrency_type_id === selectedType.id) &&
            item.maintenance_list?.name
        )
        .map((item) => (
          <MaintenanceRow key={item.id} data={item} />
      ))}


      <SelectModal isOpen={isOpen} onClose={() => setIsOpen(false)} onSelect={handleSelectType} shipId={shipId} userId={user?.id} />

      <LegendModal isOpen={legendOpen} onClose={() => setLegendOpen(false)} />

      <FilterModal isOpen={filterOpen} onClose={() => setFilterOpen(false)} onFiltersChange={(newFilters) => setFilters(newFilters)} />
        
    </div>
  );
};

export default MaintenanceTable;

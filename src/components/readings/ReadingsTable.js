import { useState, useEffect } from "react";
import ReadingsRow from "./ReadingsRow";
import SelectModal from "./SelectModal";
import LegendModal from "./LegendModal";
import FilterModal from "./FilterModal";
import { getReadings } from "@/api/readings";
import { useUser } from "@/context/UserContext";
import { useTranslation } from "@/app/i18n";

const ReadingsTable = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [legendOpen, setLegendOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [tasksData, setTasksData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
      task: {
        nascondiTaskEseguiti: false,
      },
      squadraDiAssegnazione: {
        operatori: false,
        equipaggio: false,
        manutentori: false,
        comando: false,
      },
      macrogruppoESWBS: {
        "100 - Scafo": false,
        "200 - Propulsioni/Motori": false,
        "300 - Impianto elettrico": false,
        "400 - Comando, controllo e sorveglianza": false,
        "500 - Impianti ausiliari": false,
        "600 - Allestimento e arredamento": false,
        "700 - Armamenti": false,
        "800 - Integration / Engineering": false,
        "900 - Ship assembly / Support services": false,
      },
      tags: {}
  });

  const [soloOreDiMoto, setSoloOreDiMoto] = useState(false);

  const toggleFilter = (category, key) => {
      setFilters((prev) => ({
        ...prev,
        [category]: {
          ...prev[category],
          [key]: !prev[category][key],
        },
      }));
  };

  const { user, selectedShipId: shipId } = useUser();

  const loadTasks = async () => {
    try {
      setLoading(true);
      const fetchReadings = await getReadings(shipId, user?.id);
      setTasksData(fetchReadings);

      const uniqueTags = {};
      fetchReadings.forEach(task => {
        if (task.tags) {
          task.tags.split(',').map(t => t.trim()).forEach(tag => {
            if (tag) uniqueTags[tag] = false;
          });
        }
      });
      setFilters(prev => ({ ...prev, tags: uniqueTags }));

    } catch (err) {
      setError("Errore nel recupero dei task");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [shipId, user]);

  const handleSelectType = (type) => {
    setSelectedType(type);
    setIsOpen(false);
  };

  const { t, i18n } = useTranslation("maintenance");
  const [mounted, setMounted] = useState(false);
        
      useEffect(() => {
        setMounted(true);
      }, []);
        
      if (!mounted || !i18n.isInitialized) return null;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  
  const tasksToShow = tasksData.filter((task) => {
    if (soloOreDiMoto) {
      const tags = task.tags?.split(',').map(t => t.trim().toLowerCase()) || [];
      if (!tags.includes('ore di moto')) return false;
    }

    if (selectedType && task.type?.id !== selectedType.id) {
      return false;
    }

    if (filters.task.nascondiTaskEseguiti) {
      if (task.value && task.value !== "") return false;
    }

    const squadFilters = filters.squadraDiAssegnazione;
    if (Object.values(squadFilters).some(Boolean)) {
      const teamMap = {
        operatori: "Operatori",
        equipaggio: "Equipaggio",
        manutentori: "Manutentori",
        comando: "Comando",
      };
      const teamMatch = Object.entries(squadFilters)
        .filter(([, active]) => active)
        .some(([key]) => task.team?.toLowerCase().includes(teamMap[key].toLowerCase()));
      if (!teamMatch) return false;
    }

    const macroFilters = filters.macrogruppoESWBS;
    if (Object.values(macroFilters).some(Boolean)) {
      const eswbsCode = task?.element?.element_model?.ESWBS_code?.trim();
      
      // Usa eswbs_id come fallback se element non c'è
      const codeToCheck = eswbsCode || task?.eswbs_id?.trim();
      
      if (!codeToCheck) return false;

      const matches = Object.entries(macroFilters).some(([macroKey, isActive]) => {
        if (!isActive) return false;
        // Prendi le prime 3 cifre del macrogruppo (es. "200" da "200 - Propulsioni/Motori")
        const prefix = macroKey.split(" - ")[0].trim(); // "200"
        const firstDigit = prefix[0]; // "2"
        return codeToCheck.startsWith(firstDigit);
      });

      if (!matches) return false;
    }

    const tagFilters = filters.tags;
    if (Object.values(tagFilters).some(Boolean)) {
      const activeTags = Object.entries(tagFilters)
        .filter(([, active]) => active)
        .map(([tag]) => tag.toLowerCase());

      const taskTags = task.tags?.split(',').map(t => t.trim().toLowerCase()) || [];
      const hasMatch = activeTags.some(activeTag => taskTags.includes(activeTag));
      if (!hasMatch) return false;
    }

    return true;
  });

  const countActiveFilters = () => {
    let count = 0;
    count += Object.values(filters.squadraDiAssegnazione).filter(Boolean).length;
    count += Object.values(filters.macrogruppoESWBS).filter(Boolean).length;
    count += Object.values(filters.tags).filter(Boolean).length; // ← aggiunto
    if (filters.task.nascondiTaskEseguiti) count += 1;
    return count;
  };

  const activeFiltersCount = countActiveFilters();

  return (
    <div className="w-full mx-auto rounded-lg shadow-md">
      <div className="items-center flex mb-2 gap-2">
  <button
    className="text-white text-lg sm:text-2xl font-semibold flex items-center gap-2 py-2 cursor-pointer shrink-0"
    onClick={() => setIsOpen(true)}
  >
    {selectedType ? `${selectedType.name}` : `${t("view_all")} (${tasksToShow.length})`}
    <svg width="14px" height="14px" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/>
    </svg>
  </button>

  <div className="ml-auto flex items-center gap-2 shrink-0">
    <button
      onClick={() => setSoloOreDiMoto(prev => !prev)}
      className={`rounded-md flex items-center font-bold py-2 px-3 transition duration-200 cursor-pointer text-xs sm:text-sm ${
        soloOreDiMoto ? 'bg-[#789fd6] text-white' : 'bg-[#022a52] text-white'
      }`}
    >
      <svg width="14px" height="14px" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="mr-1 shrink-0">
        <path d="M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zM232 120l0 136c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.5 33.3-6.5s4.5-25.9-6.5-33.3L280 243.2 280 120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"/>
      </svg>
      <span className="hidden sm:inline">Ore di moto</span>
      <span className="sm:hidden">Ore</span>
      {soloOreDiMoto && (
        <span className="ml-1 bg-white text-[#789fd6] rounded-full px-1 py-0.5 text-xs font-bold">✓</span>
      )}
    </button>

    <button
      onClick={() => setFilterOpen(true)}
      className="rounded-md flex items-center bg-[#022a52] text-white font-bold py-2 px-3 sm:px-6 transition duration-200 cursor-pointer"
    >
      <svg width="16px" height="16px" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
        <path d="M3.9 22.9C10.5 8.9 24.5 0 40 0L472 0c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L396.4 195.6C316.2 212.1 256 283 256 368c0 27.4 6.3 53.4 17.5 76.5c-1.6-.8-3.2-1.8-4.7-2.9l-64-48c-8.1-6-12.8-15.5-12.8-25.6l0-79.1L9 65.3C-.7 53.4-2.8 36.8 3.9 22.9zM432 224a144 144 0 1 1 0 288 144 144 0 1 1 0-288zm59.3 107.3c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0L432 345.4l-36.7-36.7c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6L409.4 368l-36.7 36.7c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0L432 390.6l36.7 36.7c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6L454.6 368l36.7-36.7z"/>
      </svg>
      <span className="hidden sm:inline">&nbsp;{t("filters")}</span>
      {activeFiltersCount > 0 && (
        <span className="ml-1 bg-white text-black rounded-full px-2 py-0.5 text-xs">
          {activeFiltersCount}
        </span>
      )}
    </button>
  </div>
</div>

      <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr] text-black/70 bg-white rounded-t-lg font-semibold">
        <p className="border border-[#022a52] p-3">Task / ESWBS</p>
        <p className="border border-[#022a52] p-3 text-center">{t("anniversary")}</p>
        <p className="border border-[#022a52] p-3 text-center">{t("notes")}</p>
        <p className="border border-[#022a52] p-3 text-center">{t("value")}</p>
      </div>

      {tasksToShow.map((task, index) => {
        return <ReadingsRow key={`${task.id}-${index}`} data={task} />;
      })}

      <SelectModal isOpen={isOpen} onClose={() => setIsOpen(false)} onSelect={handleSelectType} datas={tasksData} />

      <FilterModal
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        toggleFilter={toggleFilter}
        availableTags={Object.keys(filters.tags)}
      />
        
    </div>
  );
};

export default ReadingsTable;
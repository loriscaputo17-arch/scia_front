import { useState, useEffect } from "react";
import CheckListRow from "./CheckListRow";
import SelectModal from "./SelectModal";
import LegendModal from "./LegendModal";
import FilterModal from "./FilterModal";
import { fetchTasks } from "@/api/checklist";
import { useUser } from "@/context/UserContext";
import { useTranslation } from "@/app/i18n";

const ChecklistTable = () => {
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
  });

  const toggleFilter = (category, key) => {
    setFilters((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !prev[category][key],
      },
    }));
  };

  const { user } = useUser();
  const shipId = user?.teamInfo?.assignedShip?.id;

  const loadTasks = async () => {
    if (!shipId || !user?.id) return;

    try {
      setLoading(true);
      const fetchedTasks = await fetchTasks(shipId, user.id);
      setTasksData(fetchedTasks);
      setError(null);
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

  // i18n non pronto
  if (!mounted || !i18n.isInitialized) return null;

  // loading / error
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  const allTasks = selectedType ? selectedType.tasks : tasksData;

  // ======================================================
  // PRE-CALCOLO PER FILTRI (per non rifare tutto ad ogni task)
  // ======================================================
  const { task: taskFilters, squadraDiAssegnazione, macrogruppoESWBS } = filters;

  const macroKeys = Object.entries(macrogruppoESWBS).filter(
    ([, active]) => active
  );
  const hasMacroFilters = macroKeys.length > 0;

  const teamKeys = Object.entries(squadraDiAssegnazione).filter(
    ([, active]) => active
  );
  const hasTeamFilters = teamKeys.length > 0;

  // ======================================================
  // FILTRAGGIO TASK
  // ======================================================
  const tasksToShow = allTasks.filter((task) => {
    // Nascondi task eseguiti
    if (taskFilters.nascondiTaskEseguiti && task.execution_state !== null) {
      return false;
    }

    // Macrogruppi ESWBS
    const eswbsCode = task?.Element?.element_model?.ESWBS_code?.trim();
    if (hasMacroFilters) {
      const taskDigit = eswbsCode?.[0];

      const matchesMacro = macroKeys.some(([key]) => {
        const macroDigit = key.trim()[0]; // "100 - Scafo" -> "1"
        return taskDigit === macroDigit;
      });

      if (!matchesMacro) return false;
    }

    // Squadra di assegnazione
    const assignedTeam = task?.assigned_to?.team;
    if (hasTeamFilters) {
      // se non c'è team o non è tra quelli selezionati → escludi
      if (!assignedTeam || squadraDiAssegnazione[assignedTeam] !== true) {
        return false;
      }
    }

    return true;
  });

  // Ordina mettendo in fondo quelli con execution_state !== null
  const orderedTasks = [...tasksToShow].sort((a, b) => {
    const aDone = a.execution_state !== null;
    const bDone = b.execution_state !== null;

    if (aDone === bDone) return 0;
    return aDone ? 1 : -1;
  });

  // ======================================================
  // COUNTER FILTRI ATTIVI
  // ======================================================
  const numMacrogruppiAttivi = macroKeys.length;
  const numSquadreAttive = teamKeys.length;
  const numFiltriBase = taskFilters.nascondiTaskEseguiti ? 1 : 0;

  const numFiltriAttivi =
    numFiltriBase +
    (numMacrogruppiAttivi > 0 ? 1 : 0) +
    (numSquadreAttive > 0 ? 1 : 0);

  // ======================================================
  // RENDER
  // ======================================================
  return (
    <div className="w-full mx-auto rounded-lg shadow-md">
      <div className="items-center flex mb-2">
        <button
          className="text-white text-2xl font-semibold flex items-center gap-2 py-2 cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          {selectedType
            ? `${selectedType.title} (${selectedType.tasks?.length})`
            : t("view_all")}
          <svg
            width="18px"
            height="18px"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
          </svg>
        </button>

        <button
          type="submit"
          onClick={() => setFilterOpen(true)}
          className={
            "rounded-md flex items-center ml-auto bg-[#022a52] text-white font-bold py-2 px-6 transition duration-200 cursor-pointer"
          }
        >
          <svg
            width="18px"
            height="18px"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 576 512"
          >
            <path d="M3.9 22.9C10.5 8.9 24.5 0 40 0L472 0c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L396.4 195.6C316.2 212.1 256 283 256 368c0 27.4 6.3 53.4 17.5 76.5c-1.6-.8-3.2-1.8-4.7-2.9l-64-48c-8.1-6-12.8-15.5-12.8-25.6l0-79.1L9 65.3C-.7 53.4-2.8 36.8 3.9 22.9zM432 224a144 144 0 1 1 0 288 144 144 0 1 1 0-288zm59.3 107.3c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0L432 345.4l-36.7-36.7c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6L409.4 368l-36.7 36.7c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0L432 390.6l36.7 36.7c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6L454.6 368l36.7-36.7z" />
          </svg>
          &nbsp; {t("filters")}{" "}
          {numFiltriAttivi > 0 && (
            <span className="ml-2 bg-white text-black rounded-full px-2 py-0.5 text-xs">
              {numFiltriAttivi}
            </span>
          )}
        </button>
      </div>

      <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] text-black/70 bg-white rounded-t-lg font-semibold">
        <p className="border border-[#022a52] p-3">Task / ESWBS</p>
        <p className="border border-[#022a52] p-3 text-center">
          {t("anniversary")}
        </p>
        <p className="border border-[#022a52] p-3 text-center">
          {t("notes")}
        </p>
        <p
          className="border border-[#022a52] p-3 text-center flex items-center"
          style={{ justifyContent: "center" }}
        >
          {t("anomaly")}
        </p>
        <p className="border border-[#022a52] p-3 text-center">
          {t("ok")}
        </p>
      </div>

      {orderedTasks.map((task) => (
        <CheckListRow key={task?.id} data={task} />
      ))}

      <SelectModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSelect={handleSelectType}
        types={tasksData}
      />

      <LegendModal
        isOpen={legendOpen}
        onClose={() => setLegendOpen(false)}
      />

      <FilterModal
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        toggleFilter={toggleFilter}
      />
    </div>
  );
};

export default ChecklistTable;


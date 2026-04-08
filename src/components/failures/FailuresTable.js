"use client";

import { useState, useEffect } from "react";
import FailuresRow from "./FailuresRow";
import FilterModal from "./FilterModal";
import FailuresModal from "./FailuresModal";
import { getFailures } from "@/api/failures";
import { useTranslation } from "@/app/i18n";
import { useUser } from "@/context/UserContext";

const FailuresTable = () => {
  const [failures, setFailures] = useState([]);
  const [filteredFailures, setFilteredFailures] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [addFailureOpen, setAddFailureOpen] = useState(false);
  const [filters, setFilters] = useState({
    gravitá: {
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

  const { user, selectedShipId: shipId } = useUser();

  const [loading, setLoading] = useState(true);

  const { t, i18n } = useTranslation("failures");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    async function fetchFailures() {
      try {
        const data = await getFailures("", shipId, user.id);
        
        setFailures(data);
        setFilteredFailures(data);
        
      } catch (error) {
        console.error("Errore fetch avarie:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchFailures();
  }, [user]);

  useEffect(() => {
    if (!filters) return;

    const applyFilters = () => {
      const activeGravities = Object.entries(filters.gravitá)
        .filter(([_, isActive]) => isActive)
        .map(([gravity]) => gravity);

      const activeTeams = Object.entries(filters.squadra)
        .filter(([_, isActive]) => isActive)
        .map(([team]) => team);

        const result = failures.filter((failure) => {
        const failureTeam = failure.executionUserType;

        const matchGravity =
          activeGravities.length === 0 || activeGravities.includes(failure.gravity);
        const matchTeam = activeTeams.length === 0 || activeTeams.includes(failureTeam);

        return matchGravity && matchTeam;
      });

      setFilteredFailures(result);
    };

    applyFilters();
  }, [filters, failures]);

  if (!mounted || !i18n.isInitialized) {
    return <div className="text-white p-4">{t("loading")}</div>;
  }

  const numFiltriAttivi = [
  ...Object.values(filters.gravitá),
  ...Object.values(filters.squadra),
].filter(Boolean).length;

  return (
    <div className="w-full mx-auto rounded-lg shadow-md">
      <div className="sm:flex items-center mb-2">
        <button
          className="text-white text-2xl font-semibold flex items-center gap-2 py-2 cursor-pointer"
          onClick={() => setFilterOpen(true)}
        >
          {t("failures")} ({filteredFailures.length})
        </button>

        <div className="flex items-center ml-auto gap-4">
          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className="rounded-md flex items-center bg-[#022a52] text-white font-bold py-2 px-6 transition duration-200 cursor-pointer"
          >
            <div className="w-4 h-4 rounded-full relative">
              <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-red-600 rounded-tl-full"></div>
              <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-orange-500 rounded-tr-full"></div>
              <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-green-500 rounded-bl-full"></div>
              <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-yellow-400 rounded-br-full"></div>
            </div>
            <span className="hidden sm:block">&nbsp;&nbsp; {t("severity")}</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className="rounded-md flex items-center bg-[#022a52] text-white font-bold py-2 px-6 transition duration-200 cursor-pointer"
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
            <span className="hidden sm:block">&nbsp; {t("filters")}

              {numFiltriAttivi > 0 && (
                <span className="ml-2 bg-white text-black rounded-full px-2 py-0.5 text-xs">
                  {numFiltriAttivi}
                </span>
              )}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setAddFailureOpen(true)}
            className="rounded-md flex items-center bg-[#789fd6] text-white font-bold py-2 px-6 transition duration-200 cursor-pointer"
          >
            <svg
              width="18px"
              height="18px"
              fill="white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
            </svg>
            <span className="hidden sm:block">&nbsp; {t("add_failure")}</span>
          </button>
        </div>
      </div>

      <div className="hidden sm:grid grid-cols-[3fr_1fr_1fr_1fr] bg-white rounded-t-lg font-semibold text-black/70">
        <p className="border p-3">{t("titolo")} / ESWBS</p>
        <p className="border p-3 text-center">{t("notes")}</p>
        <p className="border p-3 text-center">{t("user")}</p>
        <p className="border p-3 text-center">{t("date_of_insertion")}</p>
      </div>

      {loading ? (
        <div className="text-white p-4">{t("loading")}</div>
      ) : filteredFailures.length === 0 ? (
        <div className="text-white p-4">{t("no_results")}</div>
      ) : (
        filteredFailures.map((item) => <FailuresRow key={item.id} data={item} />)
      )}

      <FailuresModal isOpen={addFailureOpen} onClose={() => setAddFailureOpen(false)} />
      <FilterModal
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={setFilters}
        currentFilters={filters}
      />
    </div>
  );
};

export default FailuresTable;

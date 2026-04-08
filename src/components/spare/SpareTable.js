"use client"
import { useState, useEffect, useRef } from "react";
import SpareRow from "./SpareRow";
import FilterModal from "./FilterModal";
import { fetchSpares } from "@/api/spare";
import { useUser } from "@/context/UserContext";
import MoveProduct from "./MoveProduct";
import FacilitiesModal from "./FacilitiesModal";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/app/i18n";

const SpareTable = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [sparesData, setSparesData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [facilitiesOpen, setFacilitiesOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [selectedCode, setSelectedCode] = useState(null);
  const loaderRef = useRef(null);
  const resetRef = useRef(0);
  const router = useRouter();

  const { user, selectedShipId: shipId } = useUser();

  const [filters, setFilters] = useState({
    task: { inGiacenza: false, nonDisponibile: false },
    fornitore: { myCompany1: false, myCompany2: false, myCompany3: false, myCompany4: false },
    magazzino: { onboard: false, dockside: false, drydock: false, external: false },
  });

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setSparesData([]);
    setPage(1);
    setHasMore(true);
    resetRef.current += 1;
  }, [shipId, user, filters, debouncedSearch, selectedCode]);

  useEffect(() => {
    if (!hasMore || !shipId) return;
    const currentReset = resetRef.current;
    setIsLoading(true);
    fetchSpares(shipId, page, 10, filters, debouncedSearch, selectedCode).then((data) => {
      if (resetRef.current !== currentReset) return;
      setSparesData((prev) => {
        const existingIds = new Set(prev.map((item) => item.ID));
        const newItems = (data?.spares || []).filter((item) => !existingIds.has(item.ID));
        return [...prev, ...newItems];
      });
      setHasMore(data?.hasMore ?? false);
      setIsLoading(false);
    });
  }, [page, shipId, user, filters, debouncedSearch, selectedCode]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, isLoading]);

  const toggleFilter = (category, key) => {
    setFilters((prev) => ({
      ...prev,
      [category]: { ...prev[category], [key]: !prev[category][key] },
    }));
  };

  const { t, i18n } = useTranslation("maintenance");
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted || !i18n.isInitialized) return null;

  const numFiltriAttivi = [
    ...Object.values(filters.task),
    ...Object.values(filters.fornitore),
    ...Object.values(filters.magazzino),
  ].filter(Boolean).length;

  return (
    <div className="w-full mx-auto rounded-lg shadow-md">
      <div className="items-center sm:flex mb-2">
        <h2 className="text-white text-2xl font-semibold flex items-center gap-2 py-2">
          {t("spare_parts_catalogue")} ({sparesData.length})
        </h2>

        <div className="flex items-center ml-auto gap-4 sm:my-0 my-4">
          <button
            onClick={() => setIsOpen2(true)}
            className="rounded-md flex items-center bg-[#022a52] text-white font-bold py-2 px-6 transition duration-200 cursor-pointer"
          >
            <svg width="18px" height="18px" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/>
            </svg>
            <span className="hidden sm:block">&nbsp; {t("move")}/{t("add")}</span>
          </button>

          <button
            onClick={() => router.push(`/dashboard/locations`)}
            className="rounded-md flex items-center bg-[#022a52] text-white font-bold py-2 px-6 transition duration-200 cursor-pointer"
          >
            <svg width="18px" height="18px" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M64 32C64 14.3 49.7 0 32 0S0 14.3 0 32L0 64 0 368 0 480c0 17.7 14.3 32 32 32s32-14.3 32-32l0-128 64.3-16.1c41.1-10.3 84.6-5.5 122.5 13.4c44.2 22.1 95.5 24.8 141.7 7.4l34.7-13c12.5-4.7 20.8-16.6 20.8-30l0-247.7c0-23-24.2-38-44.8-27.7l-9.6 4.8c-46.3 23.2-100.8 23.2-147.1 0c-35.1-17.6-75.4-22-113.5-12.5L64 48l0-16z"/>
            </svg>
            <span className="hidden sm:block">&nbsp; {t("locations")}</span>
          </button>

          <button
            onClick={() => setFacilitiesOpen(true)}
            className="rounded-md flex items-center bg-[#789fd6] text-white font-bold py-2 px-6 transition duration-200 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="white" width="18" height="18">
              <path fill="white" transform="translate(0.000488281 0.000488281)" d="M1.0588249 16C0.76470727 16 0.51458973 15.893817 0.30847213 15.681453C0.10235452 15.46909 -0.00046898017 15.211635 0 14.909089L0 12.727272C0 12.424241 0.1030604 12.166545 0.30917799 11.954181C0.51529557 11.741817 0.76517785 11.635878 1.0588249 11.636363L1.764707 11.636363L1.764707 10.181818L1.0588249 10.181818C0.76470727 10.181818 0.51458973 10.075636 0.30847213 9.8632727C0.10235452 9.6509085 -0.00046898017 9.3934546 0 9.090909L0 6.909091C0 6.606061 0.1030604 6.3483639 0.30917799 6.1360002C0.51529557 5.9236369 0.76517785 5.8176975 1.0588249 5.8181825L1.764707 5.8181825L1.764707 4.363637L1.0588249 4.363637C0.76470727 4.363637 0.51458973 4.2574553 0.30847213 4.0450916C0.10235452 3.8327281 -0.00046898017 3.5752738 0 3.2727282L0 1.0909106C0 0.7878803 0.1030604 0.53018337 0.30917799 0.31781977C0.51529557 0.10545618 0.76517785 -0.00048319172 1.0588249 0L3.8823535 0C4.1764712 0 4.4265885 0.10618345 4.6327062 0.31854704C4.8388238 0.53091061 4.9416475 0.78836513 4.9411769 1.0909106L4.9411769 3.2727282C4.9411769 3.5757585 4.8381181 3.8334553 4.6320004 4.0458188C4.4258828 4.2581825 4.1760006 4.3641219 3.8823535 4.363637L3.1764712 4.363637L3.1764712 5.8181825L3.8823535 5.8181825C4.1764712 5.8181825 4.4265885 5.9243641 4.6327062 6.1367278C4.8388238 6.3490911 4.9416475 6.6065459 4.9411769 6.909091L4.9411769 7.2727275L7.0588231 7.2727275L7.0588231 6.909091C7.0588231 6.606061 7.1618819 6.3483639 7.3679996 6.1360002C7.5741172 5.9236369 7.8239994 5.8176975 8.1176462 5.8181825L10.941175 5.8181825C11.235292 5.8181825 11.485411 5.9243641 11.691528 6.1367278C11.897646 6.3490911 12.000469 6.6065459 12 6.909091L12 9.090909C12 9.393939 11.896939 9.6516361 11.690822 9.8639994C11.484704 10.076364 11.234822 10.182302 10.941175 10.181818L8.1176462 10.181818C7.8235288 10.181818 7.5734115 10.075636 7.3672938 9.8632727C7.1611762 9.6509085 7.0583525 9.3934546 7.0588231 9.090909L7.0588231 8.727273L4.9411769 8.727273L4.9411769 9.090909C4.9411769 9.393939 4.8381181 9.6516361 4.6320004 9.8639994C4.4258828 10.076364 4.1760006 10.182302 3.8823535 10.181818L3.1764712 10.181818L3.1764712 11.636363L3.8823535 11.636363C4.1764712 11.636363 4.4265885 11.742545 4.6327062 11.954908C4.8388238 12.167272 4.9416475 12.424726 4.9411769 12.727272L4.9411769 14.909089C4.9411769 15.21212 4.8381181 15.469816 4.6320004 15.68218C4.4258828 15.894544 4.1760006 16.000483 3.8823535 16L1.0588249 16Z"/>
            </svg>
            <span className="hidden sm:block">&nbsp; ESWBS</span>
          </button>

          <button
            onClick={() => setFilterOpen(true)}
            className="rounded-md flex items-center bg-[#022a52] text-white font-bold py-2 px-6 transition duration-200 cursor-pointer"
          >
            <svg width="18px" height="18px" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
              <path d="M3.9 22.9C10.5 8.9 24.5 0 40 0L472 0c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L396.4 195.6C316.2 212.1 256 283 256 368c0 27.4 6.3 53.4 17.5 76.5c-1.6-.8-3.2-1.8-4.7-2.9l-64-48c-8.1-6-12.8-15.5-12.8-25.6l0-79.1L9 65.3C-.7 53.4-2.8 36.8 3.9 22.9zM432 224a144 144 0 1 1 0 288 144 144 0 1 1 0-288zm59.3 107.3c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0L432 345.4l-36.7-36.7c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6L409.4 368l-36.7 36.7c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0L432 390.6l36.7 36.7c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6L454.6 368l36.7-36.7z"/>
            </svg>
            <span className="hidden sm:block">&nbsp; {t("filters")}
              {numFiltriAttivi > 0 && (
                <span className="bg-white text-black ml-2 text-xs px-2 py-0.5 rounded-full">{numFiltriAttivi}</span>
              )}
            </span>
          </button>
        </div>
      </div>

      <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] text-black/70 bg-white rounded-t-lg font-semibold">
        <p className="border border-[#022a52] p-3">{t("name")} / ESWBS</p>
        <p className="border border-[#022a52] p-3 text-center">{t("q_installed")}</p>
        <p className="border border-[#022a52] p-3 text-center">{t("stock")}</p>
        <p className="border border-[#022a52] p-3 text-center">{t("locations")}</p>
        <p className="border border-[#022a52] p-3 text-center flex items-center" style={{ justifyContent: "center" }}>Part Number</p>
        <p className="border border-[#022a52] p-3 text-center">{t("actions")}</p>
      </div>

      <div className="flex items-center gap-2 p-4 bg-[#022a52]" style={{ borderBottom: '1px solid black' }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t("search_by_name")}
          className="px-6 py-3 rounded-md w-full bg-[#ffffff10] outline-none"
        />
      </div>

      {sparesData.map((task) => (
        <SpareRow key={task.ID} data={task} />
      ))}

      <div ref={loaderRef} className="py-4 text-center text-white/60 text-sm">
        {isLoading && "Loading..."}
        {!hasMore && sparesData.length > 0 && "Tutti i record caricati"}
      </div>

      <FilterModal isOpen={filterOpen} onClose={() => setFilterOpen(false)} filters={filters} toggleFilter={toggleFilter} />
      <FacilitiesModal
        isOpen={facilitiesOpen}
        onClose2={() => setFacilitiesOpen(false)}
        onSelectCode={(code) => setSelectedCode(code)}
        selectedCode={selectedCode} 
      />
      <MoveProduct isOpen={isOpen2} onClose={() => setIsOpen2(false)} />
    </div>
  );
};

export default SpareTable;
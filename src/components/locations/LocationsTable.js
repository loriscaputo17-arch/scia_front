import { useState, useEffect } from "react";
import LocationRow from "./LocationRow";
import CreateLocationModal from "./LocationModal";
import FilterModal from "./FilterModal";
import { fetchLocations } from "@/api/location";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/app/i18n";

const LocationsTable = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [createLocation, setCreateLocation] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [tasksData, setTasksData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const { user, selectedShipId: shipId } = useUser();
  
  const loadTasks = async () => {
    try {
      setLoading(true);

      const fetchedTasks = await fetchLocations(shipId, user?.id);
      
      setTasksData(fetchedTasks);
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

  const { t, i18n } = useTranslation("maintenance");
  if (!i18n.isInitialized) return null;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  const tasksToShow = selectedType ? selectedType.locations : tasksData;

  return (
    <div className="w-full mx-auto rounded-lg shadow-md">
      <div className="items-center flex mb-2">
        <button
          className="text-white text-2xl font-semibold flex items-center gap-2 py-2 cursor-pointer"
        >
          {t("locations")}
        </button>

      <div className="flex items-center ml-auto gap-4">
        <button
          type="submit"
          onClick={() => router.push(`/dashboard/spare`)}
          className={'rounded-md flex items-center ml-auto bg-[#022a52] text-white font-bold py-2 px-6 transition duration-200 cursor-pointer'}
        >

            <svg width="18px" height="18px" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M96 0C78.3 0 64 14.3 64 32l0 96 64 0 0-96c0-17.7-14.3-32-32-32zM288 0c-17.7 0-32 14.3-32 32l0 96 64 0 0-96c0-17.7-14.3-32-32-32zM32 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l0 32c0 77.4 55 142 128 156.8l0 67.2c0 17.7 14.3 32 32 32s32-14.3 32-32l0-67.2C297 398 352 333.4 352 256l0-32c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 160z"/></svg>
            <span className="hidden sm:block">&nbsp; {t("spare_parts")}</span>
        </button>

        <button
            type="submit"
            onClick={() => setCreateLocation(true)}
            className={'rounded-md flex items-center ml-auto bg-[#789fd6] text-white font-bold py-2 px-6 transition duration-200 cursor-pointer'}
          >
            <svg width="18px" height="18px" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"/></svg>   
            <span className="hidden sm:block">&nbsp; {t("create_location")}</span>
          </button>

        {/*<button
          type="submit"
          onClick={() => setFilterOpen(true)}
          className={'rounded-md flex items-center  bg-[#022a52] text-white font-bold py-2 px-6 transition duration-200 cursor-pointer'}
        >
          <svg width="18px" height="18px" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M3.9 22.9C10.5 8.9 24.5 0 40 0L472 0c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L396.4 195.6C316.2 212.1 256 283 256 368c0 27.4 6.3 53.4 17.5 76.5c-1.6-.8-3.2-1.8-4.7-2.9l-64-48c-8.1-6-12.8-15.5-12.8-25.6l0-79.1L9 65.3C-.7 53.4-2.8 36.8 3.9 22.9zM432 224a144 144 0 1 1 0 288 144 144 0 1 1 0-288zm59.3 107.3c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0L432 345.4l-36.7-36.7c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6L409.4 368l-36.7 36.7c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0L432 390.6l36.7 36.7c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6L454.6 368l36.7-36.7z"/></svg>
            &nbsp; Filtri
        </button>*/}
      </div>
        
      </div>

      <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr] text-black/70 bg-white rounded-t-lg font-semibold">
        <p className="border border-[#022a52] p-3">{t("warehouse")}</p>
        <p className="border border-[#022a52] p-3 text-center">{t("location")}</p>
        <p className="border border-[#022a52] p-3 text-center">{t("spare_parts")}</p>
        <p className="border border-[#022a52] p-3 text-center flex items-center" style={{justifyContent: "center"}}>
          {t("actions")}
        </p>
        </div>

      {tasksToShow.map((task) => (
        <LocationRow key={task.id} data={task} />
      ))}

      <CreateLocationModal isOpen={createLocation} onLoad={() => loadTasks()} onClose={() => setCreateLocation(false)} data={tasksToShow} shipId={shipId} userId={user?.id} />

      {/*<FilterModal isOpen={filterOpen} onClose={() => setFilterOpen(false)} />*/}
        
    </div>
  );
};

export default LocationsTable;
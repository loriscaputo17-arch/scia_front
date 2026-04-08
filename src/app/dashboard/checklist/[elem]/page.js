"use client"

import { useState, useEffect, useRef } from "react";
import DashboardHeader from "@/components/header/DashboardHeader";
import Breadcrumbs from "@/components/dashboard/Breadcrumbs";
import MaintenanceDetails from "@/components/checklist/element/MaintenanceDetails";
import MaintenanceInfo from "@/components/checklist/element/MaintenanceInfo";
import NoteModal from "@/components/checklist/element/NoteModal";
import { useParams } from "next/navigation";
import { useTranslation } from "@/app/i18n";
import { fetchMaintenanceJob } from "@/api/maintenance";
import { useUser } from "@/context/UserContext";

export default function ElementPage({ params }) {
  const [noteModal, setNoteModal] = useState(false);
  const [maintenancedata, setMaintenanceData] = useState([]);

  const params2 = useParams();
  const jobId = params2.elem;
 
  let bgColor = "bg-gray-400";
  let textColor = "text-white"; 

  const { user, selectedShipId: shipId } = useUser();

  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!jobId || !shipId) return;
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    
    fetchMaintenanceJob(jobId, shipId).then((data) => {
      setMaintenanceData(data || []);
    });
  }, [jobId, shipId]);

    const { t, i18n } = useTranslation("maintenance");
    const [mounted, setMounted] = useState(false);
      
    useEffect(() => {
      setMounted(true);
    }, []);
      
    if (!mounted || !i18n.isInitialized) return null;

    // Mostra loading separato
    if (maintenancedata.length === 0) return (
      <div className="flex flex-col bg-[#001c38] text-white p-4 min-h-screen">
        <DashboardHeader />
      </div>
    );

  return (
    <div className="flex flex-col bg-[#001c38] text-white p-4">
      <DashboardHeader />

      <div className="flex w-full items-center mt-4">
        <Breadcrumbs />
      </div>

      <div className="flex items-center pt-2 pb-4">
        <div className='flex items-center gap-4'>
          <h2 className="text-2xl font-bold">
            {maintenancedata[0]?.maintenance_list.name
              ? maintenancedata[0].maintenance_list.name.charAt(0).toUpperCase() +
                maintenancedata[0].maintenance_list.name.slice(1).toLowerCase()
              : ""}
          </h2>
        </div>

        <div className='ml-auto flex items-center gap-4'>
          <button
            type="submit"
            onClick={() => setNoteModal(!noteModal)}
            className="rounded-md flex items-center bg-[#789fd6] hover:bg-blue-500 text-white font-bold sm:py-1 py-2 px-2 sm:px-4 transition duration-200 cursor-pointer"
          >
            <svg width="16px" height="16px" fill="#fff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"/></svg>
            <span className="sm:block hidden">&nbsp;&nbsp; {t("add_note")}</span>
          </button>
        </div>
      </div>

      {noteModal && (
        <NoteModal onClose={() => setNoteModal(false)} id={jobId} />
      )}

      <div className="block sm:flex gap-4">
        <div className="w-full sm:w-3/4 space-y-4 bg-[#022a52] p-4 rounded-md sm:mb-0 mb-4">
          <div className="flex sm:px-2">
            <MaintenanceDetails details={maintenancedata[0]} />
          </div>
        </div>

        <div className="w-full sm:w-1/4 bg-[#022a52] p-4 rounded-md">
          <MaintenanceInfo details={maintenancedata[0]} />
        </div>
      </div>
    </div>
  );
}

"use client"

import { useState, useEffect } from "react";
import DashboardHeader from "@/components/header/DashboardHeader";
import Breadcrumbs from "@/components/dashboard/Breadcrumbs";
import MaintenanceDetails from "@/components/maintenance/element/MaintenanceDetails";
import MaintenanceInfo from "@/components/maintenance/element/MaintenanceInfo";
import PauseModal from "@/components/maintenance/element/PauseModal";
import NoteModal from "@/components/maintenance/element/NoteModal";
import { fetchMaintenanceJob } from "@/api/maintenance";
import { useParams } from "next/navigation";
import { useTranslation } from "@/app/i18n";
import { updateMaintenanceJobStatus } from "@/api/maintenance";
import StatusBadgeDetail from "@/components/maintenance/StatusBadgeDetail";

export default function ElementPage({ params }) {
  const [isOpen, setIsOpen] = useState(false);
  const [noteModal, setNoteModal] = useState(false);
  
  const params2 = useParams();
  const jobId = params2.elem; 

  const [maintenancedata, setMaintenanceData] = useState(false);

  const handleOptionClick = async (option) => {
    const res = await updateMaintenanceJobStatus(jobId, option);
    if (res) {
      window.location.reload();
    }
  };

  useEffect(() => {
    fetchMaintenanceJob(jobId).then((data) => {
      setMaintenanceData(data || []);
    });
  }, [jobId]);

  const { t, i18n } = useTranslation("maintenance");
  const [mounted, setMounted] = useState(false);
    
  useEffect(() => {
    setMounted(true);
  }, []);
    
  if (!mounted || !i18n.isInitialized) return null;

  return (
    <div className="flex flex-col bg-[#001c38] text-white p-4">
      <DashboardHeader />

      <div className="flex w-full items-center mt-4">
        <Breadcrumbs />
      </div>

      <div className="flex items-start sm:items-center pt-4 pb-4">
        <div className='block sm:flex items-center gap-4'>
          
        <p className="text-2xl font-bold sm:mb-0 mb-2">
          {(() => {
            if (!maintenancedata[0]?.maintenance_list.name) return "";
            const text = maintenancedata[0]?.maintenance_list.name.toLowerCase();
            const formatted =
              text.charAt(0).toUpperCase() + text.slice(1);
            return formatted;
          })()}
        </p>
          <StatusBadgeDetail dueDate={maintenancedata[0]?.ending_date} pauseDate={maintenancedata[0]?.pauseDate} string={maintenancedata[0]?.status.name} />
        </div>

        <div className="ml-auto flex items-center gap-4">
          {maintenancedata[0]?.status.id === 1 && (
            <button
              type="submit"
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-md flex items-center bg-[#022a52] hover:bg-blue-500 text-white font-bold py-1 px-4 transition duration-200 cursor-pointer"
            >
              <svg width="16px" height="16px" fill="#fff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                <path d="M48 64C21.5 64 0 85.5 0 112L0 400c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48L48 64zm192 0c-26.5 0-48 21.5-48 48l0 288c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48l-32 0z"/>
              </svg>
               <span className="hidden sm:block">&nbsp;&nbsp; {t("pause")}</span>
            </button>
          )}

          {maintenancedata[0]?.status.id === 3 && (
            <button
              type="submit"
              onClick={() => handleOptionClick(1)}
              className="rounded-md flex items-center bg-[#022a52] hover:bg-blue-500 text-white font-bold py-2 px-4 transition duration-200 cursor-pointer"
            >
              <svg width="16px" height="16px" fill="#fff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/>
              </svg>
              <span className="hidden sm:block">&nbsp;&nbsp; {t("start")}</span>
            </button>
          )}

          <button
            type="submit"
            onClick={() => setNoteModal(!noteModal)}
            className="rounded-md flex items-center bg-[#789fd6] hover:bg-blue-500 text-white font-bold py-1 px-4 transition duration-200 cursor-pointer"
          >
            <svg width="16px" height="16px" fill="#fff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"/>
            </svg>
            &nbsp;&nbsp; <span className="hidden sm:block">{t("add_note")}</span>
          </button>
        </div>

      </div>

      {isOpen && (
        <PauseModal oldStatusId={maintenancedata[0].status.id} jobId={jobId} onClose={() => setIsOpen(false)} />
      )}

      {noteModal && (
        <NoteModal onClose={() => setNoteModal(false)} id={maintenancedata[0]?.id} />
      )}

      <div className="block sm:flex gap-4">
        <div className="sm:w-3/4 w-full space-y-4 bg-[#022a52] p-4 rounded-md sm:mb-0 mb-4">
          <div className="flex sm:px-2">
            <MaintenanceDetails details={maintenancedata} />
          </div>
        </div>

        <div className="sm:w-1/4 w-full bg-[#022a52] p-4 rounded-md">
          <MaintenanceInfo details={maintenancedata}/>
        </div>
      </div>
    </div>
  );
}
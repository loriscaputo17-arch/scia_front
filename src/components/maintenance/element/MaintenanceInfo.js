"use client";

import { useState, useEffect } from "react";
import Image from 'next/image';
import SpareModal from "./SpareModal";
import FacilitiesModal from "@/components/maintenance/FacilitiesModal";
import { useTranslation } from "@/app/i18n";
import SpareSelector from "./SpareSelector";
import InstructionModal from "./InstructionModal";

const MaintenanceInfo = ({ details }) => {
  const [showFull, setShowFull] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [facilitiesOpen, setFacilitiesOpen] = useState(false);
  const [selectedSpare, setSelectedSpare] = useState([]);
  const [showInstructions, setShowInstructions] = useState(false);

  const { t, i18n } = useTranslation("maintenance");
    const [mounted, setMounted] = useState(false);
      
    useEffect(() => {
      setMounted(true);
    }, []);
      
    if (!mounted || !i18n.isInitialized) return null;

  return (
    <div className="p-2">
      <h2 className="text-lg text-[#789fd6] mb-2">{t("description")}</h2>

      <p
        className={`text-white ${
          showFull
            ? ""
            : "line-clamp-2 overflow-hidden text-ellipsis whitespace-normal"
        }`}
        style={{
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: showFull ? "unset" : 2,
          overflow: "hidden",
        }}
      >
        {details[0]?.maintenance_list.Maintenance_under_condition_description}
      </p>

      <div className="flex items-center gap-2">
        <button
          className="mt-2 text-sm text-[#fff] w-fit cursor-pointer bg-[#ffffff1a] py-1 px-4 rounded mt-2"
          onClick={() => {
                if (details[0].documentFileUrl) {
                  const pdfUrl = `${details[0].documentFileUrl}#page=${details[0]?.maintenance_list?.page}`;
                  window.open(pdfUrl, "_blank");
                } else {
                  alert("Nessun documento trovato per questo ricambio");
                }
              }}
        >
          {t("see_files")}
        </button>

        <button
          className="mt-2 text-sm text-[#fff] w-fit cursor-pointer bg-[#ffffff1a] py-1 px-4 rounded"
          onClick={() => setShowInstructions(true)}
        >
          {t("see_instructions")}
        </button>
      </div>

      <div className="mb-6">
      
        <h2 className="text-lg text-[#789fd6] mb-2 mt-4">{t("spare_parts")}</h2>

        <div className="flex flex-col gap-4">

       <div
          className="flex overflow-x-auto gap-4 py-2 custom-carousel"
          style={{ display: "flex !important", flexFlow: "nowrap !important" }}
        >
          <SpareSelector
            spares={details[0]?.spares || []}
            onSelectChange={(selected) => setSelectedSpare(selected)}
          />
        </div>

        </div>

        <div className="flex gap-4">
        <button
            type="submit"
            onClick={() => setIsOpen(true)}
            className="rounded-md flex items-center bg-[#ffffff10] hover:bg-blue-500 text-white font-bold py-2 px-4 transition duration-200 cursor-pointer"
          >
            <svg width="16px" height="16px" fill="#fff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"/></svg>
            &nbsp;&nbsp; {t("add")}
          </button>

          <button
            type="submit"
            className="rounded-md text-center flex items-center bg-[#789fd6] hover:bg-blue-500 text-white font-bold py-1 px-4 transition duration-200 cursor-pointer"
          >
            <svg width="16px" height="16px" fill="#fff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"/></svg>
            &nbsp;&nbsp; Push&Buy
          </button>
        </div>
      </div>

      {isOpen && (
        <SpareModal onClose={() => setIsOpen(false)} maintenanceListId={details[0]?.id}/>
      )}

      <div className="mb-6">

        <div className="flex items-center mb-2 mt-4">
          <h2 className="text-lg text-[#789fd6]">{t("system")}/{t("component")}</h2>
        </div>
      

        <div className="flex items-center gap-4 cursor-pointer" onClick={() => setFacilitiesOpen(true)}>
          <Image 
                    src="/motor.jpg"
                    alt="Motore"
                    width={25} 
                    height={25} 
                    className=""
                  />

          <div>
            <h2 className="text-md text-[#fff]">{details[0]?.Element?.element_model?.ESWBS_code} {details[0]?.Element?.element_model?.LCN_name.substring(0, 15) + "..."}</h2>

          </div>
        
          <div className="ml-auto mr-8">
                <svg fill="white" width="16px" height="16px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg>
              </div>
        </div>

      </div>

      <div className="mb-6">

        <div className="flex items-center mb-2 mt-4">
          <h2 className="text-lg text-[#789fd6]">{t("anniversary")}</h2>
        </div>
      

        <div className="flex items-center gap-4 cursor-pointer">

        <p>{details[0]?.recurrency_type.to_days} gg</p>
  
        </div>

      </div>

      <div className="mb-6">

        <div className="flex items-center mb-2 mt-4">
          <h2 className="text-lg text-[#789fd6]">{t("execution")}</h2>
        </div>
      

        <div className="flex items-center gap-4 cursor-pointer">

        <p>
          {details[0]?.execution_date &&
            new Date(details[0].execution_date).toLocaleDateString("it-IT", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
        </p>

        </div>

      </div>

      <FacilitiesModal isOpen={facilitiesOpen} onClose2={() => setFacilitiesOpen(false)} eswbs={details[0]?.Element?.element_model?.ESWBS_code} />
      
      {showInstructions && (
        <InstructionModal
          text={details[0]?.maintenance_list?.Maintenance_under_condition_description}
          onClose={() => setShowInstructions(false)}
        />
      )}

    </div>
  );
};

export default MaintenanceInfo;

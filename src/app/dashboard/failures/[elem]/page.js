"use client"

import { useState, useEffect } from "react";
import DashboardHeader from "@/components/header/DashboardHeader";
import Breadcrumbs from "@/components/dashboard/Breadcrumbs";
import MaintenanceDetails from "@/components/failures/element/MaintenanceDetails";
import MaintenanceInfo from "@/components/failures/element/MaintenanceInfo";
import PauseModal from "@/components/failures/element/PauseModal";
import NoteModal from "@/components/failures/element/NoteModal";
import { getFailures } from "@/api/failures";
import { useParams } from "next/navigation";
import { useTranslation } from "@/app/i18n";

export default function ElementPage({ params }) {
  const [isOpen, setIsOpen] = useState(false);
  const [noteModal, setNoteModal] = useState(false);
  const { t, i18n } = useTranslation("failures");

  const params2 = useParams();
  const id = params2.elem;

  const [failures, setFailures] = useState([]);
  const [failure, setFailure] = useState(null);
  const [loading, setLoading] = useState(true);

  const [bgColor, setBgColor] = useState("bg-gray-400");
  const [textColor, setTextColor] = useState("text-white");

  useEffect(() => {
    async function fetchFailures() {
      try {
        const data = await getFailures();
        setFailures(data);
      } catch (error) {
        console.error("Errore durante il fetch delle avarie:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFailures();
  }, []);

  useEffect(() => {
    if (!failures || failures.length === 0) return;

    const failureData = failures.find((item) => String(item.id) === id);
    setFailure(failureData);

    if (!failureData) return;

    switch (failureData.gravity?.toLowerCase()) {
      case "critica":
        setBgColor("bg-[rgb(208,2,27)]");
        setTextColor("text-white");
        break;
      case "alta":
        setBgColor("bg-[rgb(244,114,22)]");
        setTextColor("text-white");
        break;
      case "media":
        setBgColor("bg-[rgb(255,191,37)]");
        setTextColor("text-black");
        break;
      case "bassa":
        setBgColor("bg-[rgb(45,182,71)]");
        setTextColor("text-white");
        break;
      default:
        setBgColor("bg-gray-400");
        setTextColor("text-white");
    }
  }, [failures, id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        {t("loading")}
      </div>
    );
  }

  if (!failure) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {t("error")}
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-[#001c38] text-white p-4">
      <DashboardHeader />

      <div className="flex w-full items-center mt-4">
        <Breadcrumbs />
      </div>

      <div className="flex items-center pt-2 pb-4">
        <div className='flex items-center gap-4'>
          <h2 className="text-2xl font-bold">{failure.title}</h2>
          <div className={`text-[12px] rounded-full py-1 px-4 ${bgColor} ${textColor}`}>
            {failure.gravity}
          </div>
        </div>

        <div className='ml-auto flex items-center gap-4'>

          <button
            type="submit"
            onClick={() => setNoteModal(!noteModal)}
            className="rounded-md flex items-center bg-[#789fd6] hover:bg-blue-500 text-white font-bold py-1 px-4 transition duration-200 cursor-pointer"
          >
            <svg width="16px" height="16px" fill="#fff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"/></svg>
            &nbsp;&nbsp; {t("add_note")}
          </button>
        </div>
      </div>

      {isOpen && <PauseModal onClose={() => setIsOpen(false)} />}
      {noteModal && <NoteModal onClose={() => setNoteModal(false)} id={id} />}

      <div className="block sm:flex gap-4">
        <div className="sm:w-3/4 w-full space-y-4 bg-[#022a52] p-4 rounded-md sm:mb-0 mb-4">
          <div className="flex px-2">
            <MaintenanceDetails details={failure} />
          </div>
        </div>

        <div className="sm:w-1/4 w-full bg-[#022a52] p-4 rounded-md">
          <MaintenanceInfo details={failure}/>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { fetchMaintenanceTypes } from "@/api/maintenance";
import { useTranslation } from "@/app/i18n";

export default function SelectModal({ isOpen, onClose, onSelect, shipId, userId }) {
  const [maintenanceTypes, setMaintenanceTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { t, i18n } = useTranslation("maintenance");

  const getStatusColor = (date) => {

    const today = new Date();
    const dueDate = new Date(date);
    const dueDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

    if (dueDays < -15) {
      return "#d0021b";
    } else if (dueDays < 0) {
      return "rgb(244,114,22)"; 
    } else if (dueDays <= 3) {
      return "#ffbf25";
    } else if (dueDays > 15) {
      return "rgb(45,182,71)";
    }
    return "#CCCCCC";
  };

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true); 
      fetchMaintenanceTypes(shipId, userId)
        .then((data) => {
          setMaintenanceTypes(data || []);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen, shipId, userId]);

  const handleConfirm = () => {
    if (selectedType) {
      onSelect(selectedType);
      onClose();
    }
  };

  return isOpen ? (
    <div className="fixed inset-0 flex sm:items-center sm:justify-center bg-black/50 z-10">
      <div className="bg-[#022a52] w-full sm:w-[90%] p-6 rounded-md shadow-lg text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="ml-auto mr-auto sm:ml-inherit sm:mr-inherit text-[22px] font-semibold">{t("select_maintenance")}</h2>
          <button className="text-white text-xl cursor-pointer" onClick={onClose}>
            <svg width="24px" height="24px" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
              <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
            </svg>
          </button>
        </div>

        <div className="bg-transparent rounded-md overflow-hidden" style={{height: "50vh", overflowY: "scroll"}}>
          {/* Tabella desktop (da sm in su) */}
          <table className="w-full text-white border-collapse hidden sm:table">
            <thead className="bg-white text-black">
              <tr>
                <th className="p-3 text-left border border-[#022a52]">{t("title_text")}</th>
                <th className="p-3 text-left border border-[#022a52]">Task</th>
                <th className="p-3 text-left border border-[#022a52]">{t("expiration")}</th>
                <th className="p-3 text-left border border-[#022a52]">{t("last_execution")}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="p-3 text-center border border-[#022a52]">
                    {t("loading")}...
                  </td>
                </tr>
              ) : maintenanceTypes.filter(item => item.tasks > 0).length > 0 ? (
                maintenanceTypes.filter(item => item.tasks > 0).map(item => (
                  <tr key={item.id}>
                    <td className="p-3 border border-[#022a52] flex items-center gap-4">
                      <input
                        type="radio"
                        name="maintenanceType"
                        value={item.id}
                        onChange={() => setSelectedType(item)}
                        checked={selectedType?.id === item.id}
                      />
                      <div>{item.title}</div>
                    </td>
                    <td className="p-3 border border-[#022a52]">{item.tasks}</td>
                    <td className={`p-3 border border-[#022a52] bg-[${getStatusColor(item.dueDate)}]`}>
                      {item.dueDate !== "N/A" ? new Date(item.dueDate).toLocaleDateString("it-IT") : "N/A"}
                    </td>
                    <td className="p-3 border border-[#022a52]">
                      {item.lastExecution !== "N/A" ? new Date(item.lastExecution).toLocaleDateString("it-IT") : "N/A"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-3 text-center border border-[#022a52]">{t("no_data_available")}</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Lista mobile (solo su mobile, nascosta da sm in su) */}
          <div className="sm:hidden flex flex-col gap-4">
            {isLoading ? (
              <p className="text-center">{t("loading")}...</p>
            ) : maintenanceTypes.filter(item => item.tasks > 0).length > 0 ? (
              maintenanceTypes.filter(item => item.tasks > 0).map(item => (
                <label
                  key={item.id}
                  className={`cursor-pointer rounded-md p-4 flex items-center gap-4 border-b border-black
`}
                >
                  <input
                    type="radio"
                    name="maintenanceType"
                    value={item.id}
                    className="cursor-pointer"
                    onChange={() => setSelectedType(item)}
                    checked={selectedType?.id === item.id}
                  />
                  <div className="flex flex-col flex-grow gap-2">
                    <span className={`rounded-full py-1 px-3 w-[fit-content] bg-[${getStatusColor(item.dueDate)}] text-[10px]`}>{item.dueDate !== "N/A" ? new Date(item.dueDate).toLocaleDateString("it-IT") : "N/A"}</span>
                    <span className="font-semibold text-2xl text-white">{item.title}</span>
                    <span className="text-[#9ba7b9]">Task: {item.tasks} - Ultima esec: {item.lastExecution !== "N/A" ? new Date(item.lastExecution).toLocaleDateString("it-IT") : "N/A"}</span>
                  </div>
                </label>
              ))
            ) : (
              <p className="text-center">{t("no_data_available")}</p>
            )}
          </div>
        </div>


        <button
          className="w-full bg-[#789fd6] p-3 mt-4 text-white font-semibold rounded-md cursor-pointer"
          onClick={handleConfirm}
          disabled={!selectedType}
        >
          {t("confirm")}
        </button>
      </div>
    </div>
  ) : null;
}
"use client";

import { useState, useEffect } from "react";
import { fetchMaintenanceTypes } from "@/api/maintenance";
import { useTranslation } from "@/app/i18n";

export default function SelectModal({ isOpen, onClose, onSelect, types, defaultType }) {
  const [maintenanceTypes, setMaintenanceTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    if (defaultType) {
      setSelectedType(defaultType);
    }
  }, [defaultType, isOpen]);
  
  const handleConfirm = () => {
    if (selectedType) {
      onSelect(selectedType);
      onClose();
    }
  };

  const groupedTypes = Object.values(
    types.reduce((acc, task) => {
      const name = task?.maintenance_list?.name || "Unknown";

      if (!acc[name]) {
        acc[name] = {
          id: name, // 👈 chiave unica
          title: name,
          count: 1,
          tasks: [task],
          lastExecution: task.execution_date,
          nextDue: task.ending_date,
        };
      } else {
        acc[name].count += 1;
        acc[name].tasks.push(task);

        // ultima esecuzione
        if (
          task.execution_date &&
          (!acc[name].lastExecution ||
            new Date(task.execution_date) > new Date(acc[name].lastExecution))
        ) {
          acc[name].lastExecution = task.execution_date;
        }

        // prossima scadenza
        if (
          task.ending_date &&
          (!acc[name].nextDue ||
            new Date(task.ending_date) < new Date(acc[name].nextDue))
        ) {
          acc[name].nextDue = task.ending_date;
        }
      }

      return acc;
    }, {})
  );

  const { t, i18n } = useTranslation("maintenance");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
      setMounted(true);
    }, []);
      
  if (!mounted || !i18n.isInitialized) return null;

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-10">
      <div className="bg-[#022a52] sm:w-[70%] w-full h-full sm:h-auto p-6 rounded-md shadow-lg text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[22px] font-semibold">{t("select_checklist")}</h2>
          <button className="text-white text-xl cursor-pointer" onClick={onClose}>
            <svg width="24px" height="24px" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
          </button>
        </div>

          

              <div className="bg-transparent rounded-md overflow-hidden">
  
  <div style={{ maxHeight: "50vh", overflowY: "auto" }}>
    <table className="w-full text-white border-collapse hidden sm:table">
      <thead className="bg-white text-black sticky top-0 z-10">
              <tr>
                <th className="p-3 text-left border border-[#022a52]">{t("select")}</th>
                <th className="p-3 text-left border border-[#022a52]">{t("title_text")}</th>
                <th className="p-3 text-left border border-[#022a52]">Task</th>
                <th className="p-3 text-left border border-[#022a52]">{t("expiration")}</th>
                <th className="p-3 text-left border border-[#022a52]">{t("last_execution")}</th>
              </tr>
            </thead>
            <tbody> 
              {groupedTypes.length > 0 ? (
                groupedTypes.map((type) => (
                  <tr
                    key={type.id}
                  >
                    <td className="p-3 text-center border border-[#022a52]" style={{borderRight: '1px solid black', borderBottom: '1px solid black',}}>
                      <input
                        type="radio"
                        name="maintenanceType"
                        value={type.id}
                        onChange={() => setSelectedType(type)}
                        checked={selectedType?.id === type.id}
                      />
                    </td>
                    <td>
                      {type.title.length > 20 
                      ? type.title.substring(0, 20) + "..." 
                      : type.title}
                    </td>
                    <td>{type.count}</td>
                    <td>
                      {type.nextDue
                        ? new Date(type.nextDue).toLocaleDateString("it-IT")
                        : "-"}
                    </td>
                    <td>
                      {type.lastExecution
                        ? new Date(type.lastExecution).toLocaleDateString("it-IT")
                        : "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-3 text-center border border-[#022a52]">
                    {t("no_data_available")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="sm:hidden flex flex-col gap-4">
            {types.length > 0 ? (
                types.map((type) => (

                  <label
                  key={type.id}
                  className={`cursor-pointer rounded-md p-4 flex items-center gap-4 border-b border-black
`}
                >
                  <input
                        type="radio"
                        name="maintenanceType"
                        value={type.id}
                        onChange={() => setSelectedType(type)}
                        checked={selectedType?.id === type.id}
                      />
                  <div className="flex flex-col flex-grow gap-2">
                    <span className={`rounded-full py-1 px-3 w-[fit-content] bg-[#395575] text-[10px]`}>{type.ending_date !== "N/A" ? new Date(type.ending_date).toLocaleDateString("it-IT") : "N/A"}</span>
                    <span className="font-semibold text-2xl text-white">{type.title}</span>
                    <span className="text-[#9ba7b9]">Task: 12 - Ultima esec: {type.execution_date !== "N/A" ? new Date(type.execution_date).toLocaleDateString("it-IT") : "N/A"}</span>
                  </div>
                </label>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-3 text-center border border-[#022a52]">
                    {t("no_data_available")}
                  </td>
                </tr>
              )}
          </div>

        </div>

        <button
          className="w-full bg-[#789fd6] p-3 mt-4 text-white font-semibold cursor-pointer rounded-md"
          onClick={handleConfirm}
          disabled={!selectedType}
        >
          {t("confirm")}
        </button>
      </div>
      </div>
    </div>
  ) : null;
}


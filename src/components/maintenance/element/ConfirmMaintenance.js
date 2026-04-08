"use client";

import { useState, useEffect } from "react";
import SpareSelector from "./SpareSelector";
import { useTranslation } from "@/app/i18n";
import { useUser } from "@/context/UserContext";
import { markAsOk } from "@/api/maintenance";
import { useRouter } from "next/navigation";
import { getMaintenanceLevels } from "@/api/admin/maintenanceLevel";

// IDs ricorrenza che consentono selezione spare
const SELECTABLE_RECURRENCY_IDS = [6, 13];

export default function ConfirmMaintenance({ onClose, maintenanceListId, onClick, details }) {
  const [selectedTime, setSelectedTime] = useState(null);
  const [level, setLevel] = useState("");
  const [levels, setLevels] = useState([]);
  const [selectedSpareIDs, setSelectedSpareIDs] = useState([]);

  const router = useRouter();
  const { user, selectedShipId: shipId } = useUser();
  const { t } = useTranslation("maintenance");

  const timeOptions = [5, 10, 15, 30, 45, 60, 90, 120];

  // Dati dalla manutenzione passata come prop
  const recurrencyTypeId = details?.[0]?.maintenance_list?.RecurrencyType_ID;
  const sparesSelectable = SELECTABLE_RECURRENCY_IDS.includes(recurrencyTypeId);

  const spares = details?.[0]?.spares || [];
  const consumables = details?.[0]?.consumables || [];
  const tools = details?.[0]?.tools || [];

  useEffect(() => {
    async function fetchData() {
      try {
        const levelData = await getMaintenanceLevels();
        setLevels(levelData);
      } catch (e) {
        console.error("Errore nel caricamento:", e);
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTime || !level) {
      return alert("⚠ Please select time and level.");
    }

    const spareData = {
      time: selectedTime,
      level,
      userType: "User logged in",
      userId: user?.id,
      maintenanceList_id: maintenanceListId,
      spares: selectedSpareIDs,
    };

    const result = await markAsOk(maintenanceListId, spareData, selectedSpareIDs, shipId);

    if (result) {
      onClick("ok");
      onClose();

      const successToast = document.createElement("div");
      successToast.style.cssText = `
        position:fixed; bottom:30px; left:50%; transform:translateX(-50%);
        padding:15px 25px; background:#2db647; color:white;
        font-weight:bold; border-radius:10px; font-size:18px;
      `;
      successToast.innerText = t("maintenance_completed_successfully");
      document.body.appendChild(successToast);

      setTimeout(() => {
        successToast.style.opacity = 0;
        setTimeout(() => {
          successToast.remove();
          router.push("/dashboard/maintenance");
        }, 400);
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#000000ab] z-50 overflow-y-auto py-6">
      <form onSubmit={handleSubmit} className="bg-[#022a52] sm:w-[70%] w-full p-5 rounded-md text-white">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[26px] font-semibold">{t("confirm_mark")}</h2>
          <button type="button" className="text-white text-xl cursor-pointer" onClick={onClose}>✕</button>
        </div>

        <p className="text-[18px] font-semibold mb-4">{t("please_confirm")}</p>

        {/* SPARE PARTS */}
        {spares.length > 0 && (
          <div className="mb-5">
            <label className="text-[#789FD6] text-sm block mb-2">
              {sparesSelectable ? t("please_select_spare_parts_used") : "Ricambi"}
            </label>

            {sparesSelectable ? (
              // Selezionabili
              <SpareSelector spares={spares} onSelectChange={setSelectedSpareIDs} />
            ) : (
              // Solo visualizzazione
              <div className="flex flex-col gap-2">
                {spares.map((s) => (
                  <div key={s.ID} className="flex justify-between bg-[#ffffff0d] rounded-lg px-4 py-2">
                    <span className="text-white text-sm">{s.Part_name || s.Serial_number}</span>
                    <span className="text-white/50 text-xs">Qty: {s.quantity || "—"}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CONSUMABLES */}
        {consumables.length > 0 && (
          <div className="mb-5">
            <label className="text-[#789FD6] text-sm block mb-2">Consumabili utilizzati</label>
            <div className="flex flex-col gap-2">
              {consumables.map((c) => (
                <div key={c.ID} className="flex justify-between bg-[#ffffff0d] rounded-lg px-4 py-2">
                  <span className="text-white text-sm">{c.Commercial_Name}</span>
                  <span className="text-white/50 text-xs">{c.quantity ?? "AR"} {c.unit}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TOOLS */}
        {tools.length > 0 && (
          <div className="mb-5">
            <label className="text-[#789FD6] text-sm block mb-2">Attrezzature utilizzate</label>
            <div className="flex flex-col gap-2">
              {tools.map((tool) => (
                <div key={tool.ID} className="flex justify-between bg-[#ffffff0d] rounded-lg px-4 py-2">
                  <span className="text-white text-sm">{tool.Tool_name}</span>
                  <span className="text-white/50 text-xs">{tool.quantity ?? "—"} {tool.unit}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Time Selection */}
        <div className="mt-4">
          <label className="text-[#789FD6] text-sm">{t("time_taken")}</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {timeOptions.map((min) => (
              <button
                key={min}
                type="button"
                onClick={() => setSelectedTime(min)}
                className={`px-4 py-2 rounded-md cursor-pointer ${
                  selectedTime === min ? "bg-[#789fd6]" : "bg-[#ffffff10]"
                }`}
              >
                {min} min
              </button>
            ))}
          </div>
        </div>

        {/* Maintenance Level */}
        <div className="mt-4">
          <label className="text-[#789FD6] text-sm">{t("level")}</label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full px-4 py-2 mt-2 bg-[#ffffff10] rounded-md"
            required
          >
            <option value="">{t("select_level")}</option>
            {levels.map((lvl) => (
              <option key={lvl.id} value={lvl.id}>
                {lvl.Level_MMI} — {lvl.Description}
              </option>
            ))}
          </select>
        </div>

        {/* User */}
        <div className="mt-4">
          <label className="text-[#789FD6] text-sm">{t("user_executor")}</label>
          <input
            type="text"
            value={`${user?.firstName} ${user?.lastName}`}
            readOnly
            className="mt-2 w-full px-4 py-2 bg-[#ffffff10] opacity-40 rounded-md"
          />
        </div>

        {/* Submit */}
        <button type="submit" className="w-full bg-[#789fd6] py-3 rounded-md text-white mt-6">
          {t("save")}
        </button>
      </form>
    </div>
  );
}
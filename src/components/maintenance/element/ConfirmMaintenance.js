"use client";

import { useState, useEffect } from "react";
import SpareSelector from "./SpareSelector";
import { useTranslation } from "@/app/i18n";
import { useUser } from "@/context/UserContext";
import { markAsOk } from "@/api/maintenance";
import { useRouter } from "next/navigation";
import { getMaintenanceLevels } from "@/api/admin/maintenanceLevel";
import { getSpares } from "@/api/admin/spares";

export default function ConfirmMaintenance({ onClose, maintenanceListId, onClick }) {
  const [selectedTime, setSelectedTime] = useState(null);
  const [level, setLevel] = useState("");
  const [levels, setLevels] = useState([]);
  const [spares, setSpares] = useState([]);
  const [selectedSpareIDs, setSelectedSpareIDs] = useState([]);

  const { user } = useUser();
  const router = useRouter();
  const shipId = user?.teamInfo?.assignedShip?.id;

  const { t } = useTranslation("maintenance");

  const timeOptions = [5, 10, 15, 30, 45, 60, 90, 120];

  useEffect(() => {
    async function fetchData() {
      try {
        const [levelData, spareData] = await Promise.all([
          getMaintenanceLevels(),
          getSpares(shipId)
        ]);

        setLevels(levelData);
        setSpares(spareData);
      } catch (e) {
        console.error("Errore nel caricamento:", e);
      }
    }

    fetchData();
  }, [shipId]);

  const userType = "User logged in";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTime || !level) {
      return alert("⚠ Please select time and level.");
    }

    const spareData = {
      time: selectedTime,
      level,
      userType,
      userId: user?.id,
      maintenanceList_id: maintenanceListId,
      spares: selectedSpareIDs,
    };

    const result = await markAsOk(maintenanceListId, spareData, selectedSpareIDs);

    if (result) {
      onClick("ok");
      onClose();

      // Mini feedback
      const successToast = document.createElement("div");
      successToast.style.position = "fixed";
      successToast.style.bottom = "30px";
      successToast.style.left = "50%";
      successToast.style.transform = "translateX(-50%)";
      successToast.style.padding = "15px 25px";
      successToast.style.background = "#2db647";
      successToast.style.color = "white";
      successToast.style.fontWeight = "bold";
      successToast.style.borderRadius = "10px";
      successToast.style.fontSize = "18px";
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
    <div className="fixed inset-0 flex items-center justify-center bg-[#000000ab] z-50">
      <form onSubmit={handleSubmit} className="bg-[#022a52] sm:w-[70%] w-full p-5 rounded-md text-white">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[26px] font-semibold">{t("confirm_mark")}</h2>
          <button type="button" className="text-white text-xl cursor-pointer" onClick={onClose}>✕</button>
        </div>

        <p className="text-[18px] font-semibold mb-4">{t("please_confirm")}</p>

        {/* Spare Parts Selection */}
        <label className="text-[#789FD6] text-sm">{t("please_select_spare_parts_used")}</label>
        <SpareSelector spares={spares} onSelectChange={setSelectedSpareIDs} />

        {/* Time Selection */}
        <div className="mt-6">
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
        <div className="mt-6">
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

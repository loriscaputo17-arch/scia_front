"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSettings, updateSettings } from "@/api/settings";
import { useUser } from "@/context/UserContext";
import { useTranslation } from "@/app/i18n";

export default function SettingsContainer() {
  const [isNotificationsEnabledMaintenance, setIsNotificationsEnabledMaintenance] = useState(false);
  const [isNotificationsEnabledChecklist, setIsNotificationsEnabledChecklist] = useState(false);
  const [maintenanceFrequency, setMaintenanceFrequency] = useState("settimanale");
  const [checklistFrequency, setChecklistFrequency] = useState("settimanale");

  const [isUpcomingMaintenanceEnabled, setIsUpcomingMaintenanceEnabled] = useState(false);
  const [isUpcomingChecklistEnabled, setIsUpcomingChecklistEnabled] = useState(false);
  const [isUpcomingSpareEnabled, setIsUpcomingSpareEnabled] = useState(false);

  const [isPlanningMaintenanceEnabled, setIsPlanningMaintenanceEnabled] = useState(false);
  const [planningMaintenanceFrequency, setPlanningMaintenanceFrequency] = useState("settimanale");

  const [isPlanningChecklistEnabled, setIsPlanningChecklistEnabled] = useState(false);
  const [planningChecklistFrequency, setPlanningChecklistFrequency] = useState("settimanale");

  const [isPlanningSpareEnabled, setIsPlanningSpareEnabled] = useState(false);
  const [planningSpareFrequency, setPlanningSpareFrequency] = useState("settimanale");

  const [license, setLicense] = useState("");
  const { user } = useUser();
  const { t, i18n } = useTranslation("settings");
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    const langFromStorage =
      typeof window !== "undefined" ? localStorage.getItem("language") : null;

    if (langFromStorage && i18n.language !== langFromStorage) {
      i18n.changeLanguage(langFromStorage);
    }
    setMounted(true);
  }, [i18n]);

  useEffect(() => {
    const fetchSettingsData = async () => {
      if (!user) return;

      try {
        const data = await getSettings(user.id);
        if (!data) return;

        setIsNotificationsEnabledMaintenance(
          data.is_notifications_enabled_maintenance ?? false
        );
        setMaintenanceFrequency(data.maintenance_frequency || "mensile");

        setIsNotificationsEnabledChecklist(
          data.is_notifications_enabled_checklist ?? false
        );
        setChecklistFrequency(data.checklist_frequency || "mensile");

        setLicense(data.license || "");

        setIsUpcomingMaintenanceEnabled(data.is_upcoming_maintenance_enabled ?? false);
        setIsUpcomingChecklistEnabled(data.is_upcoming_checklist_enabled ?? false);
        setIsUpcomingSpareEnabled(data.is_upcoming_spare_enabled ?? false);

        setIsPlanningMaintenanceEnabled(data.is_planning_maintenance_enabled ?? false);
        setPlanningMaintenanceFrequency(
          data.planning_maintenance_frequency || "settimanale"
        );

        setIsPlanningChecklistEnabled(data.is_planning_checklist_enabled ?? false);
        setPlanningChecklistFrequency(
          data.planning_checklist_frequency || "settimanale"
        );

        setIsPlanningSpareEnabled(data.is_planning_spare_enabled ?? false);
        setPlanningSpareFrequency(data.planning_spare_frequency || "settimanale");
      } catch (err) {
        console.error("Errore nel recupero impostazioni:", err);
      }
    };

    fetchSettingsData();
  }, [user]);

  const handleSaveSettings = async () => {
    if (!user) {
      console.error("Errore: user è null o undefined");
      alert(t("error.userNotFound"));
      return;
    }

    const payload = {
      user_id: user.id,

      isNotificationsEnabledMaintenance,
      maintenanceFrequency,
      isNotificationsEnabledChecklist,
      checklistFrequency,
      license,

      isUpcomingMaintenanceEnabled,
      isUpcomingChecklistEnabled,
      isUpcomingSpareEnabled,

      isPlanningMaintenanceEnabled,
      planningMaintenanceFrequency,
      isPlanningChecklistEnabled,
      planningChecklistFrequency,
      isPlanningSpareEnabled,
      planningSpareFrequency,
    };

    const success = await updateSettings(payload);

    if (success) {
      alert(t("settingsSaved"));
      
      window.location.reload();
    } else {
      alert(t("settingsSaveFailed"));
    }
  };

  if (!mounted || !i18n.isInitialized) return null;

  return (
    <div className="flex flex-col text-white">
      <div className="flex gap-4">
        <div className="w-full space-y-4 bg-[#022A52] py-4 px-6 rounded-md">
          {/* NOTIFICHE STANDARD */}
          <div className="mb-8">
            <h4 className="text-[#ffffffa6] mb-4">{t("notifications")}</h4>

            {/* MANUTENZIONI */}
            <div className="flex items-center mb-4">
              <div>
                <p className="text-[18px] text-[#fff]">{t("maintenance_title")}</p>
                <p className="text-[16px] text-[#ffffffa6]">
                  {t("maintenance_desc")}
                </p>
              </div>
              <div className="ml-auto">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNotificationsEnabledMaintenance}
                    onChange={() =>
                      setIsNotificationsEnabledMaintenance((prev) => !prev)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-500 rounded-full peer peer-checked:bg-[#4cd964] transition-colors">
                    <div
                      className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        isNotificationsEnabledMaintenance ? "translate-x-5" : ""
                      }`}
                    />
                  </div>
                </label>
              </div>
            </div>

            {isNotificationsEnabledMaintenance && (
              <div className="mt-2">
                <label className="text-[#789fd6] block mb-2">
                  {t("maintenance_frequency_label")}
                </label>
                <select
                  value={maintenanceFrequency}
                  onChange={(e) => setMaintenanceFrequency(e.target.value)}
                  className="w-full bg-[#ffffff10] text-white px-4 py-2 rounded-md"
                >
                  <option value="giornaliero">{t("daily")}</option>
                  <option value="settimanale">{t("weekly")}</option>
                  <option value="mensile">{t("monthly")}</option>
                  <option value="annuale">{t("annual")}</option>
                </select>
              </div>
            )}

            {/* CHECKLIST */}
            <div className="flex items-center mt-6">
              <div>
                <p className="text-[18px] text-[#fff]">{t("checklist_title")}</p>
                <p className="text-[16px] text-[#ffffffa6]">
                  {t("checklist_desc")}
                </p>
              </div>
              <div className="ml-auto">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNotificationsEnabledChecklist}
                    onChange={() =>
                      setIsNotificationsEnabledChecklist((prev) => !prev)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-500 rounded-full peer peer-checked:bg-[#4cd964] transition-colors">
                    <div
                      className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        isNotificationsEnabledChecklist ? "translate-x-5" : ""
                      }`}
                    />
                  </div>
                </label>
              </div>
            </div>

            {isNotificationsEnabledChecklist && (
              <div className="mt-2">
                <label className="text-[#789fd6] block mb-2">
                  {t("checklist_frequency_label")}
                </label>
                <select
                  value={checklistFrequency}
                  onChange={(e) => setChecklistFrequency(e.target.value)}
                  className="w-full bg-[#ffffff10] text-white px-4 py-2 rounded-md"
                >
                  <option value="giornaliero">{t("daily")}</option>
                  <option value="settimanale">{t("weekly")}</option>
                  <option value="mensile">{t("monthly")}</option>
                  <option value="annuale">{t("annual")}</option>
                </select>
              </div>
            )}
          </div>

          {/* 🔔 NOTIFICHE "UPCOMING" (evento singolo) */}
          <div className="mb-8">
            <h4 className="text-[#ffffffa6] mb-4">
              {t("upcoming_notifications_title")}
            </h4>

            {/* Upcoming manutenzioni */}
            <div className="flex items-center mb-4">
              <div>
                <p className="text-[18px] text-[#fff]">
                  {t("upcoming_maintenance_title")}
                </p>
                <p className="text-[16px] text-[#ffffffa6]">
                  {t("upcoming_maintenance_desc")}
                </p>
              </div>
              <div className="ml-auto">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isUpcomingMaintenanceEnabled}
                    onChange={() =>
                      setIsUpcomingMaintenanceEnabled((prev) => !prev)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-500 rounded-full peer peer-checked:bg-[#4cd964] transition-colors">
                    <div
                      className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        isUpcomingMaintenanceEnabled ? "translate-x-5" : ""
                      }`}
                    />
                  </div>
                </label>
              </div>
            </div>

            {/* Upcoming checklist */}
            <div className="flex items-center mb-4">
              <div>
                <p className="text-[18px] text-[#fff]">
                  {t("upcoming_checklist_title")}
                </p>
                <p className="text-[16px] text-[#ffffffa6]">
                  {t("upcoming_checklist_desc")}
                </p>
              </div>
              <div className="ml-auto">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isUpcomingChecklistEnabled}
                    onChange={() =>
                      setIsUpcomingChecklistEnabled((prev) => !prev)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-500 rounded-full peer peer-checked:bg-[#4cd964] transition-colors">
                    <div
                      className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        isUpcomingChecklistEnabled ? "translate-x-5" : ""
                      }`}
                    />
                  </div>
                </label>
              </div>
            </div>

            {/* Upcoming ricambi da ordinare */}
            <div className="flex items-center mb-2">
              <div>
                <p className="text-[18px] text-[#fff]">
                  {t("upcoming_spare_title")}
                </p>
                <p className="text-[16px] text-[#ffffffa6]">
                  {t("upcoming_spare_desc")}
                </p>
              </div>
              <div className="ml-auto">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isUpcomingSpareEnabled}
                    onChange={() => setIsUpcomingSpareEnabled((prev) => !prev)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-500 rounded-full peer peer-checked:bg-[#4cd964] transition-colors">
                    <div
                      className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        isUpcomingSpareEnabled ? "translate-x-5" : ""
                      }`}
                    />
                  </div>
                </label>
              </div>
            </div>
            <p className="text-xs text-[#ffffff80] mt-2">
              {t("upcoming_note_impianti_selection")}
            </p>
          </div>

          {/* 📅 PLANNING MANUTENTIVI */}
          <div className="mb-8">
            <h4 className="text-[#ffffffa6] mb-4">
              {t("planning_notifications_title")}
            </h4>

            {/* Planning manutenzioni */}
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <div>
                  <p className="text-[18px] text-[#fff]">
                    {t("planning_maintenance_title")}
                  </p>
                  <p className="text-[16px] text-[#ffffffa6]">
                    {t("planning_maintenance_desc")}
                  </p>
                </div>
                <div className="ml-auto">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPlanningMaintenanceEnabled}
                      onChange={() =>
                        setIsPlanningMaintenanceEnabled((prev) => !prev)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-500 rounded-full peer peer-checked:bg-[#4cd964] transition-colors">
                      <div
                        className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          isPlanningMaintenanceEnabled ? "translate-x-5" : ""
                        }`}
                      />
                    </div>
                  </label>
                </div>
              </div>

              {isPlanningMaintenanceEnabled && (
                <div className="mt-2">
                  <label className="text-[#789fd6] block mb-2">
                    {t("planning_frequency_label")}
                  </label>
                  <select
                    value={planningMaintenanceFrequency}
                    onChange={(e) =>
                      setPlanningMaintenanceFrequency(e.target.value)
                    }
                    className="w-full bg-[#ffffff10] text-white px-4 py-2 rounded-md"
                  >
                    <option value="giornaliero">{t("daily")}</option>
                    <option value="settimanale">{t("weekly")}</option>
                    <option value="mensile">{t("monthly")}</option>
                  </select>
                </div>
              )}
            </div>

            {/* Planning checklist */}
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <div>
                  <p className="text-[18px] text-[#fff]">
                    {t("planning_checklist_title")}
                  </p>
                  <p className="text-[16px] text-[#ffffffa6]">
                    {t("planning_checklist_desc")}
                  </p>
                </div>
                <div className="ml-auto">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPlanningChecklistEnabled}
                      onChange={() =>
                        setIsPlanningChecklistEnabled((prev) => !prev)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-500 rounded-full peer peer-checked:bg-[#4cd964] transition-colors">
                      <div
                        className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          isPlanningChecklistEnabled ? "translate-x-5" : ""
                        }`}
                      />
                    </div>
                  </label>
                </div>
              </div>

              {isPlanningChecklistEnabled && (
                <div className="mt-2">
                  <label className="text-[#789fd6] block mb-2">
                    {t("planning_frequency_label")}
                  </label>
                  <select
                    value={planningChecklistFrequency}
                    onChange={(e) =>
                      setPlanningChecklistFrequency(e.target.value)
                    }
                    className="w-full bg-[#ffffff10] text-white px-4 py-2 rounded-md"
                  >
                    <option value="giornaliero">{t("daily")}</option>
                    <option value="settimanale">{t("weekly")}</option>
                    <option value="mensile">{t("monthly")}</option>
                  </select>
                </div>
              )}
            </div>

            {/* Planning ricambi */}
            <div className="mb-2">
              <div className="flex items-center mb-2">
                <div>
                  <p className="text-[18px] text-[#fff]">
                    {t("planning_spare_title")}
                  </p>
                  <p className="text-[16px] text-[#ffffffa6]">
                    {t("planning_spare_desc")}
                  </p>
                </div>
                <div className="ml-auto">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPlanningSpareEnabled}
                      onChange={() =>
                        setIsPlanningSpareEnabled((prev) => !prev)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-500 rounded-full peer peer-checked:bg-[#4cd964] transition-colors">
                      <div
                        className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          isPlanningSpareEnabled ? "translate-x-5" : ""
                        }`}
                      />
                    </div>
                  </label>
                </div>
              </div>

              {isPlanningSpareEnabled && (
                <div className="mt-2">
                  <label className="text-[#789fd6] block mb-2">
                    {t("planning_frequency_label")}
                  </label>
                  <select
                    value={planningSpareFrequency}
                    onChange={(e) =>
                      setPlanningSpareFrequency(e.target.value)
                    }
                    className="w-full bg-[#ffffff10] text-white px-4 py-2 rounded-md"
                  >
                    <option value="giornaliero">{t("daily")}</option>
                    <option value="settimanale">{t("weekly")}</option>
                    <option value="mensile">{t("monthly")}</option>
                  </select>
                </div>
              )}
            </div>

            <p className="text-xs text-[#ffffff80] mt-2">
              {t("planning_note_impianti_selection")}
            </p>
          </div>

          {/* SUPPORTO */}
          <div className="mb-8">
            <h4 className="text-[#ffffffa6] mb-4">{t("support")}</h4>
            <div className="flex items-center mb-4">
              <div>
                <p className="text-[18px] text-[#fff]">{t("support_title")}</p>
                <p className="text-[16px] text-[#ffffffa6]">
                  {t("support_desc")}
                </p>
              </div>
              <div className="ml-auto cursor-pointer">
                <Link
                  href="/dashboard/remoteAssistance"
                  className="flex items-center px-4 py-2 cursor-pointer"
                >
                  <svg
                    fill="white"
                    height="16px"
                    width="16px"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 320 512"
                  >
                    <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* LICENZA */}
          <div className="mb-8">
            <h4 className="text-[#ffffffa6] mb-4">{t("licenses")}</h4>
            <div className="mb-4">
              <label className="text-[#789fd6] block mb-2">
                {t("license_label")}
              </label>
              <input
                type="text"
                value={license}
                placeholder={t("license_label")}
                onChange={(e) => setLicense(e.target.value)}
                className="w-full px-4 py-2 bg-[#ffffff10] text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          </div>

          {/* LINGUA */}
          <div className="mb-8">
            <h4 className="text-[#ffffffa6] mb-4">{t("language")}</h4>
            <div className="mb-4">
              <label className="text-[#789fd6] block mb-2">
                {t("language_label")}
              </label>
              <select
                className="w-full px-4 py-2 bg-[#ffffff10] text-white"
                value={i18n.language}
                onChange={(e) => {
                  const newLang = e.target.value;
                  i18n.changeLanguage(newLang);
                  localStorage.setItem("language", newLang);
                }}
              >
                <option value="it">Italiano</option>
                <option value="en">English</option>
                <option value="es">Spanish</option>
              </select>
            </div>
          </div>

          {/* SALVA */}
          <button
            type="submit"
            onClick={handleSaveSettings}
            className="rounded-sm mt-6 w-full bg-[#789fd6] hover:bg-blue-500 text-white font-bold py-4 px-4 transition duration-200 cursor-pointer"
          >
            {t("save_button")}
          </button>
        </div>
      </div>
    </div>
  );
}

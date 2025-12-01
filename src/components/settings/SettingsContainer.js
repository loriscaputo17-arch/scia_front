"use client";

import { useEffect, useState } from "react";
import InfoCard from "@/components/profile/InfoCard";
import Link from "next/link";
import { getSettings, updateSettings } from "@/api/settings";
import { useUser } from "@/context/UserContext";
import { useTranslation } from "@/app/i18n";

export default function SettingsContainer() {
  const [isNotificationsEnabledMaintenance, setIsNotificationsEnabledMaintenance] = useState(false);
  const [isNotificationsEnabledChecklist, setIsNotificationsEnabledChecklist] = useState(false);
  const [maintenanceFrequency, setMaintenanceFrequency] = useState("settimanale");
  const [checklistFrequency, setChecklistFrequency] = useState("settimanale");
  const [license, setLicense] = useState("");
  const [language, setLanguage] = useState("it");

  const { user } = useUser();
  const { t, i18n } = useTranslation("settings");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const langFromStorage = typeof window !== "undefined" ? localStorage.getItem("language") : null;

    if (langFromStorage && i18n.language !== langFromStorage) {
      i18n.changeLanguage(langFromStorage);
    }
    setMounted(true);
  }, [i18n]);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) return;

      const data = await getSettings(user.id);
      if (data) {
        setIsNotificationsEnabledMaintenance(data.is_notifications_enabled_maintenance || false);
        setMaintenanceFrequency(data.maintenance_frequency || "mensile");
        setIsNotificationsEnabledChecklist(data.is_notifications_enabled_checklist || false);
        setChecklistFrequency(data.checklist_frequency || "mensile");
        setLicense(data.license || "");
      }
    };

    fetchSettings();
  }, [user]);

  const handleSaveSettings = async () => {
    if (!user) {
      console.error("Errore: user è null o undefined");
      alert(t("error.userNotFound"));
      return;
    }

    const userId = user.id;

    const payload = {
      user_id: userId,
      isNotificationsEnabledMaintenance,
      maintenanceFrequency,
      isNotificationsEnabledChecklist,
      checklistFrequency,
      license,
    };

    const success = await updateSettings(payload);

    if (success) {
      alert(t("settingsSaved"));
    } else {
      alert(t("settingsSaveFailed"));
    }
  };

  if (!mounted || !i18n.isInitialized) return null;

  return (
    <div className="flex flex-col text-white">
      <div className="flex gap-4">
        <div className="w-full space-y-4 bg-[#022A52] py-4 px-6 rounded-md">
          <div className="mb-8">
            <h4 className="text-[#ffffffa6] mb-4">{t("notifications")}</h4>

            {/* MANUTENZIONI */}
            <div className="flex items-center mb-4">
              <div>
              <p className="text-[18px] text-[#fff]">{t('maintenance_title')}</p>
                              <p className="text-[16px] text-[#ffffffa6]">{t("maintenance_desc")}</p>
              </div>
              <div className="ml-auto">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNotificationsEnabledMaintenance}
                    onChange={() => setIsNotificationsEnabledMaintenance(!isNotificationsEnabledMaintenance)}
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
                <label className="text-[#789fd6] block mb-2">{t("maintenance_frequency_label")}</label>
                <select
                  value={maintenanceFrequency}
                  onChange={(e) => setMaintenanceFrequency(e.target.value)}
                  className="w-full bg-[#ffffff10] text-white px-4 py-2 rounded-md"
                >
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
                <p className="text-[16px] text-[#ffffffa6]">{t("checklist_desc")}</p>
              </div>
              <div className="ml-auto">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNotificationsEnabledChecklist}
                    onChange={() => setIsNotificationsEnabledChecklist(!isNotificationsEnabledChecklist)}
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
                <label className="text-[#789fd6] block mb-2">{t("checklist_frequency_label")}</label>
                <select
                  value={checklistFrequency}
                  onChange={(e) => setChecklistFrequency(e.target.value)}
                  className="w-full bg-[#ffffff10] text-white px-4 py-2 rounded-md"
                >
                  <option value="settimanale">{t("weekly")}</option>
                  <option value="mensile">{t("monthly")}</option>
                  <option value="annuale">{t("annual")}</option>
                </select>
              </div>
            )}
          </div>

          {/* SUPPORTO */}
          <div className="mb-8">
            <h4 className="text-[#ffffffa6] mb-4">{t("support")}</h4>
            <div className="flex items-center mb-4">
              <div>
                <p className="text-[18px] text-[#fff]">{t("support_title")}</p>
                <p className="text-[16px] text-[#ffffffa6]">{t("support_desc")}</p>
              </div>
              <div className="ml-auto cursor-pointer">
                <Link href="/dashboard/remoteAssistance" className="flex items-center px-4 py-2 cursor-pointer">
                  <svg fill="white" height="16px" width="16px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                    <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* LICENZA */}
          <div className="mb-8">
            <h4 className="text-[#ffffffa6] mb-4">{t("licenses")}</h4>
            <div className="mb-4">
              <label className="text-[#789fd6] block mb-2">{t("license_label")}</label>
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
              <label className="text-[#789fd6] block mb-2">{t("language_label")}</label>
              <select
                className="w-full px-4 py-2 bg-[#ffffff10] text-white"
                value={i18n.language}
                onChange={(e) => {
                  const newLang = e.target.value;
                  i18n.changeLanguage(newLang);
                  localStorage.setItem("language", newLang);  // <-- qui
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

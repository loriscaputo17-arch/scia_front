"use client";

import { useState, useEffect } from "react";
import Image from 'next/image';
import SpareModal from "./SpareModal";
import FacilitiesModal from "@/components/failures/FacilitiesModal";
import { getProfileById, getRanks } from "@/api/profile";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/app/i18n";

const MaintenanceInfo = ({ details }) => {
  const [showFull, setShowFull] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [facilitiesOpen, setFacilitiesOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [userRank, setUserRank] = useState(null);
  const [militaryRanks, setMilitaryRanks] = useState([]);
  const router = useRouter();
  const [profileImage, setProfileImage] = useState("/icons/profile-default.svg");

  const { t } = useTranslation("failures");

  useEffect(() => {
    const fetchProfile = async () => {
      if (details.userExecution) {
        const data = await getProfileById(details.userExecution);
        if (data) {
          setProfile(data);
          setProfileImage(data.profileImage || "/icons/profile-default.svg");
        }
      }
    };
    fetchProfile();
  }, [details.userExecution]);

  useEffect(() => {
    async function fetchRanks() {
      const ranks = await getRanks();
      setMilitaryRanks(ranks);
    }
    fetchRanks();
  }, []);

  useEffect(() => {
    if (profile && militaryRanks.length > 0) {
      const foundRank = militaryRanks.find((r) => r.id === Number(profile.rank));
      setUserRank(foundRank);
    }
  }, [profile, militaryRanks]);

  let customFields = [];
  try {
    customFields = typeof details.customFields === "string"
      ? JSON.parse(details.customFields)
      : details.customFields;
  } catch (error) {
    console.error("Errore nel parsing di customFields", error);
  }

  const componentName =
    details.element?.element_model?.LCN_name || details.component_name;
  const componentEswbs =
    details.element?.element_model?.ESWBS_code || details.eswbs_code;

  return (
    <div className="p-2">

      <div className="mb-6">
        <h2 className="text-lg text-[#789fd6] mb-2">{t("user")}</h2>

        <div className="flex items-center gap-4 rounded-lg transition">
          <img src={profileImage} alt="User Avatar" className="w-14 h-14 rounded-full object-cover" />

          <div className="overflow-hidden">
            {profile ? (
              <>
                <p className="text-sm text-[#789fd6]">
                  {userRank
                    ? (userRank.grado.length > 25 ? userRank.grado.substring(0, 25) + '...' : userRank.grado)
                    : t("rank_not_found")}
                </p>
                <p className="text-lg font-semibold whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[150px] sm:max-w-[200px]">
                  {profile.firstName} {profile.lastName}
                </p>
                <p className="text-sm text-[#ffffffa6]">{profile.type}</p>
              </>
            ) : (
              <p className="text-white text-sm">{t("loading")}</p>
            )}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg text-[#789fd6] mb-2">{t("desription")}</h2>

        <p
          className={`text-white ${
            showFull ? "" : "line-clamp-2 overflow-hidden text-ellipsis whitespace-normal"
          }`}
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: showFull ? "unset" : 2,
            overflow: "hidden",
          }}
        >
          {details.description}
        </p>

        {!showFull && (
          <button
            className="mt-2 text-sm text-[#fff] w-fit cursor-pointer bg-[#ffffff1a] py-1 px-4 rounded mt-2"
            onClick={() => setShowFull(true)}
          >
            {t("details")}
          </button>
        )}
      </div>

      {isOpen && <SpareModal onClose={() => setIsOpen(false)} />}

      <div className="mb-6">
        <div className="flex items-center mb-2 mt-4">
          <h2 className="text-lg text-[#789fd6]">{t("system")}/{t("component")}</h2>
        </div>

        {(componentEswbs || componentName) ? (
          <div
            onClick={() => details.element_id && router.push(`/dashboard/impianti/${details.element_id}`)}
            className={`flex items-center gap-4 ${details.element_id ? "cursor-pointer hover:bg-[#ffffff0a] rounded-md -mx-2 px-2 py-1 transition" : ""}`}
          >
            <div className="min-w-0">
              {componentEswbs && (
                <p className="text-sm text-[#789fd6] font-mono">{componentEswbs}</p>
              )}
              <h2 className="text-md text-[#fff] truncate">{componentName || "—"}</h2>
            </div>
            {details.element_id && (
              <div className="ml-auto mr-2">
                <svg fill="white" width="16px" height="16px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                  <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/>
                </svg>
              </div>
            )}
          </div>
        ) : (
          <p className="text-white/40 text-sm">{t("no_component")}</p>
        )}
      </div>

      <div className="mb-6">
        <div className="flex items-center mb-2 mt-4">
          <h2 className="text-lg text-[#789fd6]">{t("date_of_insertion")}</h2>
        </div>
        <div className="flex items-center gap-4">
          <p>{details.date}</p>
        </div>
      </div>

      {customFields.map((field, index) => (
        <div key={index} className="mb-6">
          <div className="flex items-center mb-2 mt-4">
            <h2 className="text-lg text-[#ee81e5]">{field.name}</h2>
          </div>
          <div className="flex items-center gap-4">
            <p>{field.value}</p>
          </div>
        </div>
      ))}

      <FacilitiesModal isOpen={facilitiesOpen} onClose2={() => setFacilitiesOpen(false)} />
    </div>
  );
};

export default MaintenanceInfo;
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import PasswordModal from "./PasswordModal";
import ImageProfileUpload from "./ImageProfileUpload";
import { updateProfileData, getRanks } from "@/api/profile";
import { useTranslation } from "@/app/i18n";

export default function InfoCard({ data }) {
  const [isOpen, setIsOpen] = useState(false);
  const [firstName, setFirstName] = useState(data?.firstName || "");
  const [lastName, setLastName] = useState(data?.lastName || "");
  const [email, setEmail] = useState(data?.email || "");
  const [phone, setPhone] = useState(data?.phoneNumber || "");
  const [rank, setRank] = useState(data?.rank || "");
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false); 
  const [militaryRanks, setMilitaryRanks] = useState("false"); 
  const [selectedRank, setSelectedRank] = useState(null);

  const { t, i18n } = useTranslation("profile");
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const data = await getRanks();
      setMilitaryRanks(data);

      const defaultRank = data.find((r) => r.grado === data?.rank) || data[0];
      setSelectedRank(defaultRank);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      setFirstName(data.firstName || "");
      setLastName(data.lastName || "");
      setEmail(data.email || "");
  
      const rankId = Number(data.rank);
      const foundRank = militaryRanks.find((r) => r.id === rankId);
  
      if (foundRank) setRank(foundRank);
  
      setPhone(data.phoneNumber || "");
      setSelectedRank(foundRank || militaryRanks[0]);
    }
  }, [data]);
  
  const [isOpen2, setIsOpen2] = useState(false);

  async function handleSave() {

    const updatedData = {
      userId: data?.id,
      firstName,
      lastName,
      email,
      phoneNumber: phone,
      rank: selectedRank?.id || rank,
    };

    const response = await updateProfileData(updatedData);
    if (response) {
      alert("Profilo aggiornato con successo");
    } else {
      console.error("Errore nell'aggiornamento del profilo");
    }
  }

  const [profileImage, setProfileImage] = useState("/icons/profile-default.svg");

  useEffect(() => {
    if (data?.profileImage) {
      setProfileImage(data.profileImage);
    }
  }, [data]);

  const onImageUploadSuccess = (newImageUrl) => {
    setProfileImage(newImageUrl);
  };

  const translateRank = (rank) => {
      const key = `${rank}`; 
      const translated = t(key);

      return translated === key ? rank : translated;
};

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !i18n.isInitialized) return null;

  return (
    <div className="bg-[#022a52] p-2 rounded-lg shadow-md text-white w-full">
      <div className="flex items-center mb-4">
        <Image
          src={profileImage || "/icons/profile-default.svg"}
          alt="Profile Picture"
          width={80}
          height={80}
          className="rounded-full object-cover w-[80px] h-[80px] cursor-pointer"
          onClick={() => setIsImagePopupOpen(true)}
        /> 

      </div>

      {isImagePopupOpen && (
        <ImageProfileUpload onClose={() => setIsImagePopupOpen(false)} onImageUploadSuccess={onImageUploadSuccess} />
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
        <div className="rounded-md text-left">
          <h3 className="text-sm text-[#789FD6] font-semibold mb-2">{t("type")}</h3>
          <p className="text-lg">{data?.type}</p>
        </div>

        <div className="rounded-md text-left">
          <h3 className="text-sm text-[#789FD6] font-semibold mb-2">{t("responsible")}</h3>
          <p className="text-lg">{data?.teamLeader?.firstName} {data?.teamLeader?.lastName}</p>
        </div>

        <div className="rounded-md text-left">
          <h3 className="text-sm text-[#789FD6] font-semibold mb-2">{t("team")}</h3>
          <p className="text-lg">{data?.team?.name}</p>
        </div>

        <div className="rounded-md text-left">
          <h3 className="text-sm text-[#789FD6] font-semibold mb-2">{t("subscription_date")}</h3>
          <p className="text-lg">
            {data?.registrationDate
              ? new Date(data.registrationDate).toLocaleDateString("it-IT")
              : "N/A"}
          </p>          
        </div>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
  <div className="flex flex-col">
    <label className="text-[#789FD6] text-sm mb-2">{t("name")}</label>
    <input
      type="text"
      value={firstName}
      onChange={(e) => setFirstName(e.target.value)}
      className="px-4 py-2 bg-[#ffffff10] text-white focus:outline-none rounded-md"
    />
  </div>

  <div className="flex flex-col">
    <label className="text-[#789FD6] text-sm mb-2">{t("surname")}</label>
    <input
      type="text"
      value={lastName}
      onChange={(e) => setLastName(e.target.value)}
      className="px-4 py-2 bg-[#ffffff10] text-white focus:outline-none rounded-md"
    />
  </div>

  <div className="flex flex-col">
    <label className="text-[#789FD6] text-sm mb-2">{t("email")}</label>
    <input
      type="text"
      value={email}
      disabled
      className="px-4 py-2 bg-[#ffffff10] text-white opacity-50 cursor-not-allowed rounded-md"
    />

  </div>

  <div className="flex flex-col">
    <label className="text-[#789FD6] text-sm mb-2">{t("phone")}</label>
    <input
      type="text"
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
      className="px-4 py-2 bg-[#ffffff10] text-white focus:outline-none rounded-md"
    />
  </div>

  <div className="flex flex-col relative">
    <label className="text-[#789FD6] text-sm mb-2">{t("rank")}</label>

    <button
      onClick={() => setIsOpen2(!isOpen2)}
      className="flex items-center w-full px-4 py-2 bg-[#ffffff10] text-white focus:outline-none rounded-md"
    >
      {selectedRank && (
        <>
          <img
            src={selectedRank.distintivo_controspallina}
            alt={selectedRank.grado}
            className="w-4 h-8 mr-2"
          />
          {t(selectedRank.grado)}
        </>
      )}
      <span className="ml-auto">▼</span>
    </button>

    {isOpen2 && (
      <ul
        style={{ overflowY: "scroll", height: '25vh', width: '30vw' }}
        className="absolute w-[50%] top-[100%] bg-[#022a52] text-white mt-1 rounded-md shadow-md"
      >
        {militaryRanks.map((rank, index) => (
          <li
            key={index}
            className="flex items-center px-4 py-2 hover:bg-[#789FD6] cursor-pointer"
            onClick={() => {
              setSelectedRank(rank);
              setIsOpen2(false);
            }}
          >
            <img
              src={rank.distintivo_controspallina}
              alt={rank.grado}
              className="w-6 h-12 mr-2"
            />
            {translateRank(rank.grado)} 
          </li>
        ))}
      </ul>
    )}
  </div>

  <div className="flex flex-col">
    <label className="text-[#789FD6] text-sm mb-4">{t("security")}</label>
    <button className="items-center flex cursor-pointer" onClick={() => setIsOpen(true)}>
      <p>{t("password_set_and_pin")}</p>
      <svg 
        width="18px"
        height="18px" 
        className="ml-auto"
        fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
        <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/>
      </svg>
    </button>
  </div>
</div>

      
      <button className="w-full bg-[#789fd6] mt-4 cursor-pointer p-3 rounded-md text-white font-semibold" onClick={handleSave}>
        {t("save")}
      </button>

      {isOpen && <PasswordModal userId={data?.id} onClose={() => setIsOpen(false)} />}
      
    </div>
  );
}

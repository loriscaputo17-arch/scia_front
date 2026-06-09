"use client";

import { useEffect, useState } from "react";
import Image from 'next/image';
import AudioPlayer from "@/components/element/audioPlayer";
import NoteHistoryModal from "@/components/maintenance/element/NoteHistoryModal";
import PhotoHistoryModal from "@/components/maintenance/element/PhotoHistoryModal";
import TextHistoryModal from "@/components/maintenance/element/TextHistoryModal";
import { getTexts, getPhotos, getAudios } from "@/api/shipFiles";
import { useTranslation } from "@/app/i18n";

const MaintenanceDetails = ({ details }) => {
  const [noteHistoryModal, setNoteHistoryModal] = useState(false);
  const [textHistoryModal, setTextHistoryModal] = useState(false);
  const [photoHistoryModal, setPhotoHistoryModal] = useState(false);

  const [latestPhoto, setLatestPhoto] = useState(null);
  const [latestAudio, setLatestAudio] = useState(null);
  const [latestText, setLatestText] = useState(null);
  const { t } = useTranslation("maintenance");

  useEffect(() => {
    if (!details?.id) return;

    const fetchLatestNotes = async () => {
      try {
        const [photos, audios, texts] = await Promise.all([
          getPhotos(details.id, "failure"),
          getAudios(details.id, "failure"),
          getTexts(details.id, "failure"),
        ]);

        const byDate = (arr = []) =>
          [...arr].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        setLatestPhoto(byDate(photos?.notes)[0] || null);
        setLatestAudio(byDate(audios?.notes)[0] || null);
        setLatestText(byDate(texts?.notes)[0] || null);
      } catch (error) {
        console.error("Errore nel recupero delle note:", error);
      }
    };

    fetchLatestNotes();
  }, [details.id]);

  const authorName = (note) =>
    `${note?.authorDetails?.first_name || t("operator")} ${note?.authorDetails?.last_name || ""}`.trim();

  const authorInitials = (note) =>
    `${note?.authorDetails?.first_name?.[0] ?? "?"}${note?.authorDetails?.last_name?.[0] ?? ""}`;

  return (
    <div className="p-2 w-full">

      {/* FOTO */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <h2 className="text-lg text-[#789fd6]">{t("photohistory_title")}</h2>
          <button className="text-[14px] text-[#fff] ml-auto cursor-pointer" onClick={() => setPhotoHistoryModal(true)}>
            {t("see_history")}
          </button>
        </div>

        {latestPhoto && (
          <div className="flex items-center gap-4 cursor-pointer">
            <Image
              src={latestPhoto.image_url}
              alt="Foto nota"
              width={80}
              height={80}
              className="rounded-lg"
              style={{ width: "80px", height: "80px", objectFit: "cover" }}
            />
            <div>
              <h2 className="text-md text-[#fff]">{authorName(latestPhoto)}</h2>
              <h2 className="text-[14px] text-[#ffffff94]">{new Date(latestPhoto.created_at).toLocaleString()}</h2>
            </div>
            <div className="ml-auto">
              <svg fill="white" width="16px" height="16px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/>
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* AUDIO */}
      <div className="mb-6">
        <div className="flex items-center mb-2 mt-4">
          <h2 className="text-lg text-[#789fd6]">{t("audiohistory_title")}</h2>
          <button className="text-[14px] text-[#fff] ml-auto cursor-pointer" onClick={() => setNoteHistoryModal(true)}>
            {t("see_history")}
          </button>
        </div>

        {latestAudio && (
          <div className="flex items-center gap-4 cursor-pointer">
            <div className="w-full">
              <AudioPlayer
                audioSrc={latestAudio.audio_url}
                username={authorInitials(latestAudio)}
                dateTime={latestAudio.created_at}
              />
            </div>
          </div>
        )}
      </div>

      {/* TESTO */}
      <div className="mb-6">
        <div className="flex items-center mb-2 mt-4">
          <h2 className="text-lg text-[#789fd6]">{t("texthistory_title")}</h2>
          <button className="text-[14px] text-[#fff] ml-auto cursor-pointer" onClick={() => setTextHistoryModal(true)}>
            {t("see_history")}
          </button>
        </div>

        {latestText && (
          <div className="flex items-center gap-4 cursor-pointer">
            <div className="w-full bg-[#00000038] p-4 rounded-md">
              <p className="text-white text-[12px] opacity-60">{authorName(latestText)}</p>
              <p className="text-white text-[16px] mt-2 mb-2">{latestText.text_field}</p>
              <p className="text-white opacity-60 text-sm ml-auto w-fit">{new Date(latestText.created_at).toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>

      {/* MODALI */}
      {noteHistoryModal && (
        <NoteHistoryModal onClose={() => setNoteHistoryModal(false)} failureId={details.id} />
      )}
      {photoHistoryModal && (
        <PhotoHistoryModal onClose={() => setPhotoHistoryModal(false)} failureId={details.id} />
      )}
      {textHistoryModal && (
        <TextHistoryModal onClose={() => setTextHistoryModal(false)} failureId={details.id} />
      )}
    </div>
  );
};

export default MaintenanceDetails;
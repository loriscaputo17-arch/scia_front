"use client";

import { useState, useEffect } from "react";
import Image from 'next/image';
import AudioPlayer from "@/components/element/audioPlayer";
import NoteHistoryModal from "@/components/maintenance/element/NoteHistoryModal";
import PhotoHistoryModal from "@/components/maintenance/element/PhotoHistoryModal";
import TextHistoryModal from "@/components/maintenance/element/TextHistoryModal";
import { useTranslation } from "@/app/i18n";
import { markAs } from "@/api/maintenance";
import { useRouter } from "next/navigation"; 
import { getTextsGeneral, getPhotosGeneral, getAudiosGeneral } from "@/api/shipFiles";
import { addPhotographicNoteGeneral, addVocalNoteGeneral, addTextNoteGeneral } from "@/api/failures";
import ConfirmMaintenance from "./ConfirmMaintenance";
import { useUser } from "@/context/UserContext";

const MaintenanceDetails = ({ details }) => {
  const [showFull, setShowFull] = useState(false);
  const [noteHistoryModal, setNoteHistoryModal] = useState(false);
  const [textHistoryModal, setTextHistoryModal] = useState(false);
  const [photoHistoryModal, setPhotoHistoryModal] = useState(false);
  const router = useRouter();
  const [latestPhoto, setLatestPhoto] = useState(null);
  const [latestAudio, setLatestAudio] = useState(null);
  const [latestText, setLatestText] = useState(null);
  const [markAsOk, setMarkAsOk] = useState(false);
  const { t, i18n } = useTranslation("maintenance");
  const [mounted, setMounted] = useState(false);

  const { getNotes, clearNotes, user } = useUser();

  useEffect(() => {
    setMounted(true);
  }, []);

  const uploadNotesToDb = async (status) => {
    const failureId = details[0]?.id;
    const notes = getNotes(failureId);

    try {
      // Foto
      for (const photoFile of notes.photo || []) {
        const formData = new FormData();
        formData.append("file", photoFile);
        formData.append("failureId", failureId);
        formData.append("authorId", user.id);
        formData.append("type", "maintenance");
        formData.append("status", status);
        
        await addPhotographicNoteGeneral(formData);
      }

      // Audio
      for (const audioFile of notes.vocal || []) {
        const formData = new FormData();
        formData.append("file", audioFile);
        formData.append("failureId", failureId);
        formData.append("authorId", user.id);
        formData.append("type", "maintenance");
        formData.append("status", status);

        await addVocalNoteGeneral(formData);
      }

      // Testo
      for (const text of notes.text || []) {
        await addTextNoteGeneral({
          content: text,
          failureId,
          authorId: user.id,
          type: "maintenance",
          status: status
        });
      }

      clearNotes(failureId);
    } catch (error) {
      console.error("Errore nel caricamento delle note:", error);
    }
  };

  const handleOk = async (status) => {
    setMarkAsOk(true);
  };

  const handleAnomaly = async (status) => {
    //await uploadNotesToDb(status);
    await markAs(details[0]?.id, 2);
    window.location.reload();
  };

  const handleNotPerformed = async (status) => {
    await uploadNotesToDb(status);
    await markAs(details[0]?.id, 3);
    window.location.reload();
  };

  useEffect(() => {
    if (!details[0]?.id) return;

    const fetchLatestNotes = async () => {
      try {
        const [photos, audios, texts] = await Promise.all([
          getPhotosGeneral(details[0]?.id, "maintenance"),
          getAudiosGeneral(details[0]?.id, "maintenance"),
          getTextsGeneral(details[0]?.id, "maintenance"),
        ]);

        if (photos?.notes?.length) {
          const sortedPhotos = [...photos.notes].sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
          setLatestPhoto(sortedPhotos[0]);
        }

        if (audios?.notes?.length) {
          const sortedAudios = [...audios.notes].sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
          setLatestAudio(sortedAudios[0]);
        }

        if (texts?.notes?.length) {
          const sortedTexts = [...texts.notes].sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
          setLatestText(sortedTexts[0]);
        }


      } catch (error) {
        console.error("Errore nel recupero delle note:", error);
      }
    };

    fetchLatestNotes();
  }, [details[0]?.id]);

  if (!mounted || !i18n.isInitialized) return null;

  return (
    <div className="p-2 w-full">

      <div className="mb-8">
        <div className="flex items-center mb-2">
          <h2 className="text-lg text-[#789fd6]">{t("photographic_notes")}</h2>
          <button className="text-[14px] text-[#fff] ml-auto cursor-pointer" onClick={() => setPhotoHistoryModal(true)}>{t("see_history")}</button>
        </div>
        {latestPhoto && (
          <div className="flex items-center gap-4 cursor-pointer">
            <Image 
              src={latestPhoto.image_url}
              alt="Foto nota"
              width={80}
              height={80}
              className="rounded-lg"
              style={{width: "80px", height: "80px", objectFit: "cover"}}
            />
            <div>
              <h2 className="text-md text-[#fff]">{latestPhoto.authorDetails.first_name} {latestPhoto.authorDetails.last_name}</h2>
              <h2 className="text-[14px] text-[#ffffff94]">{new Date(latestPhoto.created_at).toLocaleString()}</h2>
            </div>
          </div>
        )}
      </div>

      <div className="mb-8">
        <div className="flex items-center mb-2 mt-4">
          <h2 className="text-lg text-[#789fd6]">{t("vocal_note")}</h2>
          <button className="text-[14px] text-[#fff] ml-auto cursor-pointer" onClick={() => setNoteHistoryModal(true)}>{t("see_history")}</button>
        </div>
        {latestAudio && (
          <div className="flex items-center gap-4 cursor-pointer">
            <div className="w-full">
              <AudioPlayer
                audioSrc={latestAudio.audio_url}
                username={latestAudio.authorDetails.first_name[0] + latestAudio.authorDetails.last_name[0]}
                dateTime={latestAudio.created_at}
              />
            </div>
          </div>
        )}
      </div>

      <div className="mb-8">
        <div className="flex items-center mb-2 mt-4">
          <h2 className="text-lg text-[#789fd6]">{t("text_note")}</h2>
          <button className="text-[14px] text-[#fff] ml-auto cursor-pointer" onClick={() => setTextHistoryModal(true)}>{t("see_history")}</button>
        </div>
        {latestText && (
          <div className="flex items-center gap-4 cursor-pointer">
            <div className="w-full bg-[#00000038] p-4 rounded-md">
              <p className="text-white text-[12px] opacity-60">{latestText.authorDetails.first_name} {latestText.authorDetails.last_name}</p>
              <p className="text-white text-[16px] mt-2 mb-2">{latestText.text_field}</p>
              <p className="text-white opacity-60 text-sm ml-auto w-fit">{new Date(latestText.created_at).toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>

      {/* BOTTONI */}
      <div className="mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => handleOk("ok")}
            className={`cursor-pointer flex items-center justify-center w-full py-6 text-white rounded-md hover:bg-blue-700 transition duration-300 ${
              details[0]?.execution_state === "1" ? "bg-[#2db647]" : "bg-[#15375d]"
            }`}
          >
            <Image src="/done.png" alt="Done" width={20} height={20} className="sm:mr-2" />
            <span className="hidden sm:block">{t("ok")}</span>
          </button>

          <button
            onClick={() => handleAnomaly("anomaly")}
            className={`cursor-pointer flex items-center justify-center w-full py-6 text-white rounded-md hover:bg-blue-700 transition duration-300 ${
              details[0]?.execution_state === "2" ? "bg-[#d0021b]" : "bg-[#15375d]"
            }`}
          >
            <Image src="/x.png" alt="X" width={20} height={20} className="sm:mr-2" />
            <span className="hidden sm:block">{t("anomaly")}</span>
          </button>

          <button
            onClick={() => handleNotPerformed("not_performed")}
            className={`cursor-pointer flex items-center justify-center w-full py-6 text-white rounded-md hover:bg-blue-700 transition duration-300 ${
              details[0]?.execution_state === "3" ? "bg-[#ffbf25]" : "bg-[#15375d]"
            }`}
          >
            <Image src="/time.png" alt="Time" width={20} height={20} className="sm:mr-2" />
            <span className="hidden sm:block">{t("not_perfomed")}</span>
          </button>
        </div>
      </div>

      {noteHistoryModal && <NoteHistoryModal onClose={() => setNoteHistoryModal(false)} failureId={details[0].id} />}
      {photoHistoryModal && <PhotoHistoryModal onClose={() => setPhotoHistoryModal(false)} failureId={details[0].id} />}
      {textHistoryModal && <TextHistoryModal onClose={() => setTextHistoryModal(false)} failureId={details[0].id} />}
      {markAsOk && <ConfirmMaintenance onClose={() => setMarkAsOk(false)} onClick={() => uploadNotesToDb("ok")} maintenanceListId={details[0]?.id} />}
    </div>
  );
};

export default MaintenanceDetails;

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
  const { t, i18n } = useTranslation("maintenance");
  const [mounted, setMounted] = useState(false);

  const { getNotes, clearNotes, user } = useUser();

  useEffect(() => {
    setMounted(true);
  }, []);

  const uploadNotesToDb = async (status) => {
    const failureId = details?.id;
    const notes = getNotes(failureId);

    try {
      for (const photoFile of notes.photo || []) {
        const formData = new FormData();
        formData.append("file", photoFile);
        formData.append("failureId", failureId);
        formData.append("authorId", user.id);
        formData.append("type", "maintenance");
        formData.append("status", status);
        
        await addPhotographicNoteGeneral(formData);
      }

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

  const handleOk = async () => {
    try {
      await uploadNotesToDb("ok");

      await markAsOk(details.id, {
        maintenanceList_id: details.id,
        userId: user?.id,
        userType: "User logged in",
        time: 0,  
        level: null,   
        spares: []     
      });

      clearNotes(details.id);

      window.location.reload();

    } catch (error) {
      console.error("Errore in handleOk()", error);
      alert("❌ Errore durante il completamento della manutenzione");
    }
  };

  const handleAnomaly = async (status) => {
    //await uploadNotesToDb(status);
    await markAs(details.id, 2);
    window.location.reload();
  };

  const handleNotPerformed = async (status) => {
    await uploadNotesToDb(status);
    await markAs(details.id, 3);
    window.location.reload();
  };

  useEffect(() => {
    if (!details.id) return;

    const fetchLatestNotes = async () => {
      try {
        const [photos, audios, texts] = await Promise.all([
          getPhotosGeneral(details.id, "maintenance"),
          getAudiosGeneral(details.id, "maintenance"),
          getTextsGeneral(details.id, "maintenance"),
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
          setLatestText(sortedTexts[0]); // <- CORRETTA
        }


      } catch (error) {
        console.error("Errore nel recupero delle note:", error);
      }
    };

    fetchLatestNotes();
  }, [details.id]);

  if (!mounted || !i18n.isInitialized) return null;

  return (
    <div className="p-2 w-full">

      <div className="mb-8">
        <div className="flex items-center mb-2">
          <h2 className="text-lg text-[#789fd6]">{t("details")}</h2>
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

      <div className="mb-6">
        <div className="flex gap-4">
          {(() => {
            const buttonsDisabled = details?.execution_state !== null;
            return (
              <>
                <button
                                  onClick={() => !buttonsDisabled && handleOk("ok")}
                                  disabled={buttonsDisabled}
                                  className={`cursor-pointer flex items-center justify-center w-full py-6 text-white rounded-md transition duration-300 
                                    ${
                                      buttonsDisabled
                                        ? "bg-gray-600 opacity-40 cursor-not-allowed"
                                        : details[0]?.execution_state === "1"
                                        ? "bg-[#2db647]"
                                        : "bg-[#15375d] hover:bg-blue-700"
                                    }`}
                                >
                                  <Image src="/done.png" alt="Done" width={20} height={20} className="sm:mr-2" />
                                  <span className="hidden sm:block">{t("ok")}</span>
                                </button>

                <button
                                  onClick={() => !buttonsDisabled && handleAnomaly("anomaly")}
                                  disabled={buttonsDisabled}
                                  className={`cursor-pointer flex items-center justify-center w-full py-6 text-white rounded-md transition duration-300 
                                    ${
                                      buttonsDisabled
                                        ? "bg-gray-600 opacity-40 cursor-not-allowed"
                                        : details[0]?.execution_state === "2"
                                        ? "bg-[#d0021b]"
                                        : "bg-[#15375d] hover:bg-blue-700"
                                    }`}
                                >
                                  <Image src="/x.png" alt="X" width={20} height={20} className="sm:mr-2" />
                                  <span className="hidden sm:block">{t("anomaly")}</span>
                                </button>
                </>
              );
            })()}
        </div>
      </div>

      {noteHistoryModal && <NoteHistoryModal onClose={() => setNoteHistoryModal(false)} failureId={details.id} />}
      {photoHistoryModal && <PhotoHistoryModal onClose={() => setPhotoHistoryModal(false)} failureId={details.id} />}
      {textHistoryModal && <TextHistoryModal onClose={() => setTextHistoryModal(false)} failureId={details.id} />}
            
    </div>
  );
};

export default MaintenanceDetails;
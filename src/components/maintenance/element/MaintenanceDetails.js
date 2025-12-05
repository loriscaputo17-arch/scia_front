"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import AudioPlayer from "@/components/element/audioPlayer";
import NoteHistoryModal from "@/components/maintenance/element/NoteHistoryModal";
import PhotoHistoryModal from "@/components/maintenance/element/PhotoHistoryModal";
import TextHistoryModal from "@/components/maintenance/element/TextHistoryModal";
import ConfirmMaintenance from "./ConfirmMaintenance";

import { useTranslation } from "@/app/i18n";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

import {
  getTextsGeneral,
  getPhotosGeneral,
  getAudiosGeneral,
} from "@/api/shipFiles";

import {
  addPhotographicNoteGeneral,
  addVocalNoteGeneral,
  addTextNoteGeneral,
} from "@/api/failures";

import { markAs } from "@/api/maintenance";

export default function MaintenanceDetails({ details }) {
  const [latestPhoto, setLatestPhoto] = useState(null);
  const [latestAudio, setLatestAudio] = useState(null);
  const [latestText, setLatestText] = useState(null);

  const [zoomImage, setZoomImage] = useState(null); // ZOOM

  const [modalPhotoHistory, setModalPhotoHistory] = useState(false);
  const [modalAudioHistory, setModalAudioHistory] = useState(false);
  const [modalTextHistory, setModalTextHistory] = useState(false);

  const [openConfirmOk, setOpenConfirmOk] = useState(false);

  const { t, i18n } = useTranslation("maintenance");
  const { getNotes, clearNotes, user } = useUser();

  const router = useRouter();

  const mounted = i18n.isInitialized;

  const maintenanceId = details?.[0]?.id || null;
  const executionState = details?.[0]?.execution_state;

  /* --------------------------------
   * FETCH ULTIME NOTE
   -------------------------------- */
  useEffect(() => {
    if (!maintenanceId) return;

    const loadNotes = async () => {
      try {
        const [photos, audios, texts] = await Promise.all([
          getPhotosGeneral(maintenanceId, "maintenance"),
          getAudiosGeneral(maintenanceId, "maintenance"),
          getTextsGeneral(maintenanceId, "maintenance"),
        ]);

        if (photos?.notes?.length) {
          setLatestPhoto(
            [...photos.notes].sort(
              (a, b) => new Date(b.created_at) - new Date(a.created_at)
            )[0]
          );
        }

        if (audios?.notes?.length) {
          setLatestAudio(
            [...audios.notes].sort(
              (a, b) => new Date(b.created_at) - new Date(a.created_at)
            )[0]
          );
        }

        if (texts?.notes?.length) {
          setLatestText(
            [...texts.notes].sort(
              (a, b) => new Date(b.created_at) - new Date(a.created_at)
            )[0]
          );
        }
      } catch (err) {
        console.error("Errore caricamento note:", err);
      }
    };

    loadNotes();
  }, [maintenanceId]);

  const uploadNotesToDb = async (status) => {
    const failureId = maintenanceId;
    const notes = getNotes(failureId);

    try {
      // Foto
      for (const photoFile of notes.photo || []) {
        const fd = new FormData();
        fd.append("file", photoFile);
        fd.append("failureId", failureId);
        fd.append("authorId", user.id);
        fd.append("type", "maintenance");
        fd.append("status", status);

        await addPhotographicNoteGeneral(fd);
      }

      // Audio
      for (const audioFile of notes.vocal || []) {
        const fd = new FormData();
        fd.append("file", audioFile);
        fd.append("failureId", failureId);
        fd.append("authorId", user.id);
        fd.append("type", "maintenance");
        fd.append("status", status);

        await addVocalNoteGeneral(fd);
      }

      // Testo
      for (const text of notes.text || []) {
        await addTextNoteGeneral({
          content: text,
          failureId,
          authorId: user.id,
          type: "maintenance",
          status,
        });
      }

      clearNotes(failureId);
    } catch (err) {
      console.error("Errore upload note:", err);
    }
  };

  const handleOk = () => {
    setOpenConfirmOk(true);
  };

  const handleAnomaly = async () => {
    await markAs(maintenanceId, 2);
    window.location.reload();
  };

  const handleNotPerformed = async () => {
    await markAs(maintenanceId, 3);
    window.location.reload();
  };

  const disabled = executionState !== null;

  if (!mounted) return null;

  return (
    <>
      <div className="p-2 w-full">

        <div className="mb-8">
          <div className="flex items-center mb-2">
            <h2 className="text-lg text-[#789fd6]">{t("photographic_notes")}</h2>
            <button
              className="text-[14px] text-white ml-auto cursor-pointer"
              onClick={() => setModalPhotoHistory(true)}
            >
              {t("see_history")}
            </button>
          </div>

          {latestPhoto ? (
            <div className="flex items-center gap-4 cursor-pointer">
              <Image
                src={latestPhoto.image_url}
                alt="photo"
                width={80}
                height={80}
                className="rounded-lg object-cover hover:opacity-80 transition"
                style={{ width: 80, height: 80 }}
                onClick={() => setZoomImage(latestPhoto.image_url)}
              />
              <div>
                <p className="text-white">
                  {latestPhoto.authorDetails.first_name}{" "}
                  {latestPhoto.authorDetails.last_name}
                </p>
                <p className="text-white/60 text-sm">
                  {new Date(latestPhoto.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-white/40 italic">{t("no_data_available")}</p>
          )}
        </div>

        <div className="mb-8">
          <div className="flex items-center mb-2 mt-4">
            <h2 className="text-lg text-[#789fd6]">{t("vocal_note")}</h2>
            <button
              className="text-[14px] text-white ml-auto cursor-pointer"
              onClick={() => setModalAudioHistory(true)}
            >
              {t("see_history")}
            </button>
          </div>

          {latestAudio ? (
            <AudioPlayer
              audioSrc={latestAudio.audio_url}
              username={
                latestAudio.authorDetails.first_name[0] +
                latestAudio.authorDetails.last_name[0]
              }
              dateTime={latestAudio.created_at}
            />
          ) : (
            <p className="text-white/40 italic">{t("no_data_available")}</p>
          )}
        </div>

        <div className="mb-8">
          <div className="flex items-center mb-2 mt-4">
            <h2 className="text-lg text-[#789fd6]">{t("text_note")}</h2>
            <button
              className="text-[14px] text-white ml-auto cursor-pointer"
              onClick={() => setModalTextHistory(true)}
            >
              {t("see_history")}
            </button>
          </div>

          {latestText ? (
            <div className="w-full bg-[#00000038] p-4 rounded-md">
              <p className="text-white text-[12px] opacity-60">
                {latestText.authorDetails.first_name}{" "}
                {latestText.authorDetails.last_name}
              </p>
              <p className="text-white text-[16px] my-2">
                {latestText.text_field}
              </p>
              <p className="text-white/60 text-xs">
                {new Date(latestText.created_at).toLocaleString()}
              </p>
            </div>
          ) : (
            <p className="text-white/40 italic">{t("no_data_available")}</p>
          )}
        </div>

        <div className="flex gap-4 mb-6">

          <button
            onClick={() => !disabled && handleOk()}
            disabled={disabled}
            className={`w-full py-6 rounded-md flex justify-center items-center transition 
            ${disabled ? "bg-gray-600 opacity-40 cursor-not-allowed" : "bg-[#15375d] hover:bg-blue-700"}`}
          >
            <Image src="/done.png" width={20} height={20} alt="OK" className="mr-2" />
            {t("ok")}
          </button>

          {/* ANOMALIA */}
          <button
            onClick={() => !disabled && handleAnomaly()}
            disabled={disabled}
            className={`w-full py-6 rounded-md flex justify-center items-center transition 
            ${disabled ? "bg-gray-600 opacity-40 cursor-not-allowed" : "bg-[#15375d] hover:bg-blue-700"}`}
          >
            <Image src="/x.png" width={20} height={20} alt="Anomaly" className="mr-2" />
            {t("anomaly")}
          </button>

          <button
            onClick={() => !disabled && handleNotPerformed()}
            disabled={disabled}
            className={`w-full py-6 rounded-md flex justify-center items-center transition
            ${disabled ? "bg-gray-600 opacity-40 cursor-not-allowed" : "bg-[#15375d] hover:bg-blue-700"}`}
          >
            <Image src="/time.png" width={20} height={20} alt="Not performed" className="mr-2" />
            {t("not_perfomed")}
          </button>
        </div>
      </div>

      {modalAudioHistory && (
        <NoteHistoryModal
          onClose={() => setModalAudioHistory(false)}
          failureId={maintenanceId}
        />
      )}

      {modalPhotoHistory && (
        <PhotoHistoryModal
          onClose={() => setModalPhotoHistory(false)}
          failureId={maintenanceId}
        />
      )}

      {modalTextHistory && (
        <TextHistoryModal
          onClose={() => setModalTextHistory(false)}
          failureId={maintenanceId}
        />
      )}

      {openConfirmOk && (
        <ConfirmMaintenance
          onClose={() => setOpenConfirmOk(false)}
          onClick={() => uploadNotesToDb("ok")}
          maintenanceListId={maintenanceId}
        />
      )}

      {zoomImage && (
        <div
          className="fixed inset-0 z-[999] bg-black/80 flex items-center justify-center cursor-pointer"
          onClick={() => setZoomImage(null)}
        >
          <Image
            src={zoomImage}
            width={1000}
            height={1000}
            alt="Zoom"
            className="max-w-[90%] max-h-[90%] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </>
  );
}

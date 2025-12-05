"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import AudioPlayer from "@/components/element/audioPlayer";
import { useTranslation } from "@/app/i18n";
import {
  getTextsGeneral,
  getPhotosGeneral,
  getAudiosGeneral,
} from "@/api/shipFiles";

export default function NotesModal({ isOpen, onClose, data }) {
  const [latestPhoto, setLatestPhoto] = useState(null);
  const [latestAudio, setLatestAudio] = useState(null);
  const [latestText, setLatestText] = useState(null);

  const [zoomImage, setZoomImage] = useState(null); // ZOOM IMAGE STATE

  const { t, i18n } = useTranslation("maintenance");

  /* --------------------------------
   * FETCH NOTE
   -------------------------------- */
  useEffect(() => {
    if (!isOpen || !data?.id) return;

    const fetchLatestNotes = async () => {
      try {
        const [photos, audios, texts] = await Promise.all([
          getPhotosGeneral(data?.id, "maintenance"),
          getAudiosGeneral(data?.id, "maintenance"),
          getTextsGeneral(data?.id, "maintenance"),
        ]);

        if (photos?.notes?.length) {
          const sorted = [...photos.notes].sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
          setLatestPhoto(sorted[0]);
        }

        if (audios?.notes?.length) {
          const sorted = [...audios.notes].sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
          setLatestAudio(sorted[0]);
        }

        if (texts?.notes?.length) {
          const sorted = [...texts.notes].sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
          setLatestText(sorted[0]);
        }
      } catch (error) {
        console.error("Errore nel recupero delle note:", error);
      }
    };

    fetchLatestNotes();
  }, [isOpen, data?.id]);


  /* --------------------------------
   * RESET QUANDO LA MODALE SI CHIUDE
   -------------------------------- */
  useEffect(() => {
    if (!isOpen) {
      setLatestPhoto(null);
      setLatestAudio(null);
      setLatestText(null);
      setZoomImage(null);
    }
  }, [isOpen]);


  if (!isOpen || !i18n.isInitialized) return null;


  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-[#022a52] sm:w-[50%] w-full p-6 rounded-lg shadow-lg text-white animate-fadeIn">

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[22px] font-semibold">
              {t("notes")}: {data?.job?.name}
            </h2>
            <button
              className="text-white text-xl cursor-pointer"
              onClick={onClose}
            >
              ✕
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-[#789fd6] font-medium mb-2">
              {t("photographic_notes")}
            </h3>

            {latestPhoto ? (
              <div className="flex items-center gap-4">
                <Image
                  src={latestPhoto.image_url}
                  alt="Latest photo"
                  width={80}
                  height={80}
                  className="rounded-md object-cover cursor-pointer hover:opacity-80 transition"
                  style={{ width: "80px", height: "80px" }}
                  onClick={() => setZoomImage(latestPhoto.image_url)} // ZOOM
                />
                <div>
                  <p className="text-white text-md">
                    {latestPhoto?.authorDetails?.first_name}{" "}
                    {latestPhoto?.authorDetails?.last_name}
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

          <div className="mb-6">
            <h3 className="text-[#789fd6] font-medium mb-2">{t("vocal_notes")}</h3>

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

          <div className="mb-6">
            <h3 className="text-[#789fd6] font-medium mb-2">{t("text_notes")}</h3>

            {latestText ? (
              <div className="bg-[#00000038] p-4 rounded-md">
                <p className="text-white/60 text-sm">
                  {latestText.authorDetails.first_name}{" "}
                  {latestText.authorDetails.last_name}
                </p>
                <p className="text-white text-[16px] mt-2 mb-2">
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

          <button
            className="w-full bg-[#789fd6] p-3 mt-4 text-white font-semibold rounded-md cursor-pointer"
            onClick={onClose}
          >
            {t("close_button")}
          </button>
        </div>
      </div>

      {zoomImage && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 cursor-pointer"
          onClick={() => setZoomImage(null)}
        >
          <Image
            src={zoomImage}
            alt="Zoomed"
            width={900}
            height={900}
            className="rounded-lg max-w-[90%] max-h-[90%] object-contain shadow-2xl"
          />
        </div>
      )}
    </>
  );
}

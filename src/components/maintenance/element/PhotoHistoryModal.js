"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslation } from "@/app/i18n";
import { getPhotosGeneral } from "@/api/shipFiles";

export default function PhotoHistoryModal({ onClose, failureId }) {
  const [photos, setPhotos] = useState([]);
  const [zoomPhoto, setZoomPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const { t, i18n } = useTranslation("maintenance");

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || !failureId) return;

    const fetchPhotos = async () => {
      try {
        setLoading(true);
        const data = await getPhotosGeneral(failureId, "maintenance");
        setPhotos(data?.notes || []);
      } catch (err) {
        console.error("Errore caricamento foto:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [mounted, failureId]);

  if (!mounted || !i18n.isInitialized) return null;

  return (
    <>
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn">
        <div className="bg-[#022a52] sm:w-[70%] w-[95%] max-h-[85vh] overflow-y-auto p-6 rounded-xl shadow-lg text-white relative">

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[24px] font-semibold">
              {t("photohistory_title")}
            </h2>

            <button
              className="p-1 hover:opacity-70 transition"
              onClick={onClose}
            >
              <svg width="26" height="26" fill="white" viewBox="0 0 384 512">
                <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
              </svg>
            </button>
          </div>

          <div>
            {loading ? (
              <p className="text-white/60 italic">{t("loading")}...</p>
            ) : photos.length > 0 ? (
              photos.map((photo, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 cursor-pointer mb-4"
                  onClick={() => setZoomPhoto(photo.image_url)}
                >
                  <Image
                    src={photo.image_url}
                    alt={`Foto ${index}`}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover"
                    style={{
                      width: "80px",
                      height: "80px",
                    }}
                  />

                  <div>
                    <p className="text-md text-white">
                      {photo.authorDetails.first_name} {photo.authorDetails.last_name}
                    </p>
                    <p className="text-sm text-white/60">
                      {new Date(photo.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="opacity-60">{t("no_data_available")}</p>
            )}
          </div>

          <button
            className="w-full bg-[#789fd6] px-4 py-3 rounded-md text-white font-semibold hover:bg-blue-500 transition cursor-pointer mt-4"
            onClick={onClose}
          >
            {t("close_button")}
          </button>
        </div>
      </div>

      {zoomPhoto && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur animate-fadeIn"
          onClick={() => setZoomPhoto(null)}
        >
          <Image
            src={zoomPhoto}
            alt="Zoom"
            width={800}
            height={800}
            className="rounded-lg max-w-[95%] max-h-[90%] object-contain shadow-lg"
          />
        </div>
      )}
    </>
  );
}

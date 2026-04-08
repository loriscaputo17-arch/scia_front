"use client";

import { useState, useEffect } from "react";
import Image from 'next/image';
import AudioPlayer from "@/components/element/audioPlayer";
import { useTranslation } from "@/app/i18n";
import Link from "next/link";
import { useRouter } from "next/navigation";

const DetailsPanel = ({ details }) => {
  const [showFull, setShowFull] = useState(false);
  const [zoomImage, setZoomImage] = useState(null);
  const { t, i18n } = useTranslation("facilities");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);
  if (!mounted || !i18n.isInitialized) return null;

  const model = details.model;
  const notes = details.notes;
  const scans = details.scans || [];
  const readings = details.readings || [];
  const jobExecutions = details.jobExecutions || [];

  return (
    <div className="p-2 flex flex-col gap-6">

      {/* DESCRIZIONE */}
      <div>
        <h2 className="text-lg text-[#789fd6] mb-2">{t("description")}</h2>
        <p
          className="text-white text-sm"
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: showFull ? "unset" : 3,
            overflow: "hidden",
          }}
        >
          {model?.LCN_name
            ? model.LCN_name.charAt(0).toUpperCase() + model.LCN_name.slice(1).toLowerCase()
            : "—"}
        </p>
        {!showFull && (
          <button
            className="mt-2 text-xs text-white bg-[#ffffff1a] py-1 px-3 rounded"
            onClick={() => setShowFull(true)}
          >
            {t("details")}
          </button>
        )}
      </div>

      {/* DISEGNO TECNICO */}
      {model?.Shipyard_arrangement_drawing_link && (
        <div>
          <h2 className="text-lg text-[#789fd6] mb-2">{t("exploded")}</h2>
          <Link href={model.Shipyard_arrangement_drawing_link} target="_blank">
            <div className="flex items-center gap-3 cursor-pointer bg-[#ffffff0d] rounded-lg px-3 py-2 hover:bg-[#ffffff15]">
              <Image src="/motor.jpg" alt="diagram" width={50} height={50} className="rounded" />
              <p className="text-white text-sm">{t("technical_diagram")}</p>
              <svg className="ml-auto opacity-50" fill="white" width="12" height="12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/>
              </svg>
            </div>
          </Link>
        </div>
      )}

      {/* LINK MANUTENZIONI */}
      {model?.ESWBS_code && (
        <div>
          <h2 className="text-lg text-[#789fd6] mb-2">{t("maintenances")}</h2>
          <div
            className="flex items-center gap-3 cursor-pointer bg-[#ffffff0d] rounded-lg px-3 py-2 hover:bg-[#ffffff15]"
            onClick={() => router.push(`/dashboard/maintenance?eswbs_code=${model.ESWBS_code}`)}
          >
            <p className="text-white text-sm">{t("view_maintenances")}</p>
            {details.maintenances?.length > 0 && (
              <span className="ml-auto text-xs bg-[#789fd6] rounded-full px-2 py-0.5">{details.maintenances.length}</span>
            )}
            <svg className="opacity-50" fill="white" width="12" height="12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
              <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/>
            </svg>
          </div>
        </div>
      )}

      {/* ULTIME LETTURE */}
      {readings.length > 0 && (
        <div>
          <h2 className="text-lg text-[#789fd6] mb-2">Ultime letture</h2>
          <div className="flex flex-col gap-2">
            {readings.slice(0, 3).map((r) => (
              <div key={r.id} className="bg-[#ffffff0d] rounded-lg px-3 py-2">
                <p className="text-white text-sm font-medium">{r.task_name}</p>
                <div className="flex items-center gap-2 mt-1">
                  {r.value && <span className="text-[#789fd6] text-sm">{r.value} {r.unit}</span>}
                  {r.due_date && (
                    <span className="text-white/40 text-xs ml-auto">
                      {new Date(r.due_date).toLocaleDateString("it-IT")}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ULTIME ESECUZIONI */}
      {jobExecutions.length > 0 && (
        <div>
          <h2 className="text-lg text-[#789fd6] mb-2">Ultime manutenzioni eseguite</h2>
          <div className="flex flex-col gap-2">
            {jobExecutions.slice(0, 3).map((j) => (
              <div
                key={j.id}
                className="bg-[#ffffff0d] rounded-lg px-3 py-2 cursor-pointer hover:bg-[#ffffff15]"
                onClick={() => router.push(`/dashboard/maintenance/${j.id}`)}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    j.status?.name === "completed" ? "bg-green-500/20 text-green-400" :
                    j.status?.name === "scheduled" ? "bg-blue-500/20 text-blue-400" :
                    "bg-white/10 text-white/50"
                  }`}>
                    {j.status?.name || "—"}
                  </span>
                  {j.execution_date && (
                    <span className="text-white/40 text-xs">
                      {new Date(j.execution_date).toLocaleDateString("it-IT")}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ULTIMA SCANSIONE */}
      {scans.length > 0 && (
        <div>
          <h2 className="text-lg text-[#789fd6] mb-2">Ultima scansione</h2>
          <div className="bg-[#ffffff0d] rounded-lg px-3 py-2">
            <p className="text-white/50 text-xs">
              {new Date(scans[0].scanned_at).toLocaleString("it-IT")}
            </p>
            {scans[0].result && (
              <p className="text-white text-sm mt-1">{scans[0].result}</p>
            )}
          </div>
        </div>
      )}

      {/* NOTE FOTOGRAFICHE */}
      {notes?.photos?.length > 0 && (
        <div>
          <h2 className="text-lg text-[#789fd6] mb-2">{t("photographic_notes")}</h2>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {notes.photos.map((p) => (
              <div key={p.id} className="flex-shrink-0">
                <Image
                  src={p.image_url}
                  alt="photo"
                  width={70}
                  height={70}
                  className="rounded-lg object-cover cursor-pointer hover:opacity-80"
                  style={{ width: 70, height: 70 }}
                  onClick={() => setZoomImage(p.image_url)}
                />
                <p className="text-white/40 text-xs mt-1">
                  {p.authorDetails ? `${p.authorDetails.first_name} ${p.authorDetails.last_name}` : ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NOTE VOCALI */}
      {notes?.vocal?.length > 0 && (
        <div>
          <h2 className="text-lg text-[#789fd6] mb-2">{t("vocal_notes")}</h2>
          <div className="w-full">
            <AudioPlayer
              audioSrc={notes.vocal[0]?.audio_url}
              username={
                notes.vocal[0]?.authorDetails
                  ? notes.vocal[0].authorDetails.first_name[0] + notes.vocal[0].authorDetails.last_name[0]
                  : "?"
              }
              dateTime={notes.vocal[0]?.created_at}
            />
          </div>
        </div>
      )}

      {/* NOTE TESTUALI */}
      {notes?.text?.length > 0 && (
        <div>
          <h2 className="text-lg text-[#789fd6] mb-2">{t("text_notes")}</h2>
          <div className="flex flex-col gap-2">
            {notes.text.slice(0, 2).map((n) => (
              <div key={n.id} className="w-full bg-[#00000038] p-3 rounded-md">
                <p className="text-white/50 text-xs mb-1">
                  {n.authorDetails ? `${n.authorDetails.first_name} ${n.authorDetails.last_name}` : ""}
                  {" · "}{new Date(n.created_at).toLocaleString("it-IT")}
                </p>
                <p className="text-white text-sm">{n.text_field}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ZOOM FOTO */}
      {zoomImage && (
        <div
          className="fixed inset-0 z-[999] bg-black/80 flex items-center justify-center cursor-pointer"
          onClick={() => setZoomImage(null)}
        >
          <Image
            src={zoomImage}
            width={800}
            height={800}
            alt="zoom"
            className="max-w-[90%] max-h-[90%] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}

    </div>
  );
};

export default DetailsPanel;
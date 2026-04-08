"use client";

import { useState, useEffect } from "react";
import Image from 'next/image';
import FacilitiesModal from "@/components/maintenance/FacilitiesModal";
import InstructionModal from "@/components/maintenance/element/InstructionModal";
import { useTranslation } from "@/app/i18n";
import { useRouter } from "next/navigation";

const MaintenanceInfo = ({ details }) => {
  const [showIstructions, setShowIstructions] = useState(false);
  const [facilitiesOpen, setFacilitiesOpen] = useState(false);

  const router = useRouter();
  const { t, i18n } = useTranslation("maintenance");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted || !i18n.isInitialized) return null;

  const job = details; // details è già details[0] dal parent (ElementPage passa details={maintenancedata[0]})
  const ml = job?.maintenance_list;
  const consumables = job?.consumables || [];
  const spares = job?.spares || [];
  const tools = job?.tools || [];

  return (
    <div className="p-2 flex flex-col gap-6">

      {/* DOCUMENTO / PDF */}
      <div>
        {job?.documentFileUrl ? (
          <button
            className="text-sm text-white w-fit cursor-pointer bg-[#ffffff1a] py-1 px-4 rounded"
            onClick={() => window.open(job.documentFileUrl, "_blank")}
          >
            {t("see_files")}
          </button>
        ) : ml?.Service_or_Maintenance_Manual_Link ? (
          <p className="text-white/40 text-xs italic">
            Manuale: {ml.Service_or_Maintenance_Manual_Link}
            {ml.Service_or_Maintenance_manual_ParagraphAndPage && ` — Pag. ${ml.Service_or_Maintenance_manual_ParagraphAndPage}`}
            {" (file non trovato su S3)"}
          </p>
        ) : null}
      </div>

      {/* ISTRUZIONI */}
      {ml?.Maintenance_under_condition_description && (
        <div>
          <h2 className="text-lg text-[#789fd6] mb-2">{t("description")}</h2>
          <p className="text-white/80 text-sm line-clamp-3">
            {ml.Maintenance_under_condition_description}
          </p>
          <button
            className="mt-2 text-sm text-white w-fit cursor-pointer bg-[#ffffff1a] py-1 px-4 rounded"
            onClick={() => setShowIstructions(true)}
          >
            {t("see_instructions")}
          </button>
        </div>
      )}

      {/* SPARE PARTS */}
      {spares.length > 0 && (
        <div>
          <h2 className="text-lg text-[#789fd6] mb-2">{t("spare_parts")}</h2>
          <div className="flex flex-col gap-2">
            {spares.map((s) => (
              <div key={s.ID} className="flex justify-between bg-[#ffffff0d] rounded-lg px-4 py-2">
                <span className="text-white text-sm">{s.Part_name || s.Serial_number}</span>
                <span className="text-white/50 text-xs">Qty: {s.quantity ?? "—"}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONSUMABILI */}
      {consumables.length > 0 && (
        <div>
          <h2 className="text-lg text-[#789fd6] mb-2">Consumabili</h2>
          <div className="flex flex-col gap-2">
            {consumables.map((c) => (
              <div key={c.ID} className="flex justify-between bg-[#ffffff0d] rounded-lg px-4 py-2">
                <span className="text-white text-sm">{c.Commercial_Name}</span>
                <span className="text-white/50 text-xs">{c.quantity ?? "AR"} {c.unit}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TOOLS */}
      {tools.length > 0 && (
        <div>
          <h2 className="text-lg text-[#789fd6] mb-2">Attrezzature</h2>
          <div className="flex flex-col gap-2">
            {tools.map((tool) => (
              <div key={tool.ID} className="flex justify-between bg-[#ffffff0d] rounded-lg px-4 py-2">
                <span className="text-white text-sm">{tool.Tool_name}</span>
                <span className="text-white/50 text-xs">{tool.quantity ?? "—"}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SISTEMA / COMPONENTE */}
      {job?.Element && (
        <div>
          <h2 className="text-lg text-[#789fd6] mb-2">{t("system")}/{t("component")}</h2>
          <div
            className="flex items-center gap-4 cursor-pointer"
            onClick={() => router.push(`/dashboard/impianti/${job.Element.id}`)}
          >
            <Image src="/motor.jpg" alt="Motore" width={40} height={40} className="rounded" />
            <div>
              <p className="text-white text-sm font-semibold">
                {job.Element.element_model?.ESWBS_code} — {job.Element.element_model?.LCN_name}
              </p>
            </div>
            <div className="ml-auto">
              <svg fill="white" width="14px" height="14px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* RICORRENZA */}
      {job?.recurrency_type && (
        <div>
          <h2 className="text-lg text-[#789fd6] mb-1">{t("frequency")}</h2>
          <p className="text-white">{job.recurrency_type.name}</p>
          {job.recurrency_type.to_days && (
            <p className="text-white/50 text-sm">{job.recurrency_type.to_days} gg</p>
          )}
        </div>
      )}

      {/* LIVELLO */}
      {ml?.maintenance_level && (
        <div>
          <h2 className="text-lg text-[#789fd6] mb-1">{t("level")}</h2>
          <p className="text-white">{ml.maintenance_level.Level_MMI} — {ml.maintenance_level.Description}</p>
        </div>
      )}

      {/* OPERATIVO */}
      {ml?.Operational_Not_operational && (
        <div>
          <h2 className="text-lg text-[#789fd6] mb-1">Operativo</h2>
          <p className="text-white">{ml.Operational_Not_operational}</p>
        </div>
      )}

      {/* DURATA */}
      {ml?.Mean_elapsed_time_MELAP && (
        <div>
          <h2 className="text-lg text-[#789fd6] mb-1">Durata stimata</h2>
          <p className="text-white">{ml.Mean_elapsed_time_MELAP} min</p>
        </div>
      )}

      {/* PERSONALE */}
      {ml?.Personnel_no && (
        <div>
          <h2 className="text-lg text-[#789fd6] mb-1">Personale richiesto</h2>
          <p className="text-white">{ml.Personnel_no} {ml.Personnel_no === 1 ? "persona" : "persone"}</p>
        </div>
      )}

      {/* DATA ESECUZIONE */}
      {job?.execution_date && (
        <div>
          <h2 className="text-lg text-[#789fd6] mb-1">{t("execution")}</h2>
          <p className="text-white">
            {new Date(job.execution_date).toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric" })}
          </p>
        </div>
      )}

      {/* SCADENZA */}
      {job?.ending_date && (
        <div>
          <h2 className="text-lg text-[#789fd6] mb-1">{t("expiry_date")}</h2>
          <p className="text-white">
            {new Date(job.ending_date).toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric" })}
          </p>
        </div>
      )}

      {showIstructions && (
        <InstructionModal
          text={ml?.Maintenance_under_condition_description}
          onClose={() => setShowIstructions(false)}
        />
      )}

      {job?.Element && (
        <FacilitiesModal
          isOpen={facilitiesOpen}
          onClose2={() => setFacilitiesOpen(false)}
          eswbs={job.Element.element_model?.ESWBS_code}
        />
      )}
    </div>
  );
};

export default MaintenanceInfo;
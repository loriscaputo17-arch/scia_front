"use client";

import { useState, useEffect } from "react";
import Image from 'next/image';
import SpareModal from "./SpareModal";
import { useTranslation } from "@/app/i18n";
import SpareSelector from "./SpareSelector";
import InstructionModal from "./InstructionModal";
import { useRouter } from "next/navigation";
import { fetchMaintenanceFollowUp } from "@/api/maintenance";
import { useUser } from "@/context/UserContext";

const MaintenanceInfo = ({ details }) => {
  const [showFull, setShowFull] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSpare, setSelectedSpare] = useState([]);
  const [showInstructions, setShowInstructions] = useState(false);
  const router = useRouter();

  const [followUpOpen, setFollowUpOpen] = useState(false);
  const [followUpData, setFollowUpData] = useState([]);
  const [loadingFollowUp, setLoadingFollowUp] = useState(false);

  const { user, selectedShipId: shipId } = useUser();

   const loadFollowUp = async () => {
      if (!details[0].id || !shipId) return;
  
      setLoadingFollowUp(true);
  
      try {
        const data = await fetchMaintenanceFollowUp(details[0].id, shipId, user?.id);
        setFollowUpData(data.jobs || []);
      } catch (err) {
        console.error("Errore follow-up:", err);
      }
  
      setLoadingFollowUp(false);
    };

  const { t, i18n } = useTranslation("maintenance");
    const [mounted, setMounted] = useState(false);
      
    useEffect(() => {
      setMounted(true);
    }, []);
      
    if (!mounted || !i18n.isInitialized) return null;

  return (
    <div className="p-2">

      <div className="flex items-center gap-2">
        <div className="">
          <button
            onClick={() => {
              setFollowUpOpen(true);
              loadFollowUp();
            }}
              className="text-sm text-[#fff] w-fit cursor-pointer bg-[#ffffff1a] py-1 px-4 rounded"
          >
            Follow-up
          </button>
        </div>
        
        {details[0]?.documentFileUrl &&
          <button
            className="text-sm text-[#fff] w-fit cursor-pointer bg-[#ffffff1a] py-1 px-4 rounded"
            onClick={() => {
                  if (details[0].documentFileUrl) {
                    const pdfUrl = `${details[0].documentFileUrl}#page=${details[0]?.maintenance_list?.page}`;
                    window.open(pdfUrl, "_blank");
                  } else {
                    alert("Nessun documento trovato per questo ricambio");
                  }
                }}
          >
            {t("see_files")}
          </button>
        }
      </div>

      {details[0]?.maintenance_list.Maintenance_under_condition_description && 
        <div>
          <h2 className="text-lg text-[#789fd6] mb-2">{t("description")}</h2>
          <p
            className={`text-white ${
              showFull
                ? ""
                : "line-clamp-2 overflow-hidden text-ellipsis whitespace-normal"
            }`}
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: showFull ? "unset" : 2,
              overflow: "hidden",
            }}
          >
            ≈
          </p>
        </div>
      }

      <div className="flex items-center gap-2">

        {details[0]?.maintenance_list?.Maintenance_under_condition_description && 
          <button
            className="mt-2 text-sm text-[#fff] w-fit cursor-pointer bg-[#ffffff1a] py-1 px-4 rounded"
            onClick={() => setShowInstructions(true)}
          >
            {t("see_instructions")}
          </button>
        }
        
      </div>

      {/* SPARE PARTS */}
      {details[0]?.spares?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg text-[#789fd6] mb-2 mt-4">{t("spare_parts")}</h2>
          <div className="flex overflow-x-auto gap-4 py-2 custom-carousel">
            <SpareSelector
              spares={details[0].spares}
              onSelectChange={(selected) => setSelectedSpare(selected)}
            />
          </div>
        </div>
      )}

      {/* CONSUMABLES */}
      {details[0]?.consumables?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg text-[#789fd6] mb-2 mt-4">Consumabili</h2>
          <div className="flex flex-col gap-2">
            {details[0].consumables.map((c) => (
              <div key={c.ID} className="flex items-center justify-between bg-[#ffffff0d] rounded-lg px-4 py-2">
                <span className="text-white text-sm">{c.Commercial_Name}</span>
                <span className="text-white/50 text-xs">
                  {c.quantity ?? "AR"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TOOLS */}
      {details[0]?.tools?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg text-[#789fd6] mb-2 mt-4">Attrezzature</h2>
          <div className="flex flex-col gap-2">
            {details[0].tools.map((tool) => (
              <div key={tool.ID} className="flex items-center justify-between bg-[#ffffff0d] rounded-lg px-4 py-2">
                <span className="text-white text-sm">{tool.Tool_name}</span>
                <span className="text-white/50 text-xs">
                  {tool.quantity ?? "—"} {tool.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {isOpen && (
        <SpareModal onClose={() => setIsOpen(false)} maintenanceListId={details[0]?.id}/>
      )}

      <div className="mb-6">

        <div className="flex items-center mb-2 mt-4">
          <h2 className="text-lg text-[#789fd6]">{t("system")}/{t("component")}</h2>
        </div>
      

        <div className="flex items-center gap-4 cursor-pointer"
          onClick={(e) => { e.stopPropagation();
            router.push(`/dashboard/impianti/${details[0]?.Element?.id}`);
          }}>
          <Image src="/motor.jpg" alt="Motore"width={40} height={40} className=""/>
          <div>
            <h2 className="text-md text-[#fff]">{details[0]?.Element?.element_model?.ESWBS_code} {details[0]?.Element?.element_model?.LCN_name.substring(0, 15) + "..."}</h2>
          </div>
          <div className="ml-auto">
            <svg fill="white" width="16px" height="16px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg>
          </div>
        </div>

      </div>

    {details[0]?.recurrency_type?.to_days &&
      <div className="mb-6">
        <div className="flex items-center mb-2 mt-4">
          <h2 className="text-lg text-[#789fd6]">{t("anniversary")}</h2>
        </div>
        <div className="flex items-center gap-4 cursor-pointer">
          <p>{details[0]?.recurrency_type?.to_days} gg</p>
        </div>
      </div>
    }

      {details[0]?.execution_date &&
        <div className="mb-6">
          <div className="flex items-center mb-2 mt-4">
            <h2 className="text-lg text-[#789fd6]">{t("execution")}</h2>
          </div>
          <div className="flex items-center gap-4 cursor-pointer">
            <p>
              {details[0]?.execution_date &&
                new Date(details[0].execution_date).toLocaleDateString("it-IT", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
            </p>
          </div>
        </div>
      }

      {details[0]?.maintenance_list?.maintenance_level && (
        <div className="mb-6">
          <h2 className="text-lg text-[#789fd6] mb-2 mt-4">{t("level")}</h2>
          <p className="text-white">{details[0].maintenance_list.maintenance_level.Level_MMI} — {details[0].maintenance_list.maintenance_level.Description}</p>
        </div>
      )}

      {/* TIPO OPERATIVO */}
      {details[0]?.maintenance_list?.Operational_Not_operational && (
        <div className="mb-6">
          <h2 className="text-lg text-[#789fd6] mb-2 mt-4">Operativo</h2>
          <p className="text-white">{details[0].maintenance_list.Operational_Not_operational}</p>
        </div>
      )}

      {/* DURATA STIMATA */}
      {details[0]?.maintenance_list?.Mean_elapsed_time_MELAP && (
        <div className="mb-6">
          <h2 className="text-lg text-[#789fd6] mb-2 mt-4">Durata stimata</h2>
          <p className="text-white">{details[0].maintenance_list.Mean_elapsed_time_MELAP} min</p>
        </div>
      )}

      {/* PERSONALE NECESSARIO */}
      {details[0]?.maintenance_list?.Personnel_no && (
        <div className="mb-6">
          <h2 className="text-lg text-[#789fd6] mb-2 mt-4">Personale richiesto</h2>
          <p className="text-white">{details[0].maintenance_list.Personnel_no} {details[0].maintenance_list.Personnel_no === 1 ? "persona" : "persone"}</p>
        </div>
      )}

      {/* MANUALE — paragrafo e pagina */}
      {details[0]?.maintenance_list?.Service_or_Maintenance_manual_ParagraphAndPage && (
        <div className="mb-6">
          <h2 className="text-lg text-[#789fd6] mb-2 mt-4">Paragrafo manuale</h2>
          <p className="text-white">Pag. {details[0].maintenance_list.Service_or_Maintenance_manual_ParagraphAndPage}</p>
        </div>
      )}

      {/* DATA SCADENZA */}
      {details[0]?.ending_date && (
        <div className="mb-6">
          <h2 className="text-lg text-[#789fd6] mb-2 mt-4">{t("expiry_date")}</h2>
          <p className="text-white">{new Date(details[0].ending_date).toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric" })}</p>
        </div>
      )}

      {/* TIPO RICORRENZA */}
      {details[0]?.maintenance_list?.recurrency_type && (
        <div className="mb-6">
          <h2 className="text-lg text-[#789fd6] mb-2 mt-4">{t("frequency")}</h2>
          <div className="flex items-center gap-3">
            <p className="text-white">{details[0].maintenance_list.recurrency_type.name}</p>
            {details[0].maintenance_list.recurrency_type.to_days && (
              <span className="text-white/60 text-sm">({details[0].maintenance_list.recurrency_type.to_days} gg)</span>
            )}
          </div>
          {(details[0].maintenance_list.recurrency_type.early_threshold ||
            details[0].maintenance_list.recurrency_type.due_threshold ||
            details[0].maintenance_list.recurrency_type.delay_threshold) && (
            <div className="flex gap-4 mt-2 text-sm">
              {details[0].maintenance_list.recurrency_type.early_threshold > 0 && (
                <span className="text-green-400">Anticipo: {details[0].maintenance_list.recurrency_type.early_threshold} gg</span>
              )}
              {details[0].maintenance_list.recurrency_type.due_threshold > 0 && (
                <span className="text-yellow-400">Scadenza: {details[0].maintenance_list.recurrency_type.due_threshold} gg</span>
              )}
              {details[0].maintenance_list.recurrency_type.delay_threshold > 0 && (
                <span className="text-orange-400">Ritardo: {details[0].maintenance_list.recurrency_type.delay_threshold} gg</span>
              )}
            </div>
          )}
        </div>
      )}
      
      {showInstructions && (
        <InstructionModal
          text={details[0]?.maintenance_list?.Maintenance_under_condition_description}
          onClose={() => setShowInstructions(false)}
        />
      )}

      {followUpOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#022a52] w-[90%] max-w-3xl rounded-lg p-6">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Follow-up Tasks</h2>
              <button onClick={() => setFollowUpOpen(false)}>✕</button>
            </div>

            {/* CONTENUTO */}
            {loadingFollowUp ? (
              <p className="text-white/60">Loading...</p>
            ) : followUpData.length === 0 ? (
              <p className="text-white/60">Nessun follow-up trovato</p>
            ) : (
              <div className="max-h-[400px] overflow-y-auto">

                {/* HEADER TABELLA */}
                <div className="grid grid-cols-[2fr_1fr] font-bold border-b border-white/20 pb-2 mb-2">
                  <p>Task</p>
                  <p className="text-center">Azione</p>
                </div>

                {/* RIGHE */}
                {followUpData.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[2fr_1fr] py-2 border-b border-white/10 items-center"
                  >
                    <p>
                      {item?.maintenance_name || "—"}
                    </p>

                    <div className="text-center">
                      <button
                        onClick={() => {
                          window.location.href = `/dashboard/maintenance/${item.id}`;
                        }}
                        className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-md text-sm"
                      >
                        Apri
                      </button>
                    </div>
                  </div>
                ))}

              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default MaintenanceInfo;

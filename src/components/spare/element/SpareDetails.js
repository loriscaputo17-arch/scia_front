"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/app/i18n";

const getFacilityIcon = (code) => {
  if (!code) return null;
  const firstDigit = code.trim().charAt(0);
  if (!/^[0-9]$/.test(firstDigit)) return null;
  return `/icons/facilities/Ico${firstDigit}.svg`;
};

const SpareDetails = ({ details }) => {
  const [zoomImage, setZoomImage] = useState(null);
  const router = useRouter();
  const { t, i18n } = useTranslation("maintenance");

  if (!i18n.isInitialized) return null;

  const spare = details?.[0];
  if (!spare) return null;

  const eswbsCode = spare.elementModel?.ESWBS_code || spare.Element?.element_model?.ESWBS_code;
  const facilityIcon = getFacilityIcon(eswbsCode);
  const elementName = spare.Element
    ? `${spare.Element.element_model?.ESWBS_code || ""} ${spare.Element.name || ""}`.trim()
    : spare.elementModel
      ? `${spare.elementModel.ESWBS_code || ""} ${spare.elementModel.LCN_name || ""}`.trim()
      : null;

  return (
    <div className="grid sm:grid-cols-2 gap-6 px-2">

      {/* COLONNA SINISTRA */}
      <div className="flex flex-col gap-6">

        {/* NOME ORIGINALE */}
        <div>
          <h2 className="text-lg text-[#789fd6] mb-1">{t("original_name")}</h2>
          <p className="text-white">{spare.Part_name || "Non disponibile"}</p>
        </div>

        {/* SERIAL NUMBER */}
        {spare.Serial_number && (
          <div>
            <h2 className="text-lg text-[#789fd6] mb-1">Serial Number</h2>
            <p className="text-white">{spare.Serial_number}</p>
          </div>
        )}

        {/* PART NUMBER */}
        <div>
          <h2 className="text-lg text-[#789fd6] mb-1">Part Number</h2>
          <p className="text-white">{spare.part?.Part_Number || "Non disponibile"}</p>
        </div>

        {/* DESCRIZIONE ORIGINALE OEM */}
        {spare.part?.Original_description && (
          <div>
            <h2 className="text-lg text-[#789fd6] mb-1">Descrizione OEM</h2>
            <p className="text-white">{spare.part.Original_description}</p>
          </div>
        )}

        {/* QUANTITÀ INSTALLATA */}
        <div>
          <h2 className="text-lg text-[#789fd6] mb-1">{t("q_installed")}</h2>
          <p className="text-white">{spare.installed_quantity ?? 1}</p>
        </div>

        {/* QUANTITÀ IN GIACENZA */}
        <div>
          <h2 className="text-lg text-[#789fd6] mb-1">Quantità in giacenza</h2>
          <p className="text-white">{spare.quantity ?? "0"}</p>
        </div>

        {/* DOCUMENTO / PDF */}
        {spare.documentFileUrl && (
          <div>
            <h2 className="text-lg text-[#789fd6] mb-1">Documento</h2>
            <button
              className="text-sm text-white bg-[#ffffff1a] py-1 px-4 rounded"
              onClick={() => window.open(spare.documentFileUrl, "_blank")}
            >
              Apri documento
            </button>
          </div>
        )}
        
        {spare.image && (
          <div>
            <h2 className="text-lg text-[#789fd6] mb-2">{t("image")}</h2>
            <Image
              src={spare.image || "/spareexample.png"}
              alt="Spare"
              width={80}
              height={80}
              className="rounded-lg cursor-pointer"
              onClick={() => setZoomImage(spare.image || "/spareexample.png")}
            />
          </div>
        )}

        {/* EAN13 */}
        {spare.ean13 && (
          <div>
            <h2 className="text-lg text-[#789fd6] mb-1">EAN13</h2>
            <p className="text-white">{spare.ean13}</p>
          </div>
        )}

      </div>

      {/* COLONNA DESTRA */}
      <div className="flex flex-col gap-6">

        {/* SISTEMA / COMPONENTE */}
        {elementName && (
          <div>
            <h2 className="text-lg text-[#789fd6] mb-1">{t("system")}/{t("component")}</h2>
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => spare.Element && router.push(`/dashboard/impianti/${spare.Element.id}`)}
            >
              {facilityIcon && (
                <Image src={facilityIcon} alt="icon" width={16} height={16} />
              )}
              <p className="text-white text-sm">{elementName}</p>
              {spare.Element && (
                <svg className="ml-auto" fill="white" width="14px" height="14px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                  <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/>
                </svg>
              )}
            </div>
          </div>
        )}

        {/* MAGAZZINI / LOCATION */}
        <div>
          <h2 className="text-lg text-[#789fd6] mb-2">{t("warehouse")} ({t("locations")})</h2>
          {spare.locations?.length > 0 ? (
            <div className="flex flex-col gap-2">
              {spare.locations.map((loc, index) => {
                const warehouse = spare.warehouses?.find(w => w.id?.toString() === loc.warehouse_id?.toString());
                const quantities = spare.quantity?.split(",") || [];
                return (
                  <div key={index} className="flex items-center gap-2">
                    {warehouse?.icon_url && (
                      <Image src={warehouse.icon_url} alt="warehouse" width={18} height={18} className="opacity-70" />
                    )}
                    <span className="text-white/80 text-sm">{warehouse?.name}</span>
                    <span className="text-white/50 text-xs">({loc.location})</span>
                    <span className="text-white ml-auto text-sm">x{quantities[index] ?? "0"}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-white/40 italic text-sm">Nessuna posizione disponibile</p>
          )}
          <button
            className="text-sm text-white bg-[#ffffff1a] py-1 px-4 rounded mt-3"
            onClick={() => router.push("/dashboard/spare")}
          >
            {t("manage")}
          </button>
        </div>

        {/* NCAGE COSTRUTTORE */}
        {spare.part?.organizationCompanyNCAGE?.NCAGE_Code && (
          <div>
            <h2 className="text-lg text-[#789fd6] mb-1">NCAGE {t("costructor")}</h2>
            <p className="text-white">{spare.part.organizationCompanyNCAGE.NCAGE_Code}</p>
            <p className="text-white/50 text-xs">{spare.part.organizationCompanyNCAGE.Organization_name}</p>
          </div>
        )}

        {/* DRAWING NUMBER */}
        {spare.part?.Drawing_number && (
          <div>
            <h2 className="text-lg text-[#789fd6] mb-1">Drawing Number</h2>
            <p className="text-white">{spare.part.Drawing_number}</p>
            {spare.part.Drawing_number_revision_index && (
              <p className="text-white/50 text-xs">Rev. {spare.part.Drawing_number_revision_index}</p>
            )}
            {spare.part.Drawing_title && (
              <p className="text-white/50 text-xs">{spare.part.Drawing_title}</p>
            )}
          </div>
        )}

        {/* DOCUMENT FILE HYPERLINK */}
        {spare.Document_file_hyperlink && (
          <div>
            <h2 className="text-lg text-[#789fd6] mb-1">Documento collegato</h2>
            <button
              className="text-sm text-white bg-[#ffffff1a] py-1 px-4 rounded"
              onClick={() => window.open(spare.Document_file_hyperlink, "_blank")}
            >
              Apri
            </button>
          </div>
        )}

        {/* SHIPYARD ARRANGEMENT DRAWING */}
        {spare.Shipyard_arrangement_drawing_link && (
          <div>
            <h2 className="text-lg text-[#789fd6] mb-2">Shipyard Arrangement Drawing</h2>
            <Image
              src={spare.Shipyard_arrangement_drawing_link}
              alt="Shipyard Arrangement Drawing"
              width={200}
              height={200}
              className="rounded-lg cursor-pointer object-contain"
              onClick={() => setZoomImage(spare.Shipyard_arrangement_drawing_link)}
            />
          </div>
        )}

      </div>

      {/* ZOOM IMMAGINE */}
      {zoomImage && (
        <div
          className="fixed inset-0 z-[999] bg-black/80 flex items-center justify-center cursor-pointer"
          onClick={() => setZoomImage(null)}
        >
          <Image
            src={zoomImage}
            width={600}
            height={600}
            alt="Zoom"
            className="max-w-[90%] max-h-[90%] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}

    </div>
  );
};

export default SpareDetails;
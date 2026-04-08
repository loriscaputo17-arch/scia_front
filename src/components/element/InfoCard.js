"use client"

import { useState, useEffect } from "react";
import Image from 'next/image';
import EditModal from "@/components/element/EditModal";
import { useTranslation } from "@/app/i18n";

const InfoCard = ({ data }) => {
  const [isPopupOpen, setIsOpen] = useState(false);
  const [usageHours, setUsageHours] = useState(data.element.time_to_work);

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL_DEV;

  const handleSave = async (newUsage) => {
    try {
      const res = await fetch(`${BASE_URL}/api/element/addTimeWork`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: data.element.id, time: newUsage }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Errore");
      setUsageHours(newUsage);
      setIsOpen(false);
    } catch (err) {
      console.log(err.message);
    }
  };

  const { t, i18n } = useTranslation("facilities");
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted || !i18n.isInitialized) return null;

  const model = data.model;
  const element = data.element;
  const org = data.organization;
  const manufacturer = data.manufacturer;
  const supplier = data.supplier;
  const parent = data.parent;

  const Field = ({ label, value }) => {
    if (!value) return null;
    return (
      <div className="mb-4">
        <h2 className="text-sm text-[#789fd6] mb-1">{label}</h2>
        <p className="text-white text-sm">{value}</p>
      </div>
    );
  };

  return (
    <div className="px-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">

        {/* COLONNA SINISTRA */}
        <div>
          <Field label={t("system") + "/" + t("component")} value={
            model?.LCN_name
              ? model.LCN_name.charAt(0).toUpperCase() + model.LCN_name.slice(1).toLowerCase()
              : null
          } />

          <Field label="ESWBS Code" value={model?.ESWBS_code} />

          <Field label="LCN" value={model?.LCN} />

          <Field label="LCN Type" value={model?.LCNtype_ID} />

          {parent && (
            <div className="mb-4">
              <h2 className="text-sm text-[#789fd6] mb-1">Sistema padre</h2>
              <p className="text-white text-sm">{parent.model?.ESWBS_code} — {parent.element?.name}</p>
            </div>
          )}

          <Field label={t("builder")} value={
            org?.Organization_name ||
            manufacturer?.organizationCompanyNCAGE?.Organization_name ||
            null
          } />

          {(org?.NCAGE_Code || manufacturer?.organizationCompanyNCAGE?.NCAGE_Code) && (
            <Field label="NCAGE Costruttore" value={
              org?.NCAGE_Code || manufacturer?.organizationCompanyNCAGE?.NCAGE_Code
            } />
          )}

          {supplier && (
            <Field label="Fornitore" value={supplier.Organization_name} />
          )}

          <Field label="Potenza nominale (kW)" value={model?.RatedPower} />

          <Field label="Alimentazione" value={model?.Power_supply} />

          <Field label="Corrente assorbita (A)" value={model?.Absorbed_current} />

          <Field label="Velocità (giri/min)" value={model?.Revolution_speed} />

          <Field label="Pressione operativa (bar)" value={model?.Operating_pressure} />

          <Field label="Peso (kg)" value={model?.Weight} />

          <Field label="Dimensioni (LxWxH)" value={model?.Dimensions_LxWxH} />

          <div className="mb-4">
            <h2 className="text-sm text-[#789fd6] mb-2">{t("image")}</h2>
            <Image
              src="/motor.jpg"
              alt="image"
              width={80}
              height={80}
              className="rounded-lg"
            />
          </div>
        </div>

        {/* COLONNA DESTRA */}
        <div>
          {/* Ore moto con edit */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-sm text-[#789fd6] mb-1">{t("motorcycles_hours")}</h2>
              <p className="text-white text-sm">{usageHours ?? "—"}</p>
              <p className="text-white/40 text-xs mt-0.5">
                {element?.updated_at ? new Date(element.updated_at).toLocaleString() : ""}
              </p>
            </div>
            <button onClick={() => setIsOpen(true)} className="text-white/60 hover:text-white transition cursor-pointer mt-1">
              <svg fill="currentColor" width="14px" height="14px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231z"/>
              </svg>
            </button>
          </div>

          <Field label="Serial Number" value={element?.serial_number} />

          <Field label="Codice di riferimento" value={element?.progressive_code} />

          <Field label="Data installazione" value={
            element?.installation_date
              ? new Date(element.installation_date).toLocaleDateString("it-IT")
              : null
          } />

          <Field label="Drawing Number" value={model?.Drawing_number} />

          <Field label="Drawing Title" value={model?.Drawing_title} />

          <Field label="Drawing Revision" value={model?.Drawing_number_revision_index} />

          <Field label="Locale installazione" value={model?.Installation_Room_Name} />

          <Field label="Ponte" value={model?.Deck} />

          <Field label="Testate" value={model?.Frame} />

          <Field label="Ore operative annue" value={model?.Yearly_Operating_Hours} />

          <Field label="Ore operative missione" value={model?.Yearly_Operating_Hours_during_missions} />

          <Field label="Area/Locale" value={model?.Ship_Area_Room_Code} />

          <Field label="Criticità" value={
            model?.Criticality_Code_CC === 1 ? "Non critico" :
            model?.Criticality_Code_CC === 2 ? "Degradato" :
            model?.Criticality_Code_CC === 3 ? "Mancato funzionamento" :
            null
          } />

          <Field label="Codice riparabilità" value={model?.Repairability_Code_CR} />

          <Field label="Codice sostituibilità" value={model?.Replaceability_Code_CS} />

          <div className="mb-4">
            <h2 className="text-sm text-[#789fd6] mb-2">{t("3D_model")}</h2>
            <Image
              src="/motor.jpg"
              alt="3D model"
              width={80}
              height={80}
              className="rounded-lg"
            />
          </div>
        </div>
      </div>

      <EditModal
        isOpen={isPopupOpen}
        onClose={() => setIsOpen(false)}
        handleSave={handleSave}
      />
    </div>
  );
};

export default InfoCard;
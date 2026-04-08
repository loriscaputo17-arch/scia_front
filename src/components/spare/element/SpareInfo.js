"use client";

import { useState } from "react";
import { useTranslation } from "@/app/i18n";
import { useRouter } from "next/navigation";

const SpareInfo = ({ details }) => {
  const { t, i18n } = useTranslation("maintenance");
  const router = useRouter();

  if (!i18n.isInitialized) return null;

  const spare = details?.[0];
  if (!spare) return null;

  return (
    <div className="p-2 flex flex-col gap-6">

      {/* PREZZO */}
      <div>
        <h2 className="text-lg text-[#789fd6] mb-1">{t("price")}</h2>
        <p className="text-white">{spare.Unitary_price ? `${spare.Unitary_price} €` : "Non disponibile"}</p>
        {spare.Price_reference_date && (
          <p className="text-white/40 text-xs mt-1">Rif. {spare.Price_reference_date}</p>
        )}
      </div>

      {/* LEAD TIME */}
      <div>
        <h2 className="text-lg text-[#789fd6] mb-1">Lead Time</h2>
        <p className="text-white">
          {spare.Provisioning_Lead_Time_PLT ? `${spare.Provisioning_Lead_Time_PLT} gg` : "Non disponibile"}
        </p>
      </div>

      {/* SHELF LIFE */}
      {spare.Shelf_Life && (
        <div>
          <h2 className="text-lg text-[#789fd6] mb-1">Shelf Life</h2>
          <p className="text-white">{spare.Shelf_Life}</p>
        </div>
      )}

      {/* LIMITED LIFE */}
      {spare.Limited_Life && (
        <div>
          <h2 className="text-lg text-[#789fd6] mb-1">Limited Life</h2>
          <p className="text-white">{spare.Limited_Life}</p>
          {spare.Limited_Life_Ens_Action_Code && (
            <p className="text-white/50 text-xs mt-1">Action: {spare.Limited_Life_Ens_Action_Code}</p>
          )}
        </div>
      )}

      {/* NSN */}
      {spare.NSN && (
        <div>
          <h2 className="text-lg text-[#789fd6] mb-1">NSN</h2>
          <p className="text-white">{spare.NSN}</p>
        </div>
      )}

      {/* DIMENSIONI */}
      {spare.Dimensions_LxWxH && (
        <div>
          <h2 className="text-lg text-[#789fd6] mb-1">Dimensioni (LxWxH)</h2>
          <p className="text-white">{spare.Dimensions_LxWxH}</p>
        </div>
      )}

      {/* PESO */}
      {spare.Weight && (
        <div>
          <h2 className="text-lg text-[#789fd6] mb-1">Peso</h2>
          <p className="text-white">{spare.Weight} kg</p>
        </div>
      )}

      {/* VOLUME */}
      {spare.Volume && (
        <div>
          <h2 className="text-lg text-[#789fd6] mb-1">Volume</h2>
          <p className="text-white">{spare.Volume} mm³</p>
        </div>
      )}

      {/* FORNITORE */}
      {spare.part?.organizationCompanyNCAGE && (
        <div>
          <h2 className="text-lg text-[#789fd6] mb-1">{t("supplier")}</h2>
          <p className="text-white">{spare.part.organizationCompanyNCAGE.Organization_name}</p>
          {spare.part.organizationCompanyNCAGE.NCAGE_Code && (
            <p className="text-white/50 text-xs mt-1">NCAGE: {spare.part.organizationCompanyNCAGE.NCAGE_Code}</p>
          )}
        </div>
      )}

      {/* MANUTENZIONI COLLEGATE */}
      {spare.maintenances?.length > 0 && (
        <div>
          <h2 className="text-lg text-[#789fd6] mb-2">Manutenzioni collegate</h2>
          <div className="flex flex-col gap-2">
            {spare.maintenances.map((m) => (
              <div
                key={m.id}
                className="bg-[#ffffff0d] rounded-lg px-3 py-2 cursor-pointer hover:bg-[#ffffff15]"
              >
                <p className="text-white text-sm font-semibold">{m.name}</p>
                {m.recurrency_type && (
                  <p className="text-white/50 text-xs mt-1">{m.recurrency_type.name}</p>
                )}
                {m.maintenance_level && (
                  <p className="text-white/50 text-xs">{m.maintenance_level.Industry_Level}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ORDINI */}
      <div>
        <h2 className="text-lg text-[#789fd6] mb-1">{t("orders")}</h2>
        <div
          className="flex items-center cursor-pointer"
          onClick={() => router.push("/dashboard/cart")}
        >
          <p className="text-white text-sm flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="#9da9bb" height="16px" width="16px" viewBox="0 0 576 512">
              <path d="M0 24C0 10.7 10.7 0 24 0L69.5 0c22 0 41.5 12.8 50.6 32l411 0c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3l-288.5 0 5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5L488 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-288.3 0c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5L24 48C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/>
            </svg>
            {t("in_order")}
          </p>
          <svg className="ml-auto" fill="white" width="14px" height="14px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
            <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/>
          </svg>
        </div>
      </div>

    </div>
  );
};

export default SpareInfo;
"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "@/app/i18n";
import { useState, useEffect } from "react";

const MaintenanceStatus = ({ data }) => {
  const router = useRouter();
  const { t, i18n } = useTranslation("facilities");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted || !i18n.isInitialized) return null;

  const total = data.maintenances?.length || 0;
  const byRecurrency = {};
  data.maintenances?.forEach(m => {
    const name = m.recurrency_type?.name || "Altro";
    byRecurrency[name] = (byRecurrency[name] || 0) + 1;
  });

  return (
    <div>
      <h2 className="text-lg text-[#789fd6] mb-3">{t("maintenance_status")}</h2>

      {total === 0 ? (
        <p className="text-white/40 text-sm">Nessuna manutenzione</p>
      ) : (
        <div className="flex flex-col gap-2">
          <div
            className="flex items-center justify-between cursor-pointer rounded py-1"
            onClick={() => router.push(`/dashboard/maintenance?eswbs_code=${data.model?.ESWBS_code}`)}
          >
            <p className="text-white text-sm">Totale manutenzioni</p>
            <span className="text-[#789fd6] font-bold">{total}</span>
          </div>
          {Object.entries(byRecurrency).map(([name, count]) => (
            <div key={name} className="flex items-center justify-between py-1">
              <p className="text-white/60 text-sm">{name}</p>
              <span className="text-white/60 text-sm">{count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MaintenanceStatus;
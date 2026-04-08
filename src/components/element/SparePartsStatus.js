"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "@/app/i18n";
import { useState, useEffect } from "react";

const SparePartsStatus = ({ data }) => {
  const router = useRouter();
  const { t, i18n } = useTranslation("facilities");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted || !i18n.isInitialized) return null;

  const spares = data.spares || [];
  const total = spares.length;
  const parseQty = (q) => q ? parseFloat(q.toString().replace(',', '.').replace(/[^0-9.-]/g, '')) : 0;
  const inStock = spares.filter(s => parseQty(s.quantity) > 0).length;
  const outOfStock = total - inStock;

  return (
    <div>
      <h2 className="text-lg text-[#789fd6] mb-3">{t("spare_parts_status")}</h2>

      {total === 0 ? (
        <p className="text-white/40 text-sm">Nessun ricambio</p>
      ) : (
        <div className="flex flex-col gap-2">
          <div
            className="flex items-center justify-between cursor-pointer hover:bg-white/5 rounded px-2 py-1"
            onClick={() => router.push(`/dashboard/spare?eswbs_code=${data.model?.ESWBS_code}`)}
          >
            <p className="text-white text-sm">Totale ricambi</p>
            <span className="text-[#789fd6] font-bold">{total}</span>
          </div>
          <div className="flex items-center justify-between px-2 py-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <p className="text-white/60 text-sm">In giacenza</p>
            </div>
            <span className="text-green-400 text-sm">{inStock}</span>
          </div>
          <div className="flex items-center justify-between px-2 py-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <p className="text-white/60 text-sm">Non disponibili</p>
            </div>
            <span className="text-red-400 text-sm">{outOfStock}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SparePartsStatus;
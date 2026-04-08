"use client";

import { useState, useEffect } from "react";
import { getScans } from "@/api/scan";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/app/i18n";

export default function LastScanPopup({ onClose }) {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { user, selectedShipId: shipId } = useUser();
  const router = useRouter();

  const { t, i18n } = useTranslation("header");
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!user?.id || !shipId) return;
    getScans({ shipId, userId: user.id })
      .then((data) => setScans(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, shipId]);

  if (!mounted || !i18n.isInitialized) return null;

  const filtered = scans.filter((scan) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      scan.element?.name?.toLowerCase().includes(q) ||
      scan.element?.serial_number?.toLowerCase().includes(q) ||
      scan.element?.element_model?.ESWBS_code?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#000000ab] z-50">
      <div className="bg-[#022a52] w-full max-w-3xl p-5 rounded-md shadow-lg sm:h-auto h-[100vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[26px] font-semibold">{t("scans")}</h2>
          <button className="text-white text-xl cursor-pointer" onClick={onClose}>
            <svg fill="white" width="24px" height="24px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
              <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
            </svg>
          </button>
        </div>

        <input
          type="text"
          placeholder="Cerca impianto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 bg-white text-black mb-4 rounded-md"
        />

        <div className="space-y-3">
          {loading ? (
            <p className="text-white">{t("loading")}</p>
          ) : filtered.length > 0 ? (
            filtered.map((scan, index) => (
              <div
                key={index}
                onClick={() => { router.push(`/dashboard/impianti/${scan.element_id}`); onClose(); }}
                className="flex items-center gap-3 bg-[#ffffff10] p-3 rounded-md cursor-pointer hover:bg-[#ffffff20] transition"
              >
                <div className="flex-1 min-w-0">
                  

                  <p className="text-xl font-semibold truncate">
                    {scan.element?.name
                      ? scan.element?.name.charAt(0).toUpperCase() + scan.element?.name.slice(1).toLowerCase()
                      : `Elemento #${scan.element_id}`}
                  </p>
                  
                  <div className="flex items-center text-[14px] mt-1 gap-2">
                    <p className="text-[#ffffff80] truncate">
                    {scan.element?.element_model?.ESWBS_code && (
                      <span>{scan.element.element_model.ESWBS_code} · </span>
                    )}
                    S/N {scan.element?.serial_number || "—"}
                  </p>
                    <p className="text-[#ffffff80]">
                    {scan.scanned_at ? new Date(scan.scanned_at).toLocaleString() : "—"}
                  </p>

                  <p className="text-[#ffffff80]">
                    {scan.element?.time_to_work && (
                      <span>Ore di moto: {scan.element?.time_to_work}</span>
                    )}
                  </p>

                  </div>
                </div>
                <svg width="14px" height="14px" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                  <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/>
                </svg>
              </div>
            ))
          ) : (
            <p className="text-[#ffffff60]">{t("no_scan_available")}</p>
          )}
        </div>

        <button
          className="w-full bg-[#789fd6] p-3 mt-4 text-white font-semibold cursor-pointer rounded-md"
          onClick={onClose}
        >
          {t("close")}
        </button>
      </div>
    </div>
  );
}
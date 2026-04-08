"use client";

import { useState, useEffect } from "react";
import LastScanPopup from "./LastScanPopup";
import { useTranslation } from "@/app/i18n";
import { useUser } from "@/context/UserContext";
import { getScans } from "@/api/scan";
import { useRouter } from "next/navigation";

export default function LastScan() {
  const [isOpen, setIsOpen] = useState(false);
  const [lastScan, setLastScan] = useState(null);
  const { user, selectedShipId: shipId } = useUser();
  const router = useRouter();

  const { t, i18n } = useTranslation("header");
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!user?.id || !shipId) return;
    getScans({ shipId, userId: user.id }).then((data) => {
      if (data?.length) {
        // Ordina per scanned_at DESC e prende il primo
        const sorted = [...data].sort((a, b) => new Date(b.scanned_at) - new Date(a.scanned_at));
        setLastScan(sorted[0]);
      }
    });
  }, [user, shipId]);

  if (!mounted || !i18n.isInitialized) return null;

  return (
    <>
      <div
        className="flex items-center rounded-lg w-full cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <div className="">
          {lastScan ? (
            <>
            <p className="text-xs text-[#789fd6]">Ultima scansione</p>
              <p className="text-md font-semibold truncate">
                {lastScan.element?.name
                  ? lastScan.element.name.charAt(0).toUpperCase() + lastScan.element.name.slice(1).toLowerCase()
                  : `Elemento #${lastScan.element_id}`}
              </p>
              <p className="text-[11px] mt-1 text-[#ffffff60] truncate">
                {lastScan.element?.element_model?.ESWBS_code && (
                  <span>{lastScan.element.element_model.ESWBS_code} · </span>
                )}
                S/N {lastScan.element?.serial_number || "—"}
                {lastScan.scanned_at && (
                  <span> · {new Date(lastScan.scanned_at).toLocaleString()}</span>
                )}
                {lastScan.element?.time_to_work && (
                  <span> · Ore di moto: {lastScan.element?.time_to_work}</span>
                )}
                
              </p>
            </>
          ) : (
            <p className="text-xl font-semibold text-white/40">Nessuna scansione</p>
          )}
        </div>
        <svg width="18px" height="18px" className="ml-auto shrink-0" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/>
        </svg>
      </div>

      {isOpen && (
        <LastScanPopup
          onClose={() => setIsOpen(false)}
          shipId={shipId}
          userId={user?.id}
        />
      )}
    </>
  );
}
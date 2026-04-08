"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchElementData } from '@/api/elements';
import InfoCard from '@/components/element/InfoCard';
import DetailsPanel from '@/components/element/DetailsPanel';
import MaintenanceStatus from '@/components/element/MaintenanceStatus';
import SparePartsStatus from '@/components/element/SparePartsStatus';
import DashboardHeader from "@/components/header/DashboardHeader";
import Breadcrumbs from "@/components/dashboard/Breadcrumbs";
import Image from 'next/image';
import Link from "next/link";
import { useUser } from "@/context/UserContext";

const getFacilityIcon = (code) => {
  if (!code) return null;
  const firstDigit = code.trim().charAt(0);
  if (!/^[0-9]$/.test(firstDigit)) return null;
  return `/icons/facilities/Ico${firstDigit}.svg`;
};

const TABS = ["Info", "Manutenzioni", "Ricambi", "Note", "Componenti"];

export default function ElementPage() {
  const { element } = useParams();
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("Info");
  const { user, selectedShipId: shipId } = useUser();
  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      if (element && shipId) {
        const result = await fetchElementData(element, shipId);
        setData(result);
      }
    };
    getData();
  }, [element, shipId]);

  if (!data) return (
    <div className="flex flex-col bg-[#001c38] text-white p-4 min-h-screen">
      <DashboardHeader />
    </div>
  );

  const icon = getFacilityIcon(data.model?.ESWBS_code);

  return (
    <div className="flex flex-col bg-[#001c38] text-white p-4 min-h-screen">
      <DashboardHeader />

      <div className="flex w-full items-center mt-4">
        <Breadcrumbs />
      </div>

      {/* HEADER */}
      <div className="flex items-center pt-4 pb-3 gap-3">
        {icon && <Image src={icon} alt="icon" width={28} height={28} className="opacity-70 flex-shrink-0" />}
        <div className="min-w-0">
          <p className="text-white/40 text-xs font-mono">{data.model?.ESWBS_code}</p>
          <h2 className="text-xl font-bold truncate">{data.element?.name || ""}</h2>
        </div>

        <div className="ml-auto flex items-center gap-2 flex-shrink-0">
          {/* Navigazione al padre */}
          {data.parent && (
            <button
              onClick={() => router.push(`/dashboard/impianti/${data.parent.element.id}`)}
              className="flex items-center gap-1 bg-[#ffffff10] hover:bg-[#ffffff20] text-white/70 text-xs py-1 px-3 rounded-md transition"
            >
              <svg width="10" height="10" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"/>
              </svg>
              {data.parent.model?.ESWBS_code}
            </button>
          )}

          {data.model?.ElementModel_installation_drawing_link && (
            <Link href={data.model.ElementModel_installation_drawing_link} target="_blank">
              <button className="flex items-center gap-1 bg-[#789fd6] hover:bg-blue-500 text-white text-sm py-1 px-3 rounded-md transition">
                <Image src="/icons/download.svg" alt="download" width={14} height={14} />
                Downloads
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-1 mb-4 border-b border-white/10 overflow-x-auto">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab
                ? "border-b-2 border-[#789fd6] text-white"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            {tab}
            {tab === "Manutenzioni" && data.maintenances?.length > 0 && (
              <span className="ml-1 text-xs bg-[#789fd6] rounded-full px-1.5">{data.maintenances.length}</span>
            )}
            {tab === "Ricambi" && data.spares?.length > 0 && (
              <span className="ml-1 text-xs bg-[#789fd6] rounded-full px-1.5">{data.spares.length}</span>
            )}
            {tab === "Componenti" && data.children?.length > 0 && (
              <span className="ml-1 text-xs bg-[#789fd6] rounded-full px-1.5">{data.children.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      {activeTab === "Info" && (
        <div className="sm:flex block gap-4">
          <div className="sm:w-3/5 w-full bg-[#022a52] p-6 rounded-md sm:mb-0 mb-4">
            <InfoCard data={data} />
            <div className="sm:flex block px-2 mt-4 gap-6">
              <div className="sm:w-1/2 w-full">
                <MaintenanceStatus data={data} />
              </div>
              <div className="sm:w-1/2 w-full">
                <SparePartsStatus data={data} />
              </div>
            </div>
          </div>
          <div className="sm:w-2/5 w-full bg-[#022a52] p-4 rounded-md">
            <DetailsPanel details={data} />
          </div>
        </div>
      )}

      {activeTab === "Manutenzioni" && (
        <div className="bg-[#022a52] rounded-md overflow-hidden">
          {data.maintenances?.length > 0 ? (
            data.maintenances.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between px-4 py-3 border-b border-white/10 hover:bg-white/5 cursor-pointer"
                onClick={() => router.push(`/dashboard/maintenance?eswbs_code=${data.model?.ESWBS_code}`)}
              >
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">{m.name}</p>
                  <div className="flex items-center gap-3 mt-1">
                    {m.recurrency_type && (
                      <span className="text-white/50 text-xs">{m.recurrency_type.name}</span>
                    )}
                    {m.maintenance_level && (
                      <span className="text-white/50 text-xs">{m.maintenance_level.Industry_Level}</span>
                    )}
                    {m.Operational_Not_operational && (
                      <span className="text-white/40 text-xs">{m.Operational_Not_operational}</span>
                    )}
                  </div>
                </div>
                <svg fill="white" className="opacity-40 flex-shrink-0" width="12" height="12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                  <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/>
                </svg>
              </div>
            ))
          ) : (
            <p className="text-white/40 text-sm p-6 text-center">Nessuna manutenzione collegata</p>
          )}
        </div>
      )}

      {activeTab === "Ricambi" && (
        <div className="bg-[#022a52] rounded-md overflow-hidden">
          {data.spares?.length > 0 ? (
            data.spares.map((s) => (
              <div
                key={s.ID}
                className="flex items-center justify-between px-4 py-3 border-b border-white/10 hover:bg-white/5 cursor-pointer"
                onClick={() => router.push(`/dashboard/spare/${s.ID}`)}
              >
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">{s.Part_name}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-white/50 text-xs">S/N: {s.Serial_number}</span>
                    {s.quantity && (
                      <span className={`text-xs ${parseFloat(s.quantity) > 0 ? "text-green-400" : "text-red-400"}`}>
                        Qty: {s.quantity}
                      </span>
                    )}
                    {s.NSN && <span className="text-white/40 text-xs">NSN: {s.NSN}</span>}
                  </div>
                </div>
                <svg fill="white" className="opacity-40 flex-shrink-0" width="12" height="12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                  <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/>
                </svg>
              </div>
            ))
          ) : (
            <p className="text-white/40 text-sm p-6 text-center">Nessun ricambio collegato</p>
          )}
        </div>
      )}

      {activeTab === "Note" && (
        <div className="bg-[#022a52] rounded-md p-4 flex flex-col gap-6">
          {/* Foto */}
          {data.notes?.photos?.length > 0 && (
            <div>
              <h3 className="text-[#789fd6] text-sm font-semibold mb-3">Note fotografiche ({data.notes.photos.length})</h3>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {data.notes.photos.map((p) => (
                  <Image key={p.id} src={p.image_url} alt="note" width={80} height={80}
                    className="rounded-lg object-cover flex-shrink-0 cursor-pointer hover:opacity-80"
                    style={{ width: 80, height: 80 }}
                    onClick={() => window.open(p.image_url, "_blank")}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Testo */}
          {data.notes?.text?.length > 0 && (
            <div>
              <h3 className="text-[#789fd6] text-sm font-semibold mb-3">Note testuali ({data.notes.text.length})</h3>
              <div className="flex flex-col gap-2">
                {data.notes.text.map((n) => (
                  <div key={n.id} className="bg-[#00000030] p-3 rounded-md">
                    <p className="text-white/50 text-xs mb-1">
                      {n.authorDetails ? `${n.authorDetails.first_name} ${n.authorDetails.last_name}` : ""}
                      {" · "}{new Date(n.created_at).toLocaleString()}
                    </p>
                    <p className="text-white text-sm">{n.text_field}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!data.notes?.photos?.length && !data.notes?.text?.length && !data.notes?.vocal?.length && (
            <p className="text-white/40 text-sm text-center">Nessuna nota disponibile</p>
          )}
        </div>
      )}

      {activeTab === "Componenti" && (
        <div className="bg-[#022a52] rounded-md overflow-hidden">
          {data.children?.length > 0 ? (
            data.children.map((c) => (
              <div
                key={c.element.id}
                className="flex items-center justify-between px-4 py-3 border-b border-white/10 hover:bg-white/5 cursor-pointer"
                onClick={() => router.push(`/dashboard/impianti/${c.element.id}`)}
              >
                <div className="min-w-0">
                  <p className="text-white/40 text-xs font-mono">{c.model?.ESWBS_code}</p>
                  <p className="text-white text-sm font-medium truncate">{c.element.name}</p>
                  {c.element.serial_number && (
                    <p className="text-white/40 text-xs">S/N: {c.element.serial_number}</p>
                  )}
                </div>
                <svg fill="white" className="opacity-40 flex-shrink-0" width="12" height="12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                  <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/>
                </svg>
              </div>
            ))
          ) : (
            <p className="text-white/40 text-sm p-6 text-center">Nessun componente figlio</p>
          )}
        </div>
      )}
    </div>
  );
}
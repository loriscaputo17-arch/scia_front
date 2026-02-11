"use client";
import { useState } from "react";
import EditSiteModal from "@/components/admin/sites/EditSiteModal";

export default function SitesTable({ sites, onUpdate }) {
  const [search, setSearch] = useState("");
  const [selectedSite, setSelectedSite] = useState(null);

  if (!sites || sites.length === 0)
    return (
      <p className="text-gray-500 text-sm italic">
        Nessun cantiere trovato.
      </p>
    );

  // Filtro per nome azienda
  const filteredSites = sites.filter((s) =>
    s.companyName?.toLowerCase().includes(search.toLowerCase())
  );

  const handleRowClick = (site) => {
    setSelectedSite(site);
  };

  const handleSave = (updatedSite) => {
    if (onUpdate) onUpdate(updatedSite);
    setSelectedSite(null);
  };

  const handleCancel = () => {
    setSelectedSite(null);
  };

  return (
    <div className="space-y-4">

      {/* TABELLA CANTIERI */}
      <div className="overflow-x-auto bg-gray-50 shadow-xl rounded-xl relative">
        <table className="min-w-full rounded-xl divide-y divide-gray-200">
          <thead className="bg-gray-100 text-gray-600 uppercase text-sm font-semibold tracking-wide">
            <tr>
              <th className="px-6 py-4 text-left rounded-tl-xl">Nome</th>
              <th className="px-6 py-4 text-left">Indirizzo</th>
              <th className="px-6 py-4 text-left">Paese</th>
              <th className="px-6 py-4 text-left rounded-tr-xl">NCAGE</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {filteredSites.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-400">
                  Nessun cantiere trovato
                </td>
              </tr>
            ) : (
              filteredSites.slice(0, 5).map((s, idx) => (
                <tr
                  key={s.ID}
                  onClick={() => handleRowClick(s)}
                  className={`transition-all duration-300 cursor-pointer hover:bg-blue-50 ${
                    idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {s.companyName}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{s.address}</td>
                  <td className="px-6 py-4 text-gray-600">{s.country}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {s.organizationCompanyNCAGE?.Organization_name || "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODALE DETTAGLIO/MODIFICA */}
      {selectedSite && (
        <EditSiteModal
          site={selectedSite}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}

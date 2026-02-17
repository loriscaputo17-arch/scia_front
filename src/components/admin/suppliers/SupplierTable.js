"use client";

import { useState } from "react";
import EditOwnerModal from "@/components/admin/suppliers/EditSupplierModal";

export default function OwnersTable({ owners, onUpdate }) {
  const [search, setSearch] = useState("");
  const [selectedOwner, setSelectedOwner] = useState(null);

  const filteredOwners = owners.filter(
    (o) =>
      o.Organization_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.NCAGE_Code?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (updatedOwner) => {
    if (onUpdate) onUpdate(updatedOwner);
    setSelectedOwner(null);
  };

  return (
    <div className="space-y-4">
      {/* 🔎 Barra di ricerca */}
      <div className="bg-white shadow-md rounded-xl p-4 flex flex-wrap gap-3 items-center border border-gray-100">
        <input
          type="text"
          placeholder="Cerca per nome azienda o organizzazione..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-200 focus:outline-none w-full sm:w-80"
        />
      </div>

      {/* 📋 Tabella */}
      <div className="overflow-x-auto bg-gray-50 shadow-xl rounded-xl relative">
        <table className="min-w-full rounded-xl divide-y divide-gray-200">
          <thead className="bg-gray-100 text-gray-600 uppercase text-sm font-semibold tracking-wide">
            <tr>
              <th className="px-6 py-4 text-left rounded-tl-xl">ID</th>
              <th className="px-6 py-4 text-left">Organizzazione</th>
              <th className="px-6 py-4 text-left">Indirizzo</th>
              <th className="px-6 py-4 text-left">Paese</th>
              <th className="px-6 py-4 text-left rounded-tr-xl">NCAGE</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {filteredOwners.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-400">
                  Nessun owner trovato
                </td>
              </tr>
            ) : (
              filteredOwners.map((owner, idx) => (
                <tr
                  key={owner.ID}
                  onClick={() => setSelectedOwner(owner)}
                  className={`transition-all duration-300 hover:bg-blue-50 cursor-pointer ${
                    idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="px-6 py-4">{owner.ID}</td>

                  <td className="px-6 py-4 font-medium text-gray-900">
                    {owner.Organization_name || "-"}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {owner.City || "-"}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {owner.Country || "-"}
                  </td>

                  <td className="px-6 py-4 text-gray-700">
                    {owner.NCAGE_Code || "—"}
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🧱 Modale Modifica */}
      {selectedOwner && (
        <EditOwnerModal
          owner={selectedOwner}
          onSave={handleSave}
          onCancel={() => setSelectedOwner(null)}
        />
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import EditMaintenanceLevelModal from "./EditMaintenanceLevelModal";

export default function MaintenanceLevelTable({ levels, onLevelUpdated }) {
  const [selectedLevel, setSelectedLevel] = useState(null);

  const handleRowClick = (level) => {
    setSelectedLevel(level);
  };

  const handleSave = (updated) => {
    setSelectedLevel(null);
    if (onLevelUpdated) onLevelUpdated(updated);
  };

  return (
    <div className="overflow-x-auto bg-gray-50 shadow-xl rounded-xl relative">
      <table className="min-w-full rounded-xl divide-y divide-gray-200">
        <thead className="bg-gray-100 text-gray-600 uppercase text-sm font-semibold tracking-wide">
          <tr>
            <th className="px-6 py-4 text-left rounded-tl-xl">ID</th>
            <th className="px-6 py-4 text-left">Nome Livello</th>
            <th className="px-6 py-4 text-left">Descrizione</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 text-sm">
          {levels.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-6 text-gray-400">
                Nessun livello trovato
              </td>
            </tr>
          ) : (
            levels.map((lvl, idx) => (
              <tr
                key={lvl.id}
                onClick={() => handleRowClick(lvl)}
                className={`transition-all duration-300 hover:bg-blue-50 cursor-pointer ${
                  idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <td className="px-6 py-4">{lvl.id}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{lvl.Industry_Level}</td>
                <td className="px-6 py-4">{lvl.Description}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {selectedLevel && (
        <EditMaintenanceLevelModal
          level={selectedLevel}
          onCancel={() => setSelectedLevel(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

"use client";
import { useState } from "react";
import { X, Plus, Save } from "lucide-react";

export default function AddTeamsModal({ onClose }) {
  const [newTeams, setNewTeams] = useState([
    { name: "", role: "", manager: "", email: "", active: true },
  ]);
  const [activeTab, setActiveTab] = useState(0);

  const handleTeamChange = (index, field, value) => {
    const updated = [...newTeams];
    updated[index][field] = value;
    setNewTeams(updated);
  };

  const addTeamRow = () =>
    setNewTeams([...newTeams, { name: "", role: "", manager: "", email: "", active: true }]);
  const removeTeamRow = (index) => setNewTeams(newTeams.filter((_, i) => i !== index));
  const submitTeams = () => {
    onClose();
  };

const inputClass =
    "px-4 py-2 rounded-xl bg-gray-50 text-gray-900 border border-gray-200 placeholder-gray-400 focus:outline-none transition";

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-3xl relative text-gray-900">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition cursor-pointer"
        >
          <X size={24} />
        </button>

        <h3 className="text-2xl font-semibold mb-6 text-gray-900">Aggiungi Nuove Manutenzioni</h3>

        {/* Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {newTeams.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition whitespace-nowrap cursor-pointer ${
                activeTab === idx
                  ? "bg-blue-100 text-blue-600 shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Manutezione {idx + 1}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="space-y-4 max-h-[55vh] overflow-y-auto">
          {newTeams.map((team, idx) => (
            <div key={idx} className={activeTab === idx ? "block" : "hidden"}>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nome"
                  className={inputClass}
                  value={team.name}
                  onChange={(e) => handleTeamChange(idx, "name", e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Descrizione"
                  className={inputClass}
                  value={team.role}
                  onChange={(e) => handleTeamChange(idx, "role", e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Responsabile"
                  className={inputClass}
                  value={team.manager}
                  onChange={(e) => handleTeamChange(idx, "manager", e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Impianto"
                  className={inputClass}
                  value={team.email}
                  onChange={(e) => handleTeamChange(idx, "email", e.target.value)}
                />
              </div>
              <button
                onClick={() => removeTeamRow(idx)}
                className="mt-3 text-red-500 hover:text-red-600 font-medium transition flex items-center gap-1 cursor-pointer"
              >
                <X size={16} /> Rimuovi Manutenzione
              </button>
            </div>
          ))}
        </div>

        {/* Bottom action buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={addTeamRow}
            className="flex items-center gap-2 px-5 py-3 bg-blue-200/30 hover:bg-blue-200 text-blue-600 font-semibold rounded-2xl cursor-pointer transition"
          >
            <Plus size={18} /> Aggiungi Manutenzione
          </button>
          <button
            onClick={submitTeams}
            className="flex items-center gap-2 px-6 py-3 bg-green-200/30 hover:bg-green-200 text-green-600 font-semibold rounded-2xl cursor-pointer transition"
          >
            <Save size={18} /> Salva Tutte
          </button>
        </div>
      </div>
    </div>
  );
}

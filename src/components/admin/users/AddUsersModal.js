"use client";

import { useState } from "react";
import { X, Plus, Save } from "lucide-react";
import { createUsers } from "@/api/admin/users";
import Input from "@/components/admin/materials/Input";

const ROLES = [
  { value: "Admin", label: "Admin" },
  { value: "Member", label: "Member" },
  { value: "Chief Engineer", label: "Chief Engineer" },
  { value: "Comandante", label: "Comandante" },
];

export default function AddUsersModal({ onClose, onAdded }) {
  const [newUsers, setNewUsers] = useState([
    { first_name: "", last_name: "", email: "", password: "", role_name: "Member" },
  ]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (index, field, value) => {
    const updated = [...newUsers];
    updated[index][field] = value;
    setNewUsers(updated);
  };

  const addUser = () =>
    setNewUsers([
      ...newUsers,
      { first_name: "", last_name: "", email: "", password: "", role_name: "Member" },
    ]);

  const removeUser = (index) => {
    if (newUsers.length === 1) {
      alert("Devi avere almeno un utente");
      return;
    }
    setNewUsers(newUsers.filter((_, i) => i !== index));
    if (activeTab >= newUsers.length - 1) {
      setActiveTab(Math.max(0, activeTab - 1));
    }
  };

  const handleSubmit = async () => {
    // Validazione base
    const invalidUsers = newUsers.filter(
      (u) => !u.first_name || !u.last_name || !u.email || !u.password
    );
    
    if (invalidUsers.length > 0) {
      alert("Compila tutti i campi obbligatori per ogni utente");
      return;
    }

    try {
      setLoading(true);
      await createUsers(newUsers);
      if (onAdded) onAdded();
      onClose();
      window.location.reload();
    } catch (err) {
      console.error("Errore creazione utenti:", err);
      alert("Errore durante la creazione utenti");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg text-gray-900">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Aggiungi Nuovi Utenti</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors cursor-pointer "
          >
            <X size={24} />
          </button>
        </div>

        {/* Tab Navigation */}
        {newUsers.length > 1 && (
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {newUsers.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === idx
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                Utente {idx + 1}
              </button>
            ))}
          </div>
        )}

        {/* User Forms */}
        {newUsers.map((user, idx) => (
          <div
            key={idx}
            className={activeTab === idx ? "block space-y-4" : "hidden"}
          >
            <Input
              label="Nome"
              value={user.first_name}
              onChange={(v) => handleChange(idx, "first_name", v)}
              placeholder="Inserisci il nome"
            />

            <Input
              label="Cognome"
              value={user.last_name}
              onChange={(v) => handleChange(idx, "last_name", v)}
              placeholder="Inserisci il cognome"
            />

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Email
              </label>
              <input
                type="email"
                value={user.email}
                onChange={(e) => handleChange(idx, "email", e.target.value)}
                placeholder="email@esempio.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Password
              </label>
              <input
                type="password"
                value={user.password}
                onChange={(e) => handleChange(idx, "password", e.target.value)}
                placeholder="Inserisci una password"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Ruolo
              </label>
              <select
                value={user.role_name}
                onChange={(e) => handleChange(idx, "role_name", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {newUsers.length > 1 && (
              <button
                onClick={() => removeUser(idx)}
                className="mt-2 text-red-600 hover:text-red-700 font-medium flex items-center gap-1 text-sm transition-colors"
              >
                <X size={16} /> Rimuovi questo utente
              </button>
            )}
          </div>
        ))}

        {/* Action Buttons */}
        <div className="mt-6 flex justify-between gap-3">
          <button
            onClick={addUser}
            disabled={loading}
            className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Aggiungi Utente
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="cursor-pointer px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              Annulla
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`cursor-pointer  flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Salvataggio..." : "Salva Tutti"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
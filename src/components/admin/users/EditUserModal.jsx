"use client";

import { useState, useEffect } from "react";
import { updateUser } from "@/api/admin/users";
import Input from "@/components/admin/materials/Input";

const ROLES = [
  { value: "Admin", label: "Admin" },
  { value: "Member", label: "Member" },
  { value: "Chief Engineer", label: "Chief Engineer" },
  { value: "Comandante", label: "Comandante" },
];

export default function EditUserModal({ user, onSave, onCancel }) {
  const [editData, setEditData] = useState(user);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEditData(user);
    setPassword("");
  }, [user]);

  const handleChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const payload = {
        first_name: editData.first_name,
        last_name: editData.last_name,
        role: editData.role,
        active: editData.active,
      };

      if (password.trim().length > 0) {
        payload.password = password;
      }

      const updated = await updateUser(editData.id, payload);
      onSave(updated);
      window.location.reload();
    } catch (error) {
      console.error("Errore aggiornamento utente:", error);
      alert("Errore durante il salvataggio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg text-gray-900">
        <h3 className="text-xl font-semibold mb-4">Modifica Utente</h3>

        <div className="space-y-4">
          <Input
            label="Nome"
            value={editData.first_name || ""}
            onChange={(v) => handleChange("first_name", v)}
          />

          <Input
            label="Cognome"
            value={editData.last_name || ""}
            onChange={(v) => handleChange("last_name", v)}
          />

          <div>
            <label className="block text-sm font-medium text-gray-800">
              Email
            </label>
            <input
              type="email"
              value={editData.email || ""}
              disabled
              className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800">
              Nuova password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Lascia vuoto per non modificare"
              className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800">
              Ruolo
            </label>
            <select
              value={editData.role || ""}
              onChange={(e) => handleChange("role", e.target.value)}
              className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="" disabled>
                Seleziona ruolo
              </option>
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800">
              Stato
            </label>
            <select
              value={editData.active ? "true" : "false"}
              onChange={(e) =>
                handleChange("active", e.target.value === "true")
              }
              className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="true">Attivo</option>
              <option value="false">Disattivo</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            Annulla
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-white ${
              loading
                ? "bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Salvataggio..." : "Salva"}
          </button>
        </div>
      </div>
    </div>
  );
}

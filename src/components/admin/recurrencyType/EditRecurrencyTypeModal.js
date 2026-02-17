"use client";

import { useState } from "react";
import { X, Trash2 } from "lucide-react";
import {
  updateRecurrencyType,
  deleteRecurrencyType,
} from "@/api/admin/recurrencyType";

export default function EditRecurrencyTypeModal({ recurrency, onCancel, onSave }) {
  const [form, setForm] = useState(recurrency);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // 🔹 Salvataggio modifiche
  const handleSave = async () => {
    try {
      setLoading(true);
      const updated = await updateRecurrencyType(recurrency.id, form);
      onSave(updated);
    } catch (err) {
      console.error("Errore aggiornamento ricorrenza:", err);
      alert("Errore durante l'aggiornamento della ricorrenza");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Eliminazione
  const handleDelete = async () => {
    if (!confirm("Sei sicuro di voler eliminare questa ricorrenza?")) return;
    try {
      setDeleting(true);
      await deleteRecurrencyType(recurrency.id);
      alert("Ricorrenza eliminata con successo");
      onSave({ deletedId: recurrency.id });
      onCancel();
    } catch (err) {
      console.error("Errore eliminazione ricorrenza:", err);
      alert("Errore durante l'eliminazione della ricorrenza");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative text-gray-900">
        {/* ❌ Chiudi */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={22} />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Modifica Ricorrenza #{recurrency.id}
        </h2>

        <div className="space-y-4">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nome Ricorrenza
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          {/* Descrizione */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Descrizione
            </label>
            <textarea
              value={form.description || ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none"
              rows={4}
            />
          </div>
        </div>

        <div className="flex justify-between mt-6">
          {/* 🗑 Elimina */}
          <button
            onClick={handleDelete}
            disabled={deleting}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white transition ${
              deleting
                ? "bg-red-300 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {deleting ? "Eliminazione..." : "Elimina"}
          </button>

          {/* 💾 Salva */}
          <button
            onClick={handleSave}
            disabled={loading}
            className={`px-5 py-2 rounded-lg text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
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

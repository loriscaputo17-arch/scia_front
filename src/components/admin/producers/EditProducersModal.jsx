"use client";

import { useEffect, useState } from "react";
import { updateOrganization } from "@/api/admin/organizations";
import ProducerForm from "@/components/admin/materials/ProducerForm";
import NCAGEForm from "@/components/admin/materials/NCAGEForm";

export default function EditOwnerModal({ owner, onSave, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState(null);
  const [hasNCAGE, setHasNCAGE] = useState(false);

  useEffect(() => {
    setEditData({ ...owner });
    setHasNCAGE(!!owner.NCAGE_Code);
  }, [owner]);

  if (!editData) return null;

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const payload = {
        Organization_name: editData.Organization_name,
        Country: editData.Country,
        City: editData.City,
        Status: editData.Status,
        Street_Line_1: editData.Street_Line_1,
        Street_Line_2: editData.Street_Line_2,
        Postal_code: editData.Postal_code,
        Website: editData.Website,
        Phone_number: editData.Phone_number,
        Fax_number: editData.Fax_number,
        NCAGE_Code: hasNCAGE ? editData.NCAGE_Code : null,
      };

      console.log(payload)

      const updated = await updateOrganization(editData.ID, payload);

      onSave(updated.organization ?? updated);
    } catch (err) {
      console.error(err);
      alert("Errore durante il salvataggio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col text-gray-900">
        <div className="p-6">
          <h3 className="text-xl font-semibold">Modifica Produttore</h3>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProducerForm
              data={editData}
              onChange={setEditData}
              hasNCAGE={hasNCAGE}
              setHasNCAGE={setHasNCAGE}
            />

            {hasNCAGE && (
              <NCAGEForm
                data={editData}
                onChange={setEditData}
              />
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-white p-4 flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
          >
            Annulla
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-white ${
              loading ? "bg-gray-500" : "bg-blue-700 hover:bg-blue-800"
            }`}
          >
            {loading ? "Salvataggio..." : "Salva"}
          </button>
        </div>
      </div>
    </div>
  );
}

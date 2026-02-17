"use client";

import { useEffect, useState } from "react";
import { updateShipyard } from "@/api/admin/shipyards";
import OwnerForm from "@/components/admin/materials/OwnerForm";
import NCAGEForm from "@/components/admin/materials/NCAGEForm";

export default function EditSiteModal({ site, onSave, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [hasNCAGE, setHasNCAGE] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    setEditData({
      ...site,
      organizationCompanyNCAGE: site.organizationCompanyNCAGE || {
        NCAGE_Code: "",
        Organization_name: "",
        Country: "",
        City: "",
        Status: "",
        Street_Line_1: "",
        Street_Line_2: "",
        Postal_code: "",
        Website: "",
        Phone_number: "",
        Fax_number: "",
        Entity: "Shipyard",
      },
    });
    setHasNCAGE(!!site.organizationCompanyNCAGE);
  }, [site]);

  if (!editData) return null;

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const payload = {
        companyName: editData.companyName,
        address: editData.address,
        country: editData.country,
        hasNCAGE,
        organizationCompanyNCAGE: hasNCAGE
          ? { ...editData.organizationCompanyNCAGE, Entity: "Shipyard" }
          : null,
      };
      const updated = await updateShipyard(editData.ID, payload);
      onSave(updated);
    } catch (error) {
      console.error(error);
      alert("Errore durante l'aggiornamento del cantiere");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col text-gray-900">
        <div className="p-6">
          <h3 className="text-xl font-semibold">Modifica Cantiere</h3>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <OwnerForm
              data={editData}
              hasNCAGE={hasNCAGE}
              setHasNCAGE={setHasNCAGE}
              onChange={setEditData}
            />

            {hasNCAGE && (
              <NCAGEForm
                data={editData.organizationCompanyNCAGE}
                onChange={(updater) =>
                  setEditData((prev) => ({
                    ...prev,
                    organizationCompanyNCAGE:
                      typeof updater === "function"
                        ? updater(prev.organizationCompanyNCAGE)
                        : updater,
                  }))
                }
              />
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-white p-4 flex justify-end gap-3 rounded-xl">
          <button
            onClick={onCancel}
            disabled={loading}
            className="cursor-pointer px-4 py-2 rounded-lg bg-gray-300 text-gray-900 hover:bg-gray-400"
          >
            Annulla
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`cursor-pointer px-4 py-2 rounded-lg text-white ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-700 hover:bg-blue-800"
            }`}
          >
            {loading ? "Salvataggio..." : "Salva"}
          </button>
        </div>
      </div>
    </div>
  );
}


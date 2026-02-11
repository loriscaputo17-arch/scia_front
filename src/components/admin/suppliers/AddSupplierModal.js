"use client";

import { useState } from "react";
import { updateOwner } from "@/api/admin/owners";
import OwnerCreateForm from "@/components/admin/materials/SupplierCreateForm";
import NCAGEForm from "@/components/admin/materials/NCAGEForm";
import OwnersTabs from "@/components/admin/materials/SupplierTabs";

const emptyOwner = {
  companyName: "",
  Organisation_name: "",
  address: "",
  country: "Italia",
  armedForces: "",
  organizationCompanyNCAGE: {
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
    Entity: "Owner",
  },
};

export default function AddOwnersModal({ onClose, onAdded }) {
  const [owners, setOwners] = useState([{ ...emptyOwner }]);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasNCAGEMap, setHasNCAGEMap] = useState({ 0: false });

  const updateOwnerData = (index, updater) => {
    setOwners((prev) =>
      prev.map((o, i) =>
        i === index ? (typeof updater === "function" ? updater(o) : updater) : o
      )
    );
  };

  const addOwner = () => {
    setOwners((prev) => [...prev, { ...emptyOwner }]);
    setHasNCAGEMap((prev) => ({ ...prev, [owners.length]: false }));
    setActiveTab(owners.length);
  };

  const removeOwner = (index) => {
    setOwners((prev) => prev.filter((_, i) => i !== index));
    setActiveTab(0);
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const payloads = owners.map((o, idx) => ({
        companyName: o.companyName,
        Organisation_name: o.Organisation_name,
        address: o.address,
        country: o.country,
        armedForces: o.armedForces,
        hasNCAGE: hasNCAGEMap[idx],
        organizationCompanyNCAGE: hasNCAGEMap[idx]
          ? { ...o.organizationCompanyNCAGE, Entity: "Supplier" }
          : null,
      }));

      const created = [];
      for (const p of payloads) {
        const res = await updateOwner("create", p);
        created.push(res);
      }

      onAdded(created);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Errore durante il salvataggio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col text-gray-900">
        <div className="p-6">
          <h3 className="text-xl font-semibold">Aggiungi Distributore</h3>
        </div>

        <div className="px-6">
          <OwnersTabs
            owners={owners}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <OwnerCreateForm
              data={owners[activeTab]}
              hasNCAGE={hasNCAGEMap[activeTab]}
              setHasNCAGE={(v) =>
                setHasNCAGEMap((prev) => ({ ...prev, [activeTab]: v }))
              }
              onChange={(updater) => updateOwnerData(activeTab, updater)}
            />

            {hasNCAGEMap[activeTab] && (
              <NCAGEForm
                data={owners[activeTab].organizationCompanyNCAGE}
                onChange={(updater) =>
                  updateOwnerData(activeTab, (prev) => ({
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

          <button
            onClick={() => removeOwner(activeTab)}
            className="mt-4 text-red-600 hover:text-red-700"
          >
            Rimuovi Distributore
          </button>
        </div>

        <div className="sticky bottom-0 bg-white p-4 flex justify-between rounded-xl">
          <button
            onClick={addOwner}
            className="cursor-pointer px-4 py-2 rounded-lg bg-gray-200 text-gray-900 hover:bg-gray-300"
          >
            Aggiungi Distributore
          </button>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="cursor-pointer px-4 py-2 rounded-lg bg-gray-300 text-gray-900"
            >
              Annulla
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className={`cursor-pointer px-4 py-2 rounded-lg text-white ${
                loading
                  ? "bg-gray-500"
                  : "bg-blue-700 hover:bg-blue-800"
              }`}
            >
              {loading ? "Salvataggio..." : "Salva"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

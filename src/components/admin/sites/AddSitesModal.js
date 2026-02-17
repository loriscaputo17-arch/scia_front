"use client";

import { useState } from "react";
import { X, Plus, Save } from "lucide-react";
import { createShipyards } from "@/api/admin/shipyards";
import Form from "@/components/admin/materials/Form";
import NCAGEForm from "@/components/admin/materials/NCAGEForm";

const emptyNCAGE = {
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
};

const emptySite = {
  companyName: "",
  address: "",
  country: "Italia",
  hasNCAGE: false,
  organizationCompanyNCAGE: { ...emptyNCAGE },
};

export default function AddSitesModal({ onClose, onAdded }) {
  const [sites, setSites] = useState([{ ...emptySite }]);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);

  const updateSite = (index, updater) => {
    setSites((prev) =>
      prev.map((s, i) =>
        i === index
          ? typeof updater === "function"
            ? updater(s)
            : updater
          : s
      )
    );
  };

  const addSite = () => {
    setSites((prev) => [...prev, { ...emptySite }]);
    setActiveTab(sites.length);
  };

  const removeSite = (index) => {
    if (sites.length === 1) return;
    setSites((prev) => prev.filter((_, i) => i !== index));
    setActiveTab((prev) => Math.max(0, prev - 1));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const payload = sites.map((s) => ({
        companyName: s.companyName,
        address: s.address,
        country: s.country,
        hasNCAGE: s.hasNCAGE,
        organizationCompanyNCAGE: s.hasNCAGE
          ? { ...s.organizationCompanyNCAGE, Entity: "Shipyard" }
          : null,
      }));

      const created = await createShipyards(payload);
      if (onAdded) onAdded(created);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Errore durante la creazione dei cantieri");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col text-gray-900">
        <div className="p-6 flex justify-between items-center">
          <h3 className="text-xl font-semibold">Aggiungi Cantieri</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={22} />
          </button>
        </div>

        <div className="px-6 pt-4 flex gap-2 overflow-x-auto">
          {sites.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeTab === idx
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Cantiere {idx + 1}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {sites.map((site, idx) =>
            idx !== activeTab ? null : (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Form
                  data={site}
                  hasNCAGE={site.hasNCAGE}
                  setHasNCAGE={(val) =>
                    updateSite(idx, (prev) => ({ ...prev, hasNCAGE: val }))
                  }
                  onChange={(updater) =>
                    updateSite(idx, (prev) =>
                      typeof updater === "function"
                        ? updater(prev)
                        : updater
                    )
                  }
                />

                {site.hasNCAGE && (
                  <NCAGEForm
                    data={site.organizationCompanyNCAGE}
                    onChange={(updater) =>
                      updateSite(idx, (prev) => ({
                        ...prev,
                        organizationCompanyNCAGE:
                          typeof updater === "function"
                            ? updater(prev.organizationCompanyNCAGE)
                            : updater,
                      }))
                    }
                  />
                )}

                <div className="md:col-span-2">
                  <button
                    onClick={() => removeSite(idx)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Rimuovi questo cantiere
                  </button>
                </div>
              </div>
            )
          )}
        </div>

        <div className="sticky bottom-0 bg-white p-4 flex justify-between items-center rounded-xl">
          <button
            onClick={addSite}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200"
          >
            Aggiungi Cantiere
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-700 hover:bg-green-700"
            }`}
          >
            {loading ? "Salvataggio..." : "Salva"}
          </button>
        </div>
      </div>
    </div>
  );
}

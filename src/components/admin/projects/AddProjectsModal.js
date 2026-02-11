"use client";
import { useState, useEffect } from "react";
import { X, Save, Plus } from "lucide-react";
import { getShipyards, getShipModels } from "@/api/admin/shipyards";
import { getUsers } from "@/api/admin/users";
import SelectShipModal from "./SelectShipModal";
import AddShipNameModal from "./AddShipNameModal"; 

export default function AddProjectsModal({ onClose, onSave }) {
  const [activeTab, setActiveTab] = useState(0);

  const [shipyards, setShipyards] = useState([]);
  const [owners, setOwners] = useState([]);
  const [shipModels, setShipModels] = useState([]);

  const [showShipModelModal, setShowShipModelModal] = useState(false);
  const [showShipNameModal, setShowShipNameModal] = useState(false);

  const [projectData, setProjectData] = useState({
    general: {
      name: "",
      description: "",
      houseofride: "",
      date_order: "",
      date_delivery: "",
      owner_id: "",
      shipyard_builder_id: "",
    },

    ship: {
      selectedModelId: "",
      shipsByModel: {
      },
      tempShipName: "",
    },
    documents: { contractFiles: [], technicalDocs: [], mmi: [], other: [] },
    details: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const shipyardData = await getShipyards();
        setShipyards(shipyardData);

        const usersData = await getUsers();
        setOwners(usersData);

        const modelsData = await getShipModels();
        setShipModels(modelsData);

      } catch (err) {
        console.error("Errore nel fetch dropdown:", err);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (section, field, value) => {
    setProjectData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleSaveProjects = () => {
    onSave(projectData); 
    setShowShipModelModal(false)
  };

  const handleModelSelect = (modelId) => {
    setProjectData((prev) => ({
      ...prev,
      ship: {
        ...prev.ship,
        selectedModelId: modelId,
        shipsByModel: {
          ...prev.ship.shipsByModel,
          [modelId]: prev.ship.shipsByModel[modelId] || [],
        },
      },
    }));
  };

  const handleAddShip = () => {
    const { selectedModelId, tempShipName } = projectData.ship;
    if (!selectedModelId || !tempShipName.trim()) return;

    setProjectData((prev) => ({
      ...prev,
      ship: {
        ...prev.ship,
        shipsByModel: {
          ...prev.ship.shipsByModel,
          [selectedModelId]: [
            ...(prev.ship.shipsByModel[selectedModelId] || []),
            { name: tempShipName },
          ],
        },
        tempShipName: "",
      },
    }));
  };

  const inputClass =
    "px-4 py-2 rounded-xl bg-gray-50 text-gray-900 border border-gray-200 placeholder-gray-400 focus:outline-none transition w-full";
  const selectClass =
    "px-4 py-2 rounded-xl bg-gray-50 text-gray-900 border border-gray-200 focus:outline-none transition w-full";

  return (
    <>
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-4xl relative text-gray-900">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition cursor-pointer"
          >
            <X size={24} />
          </button>

          <h3 className="text-xl font-semibold mb-6 text-gray-900">
            Aggiungi Nuova Commessa
          </h3>

          {/* Tabs */}
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {[
              "Informazioni generali",
              "Nave",
            ].map((label, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`px-3 py-2 text-sm font-medium rounded-full transition whitespace-nowrap cursor-pointer ${
                  activeTab === idx
                    ? "bg-blue-100 text-blue-600 shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="space-y-4 h-[55vh] overflow-y-auto">
            {activeTab === 0 && (
              <div className="grid grid-cols-2 gap-4">
                {/* Nome Commessa */}
                <input
                  type="text"
                  placeholder="Nome Commessa"
                  className={inputClass}
                  value={projectData.general.name}
                  onChange={(e) =>
                    handleInputChange("general", "name", e.target.value)
                  }
                />

                {/* Cliente */}
                <input
                  type="text"
                  placeholder="Cliente"
                  className={inputClass}
                  value={projectData.general.houseofride}
                  onChange={(e) =>
                    handleInputChange("general", "houseofride", e.target.value)
                  }
                />

                {/* Descrizione */}
                <textarea
                  placeholder="Descrizione commessa"
                  className={inputClass}
                  value={projectData.general.description}
                  onChange={(e) =>
                    handleInputChange("general", "description", e.target.value)
                  }
                />

                {/* Amministratore */}
                <select
                  className={selectClass}
                  value={projectData.general.owner_id}
                  onChange={(e) =>
                    handleInputChange("general", "owner_id", e.target.value)
                  }
                >
                  <option value="">Seleziona Amministratore</option>
                  {owners.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.first_name} {o.last_name}
                    </option>
                  ))}
                </select>

                {/* Cantiere */}
                <select
                  className={selectClass}
                  value={projectData.general.shipyard_builder_id}
                  onChange={(e) =>
                    handleInputChange("general", "shipyard_builder_id", e.target.value)
                  }
                >
                  <option value="">Seleziona Cantiere</option>
                  {shipyards.map((s) => (
                    <option key={s.ID} value={s.ID}>
                      {s.companyName}
                    </option>
                  ))}
                </select>

                {/* Data Ordine */}
                <div>
                  <label>Data Ordine</label>
                  <input
                    type="date"
                    className={inputClass}
                    value={projectData.general.date_order}
                    onChange={(e) =>
                      handleInputChange("general", "date_order", e.target.value)
                    }
                  />
                </div>

                {/* Data Consegna */}
                <div>
                  <label>Data Consegna</label>
                  <input
                    type="date"
                    className={inputClass}
                    value={projectData.general.date_delivery}
                    onChange={(e) =>
                      handleInputChange("general", "date_delivery", e.target.value)
                    }
                  />
                </div>
              </div>
            )}

            {activeTab === 1 && (
              <div className="space-y-6">

                {/* SELEZIONE MODELLO */}
                <div className="flex items-center gap-2">
                  <select
                    className={selectClass}
                    value={projectData.ship.selectedModelId}
                    onChange={(e) => handleModelSelect(e.target.value)}
                  >
                    <option value="">Seleziona Modello Nave</option>
                    {shipModels.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.model_name}
                      </option>
                    ))}
                  </select>

                  {/* CREA NUOVO MODELLO */}
                  <button
                    onClick={() => setShowShipModelModal(true)}
                    className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                {/* AGGIUNTA NAVE */}
                {projectData.ship.selectedModelId && (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Nome Nave"
                      className={inputClass}
                      value={projectData.ship.tempShipName}
                      onChange={(e) =>
                        setProjectData((prev) => ({
                          ...prev,
                          ship: { ...prev.ship, tempShipName: e.target.value },
                        }))
                      }
                    />
                    <button
                      onClick={handleAddShip}
                      className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Aggiungi
                    </button>
                  </div>
                )}

                {/* LISTA NAVI PER MODELLO */}
                <div className="space-y-4">
                  {Object.entries(projectData.ship.shipsByModel).map(
                    ([modelId, ships]) => {
                      const model = shipModels.find(
                        (m) => String(m.id) === String(modelId)
                      );

                      return (
                        <div
                          key={modelId}
                          className="rounded-xl p-4 bg-gray-50"
                        >
                          <h4 className="mb-2">
                            <span className="font-semibold">Modello nave:</span> {model?.model_name || "Modello"}
                          </h4>


                          <h4>Navi:</h4>
                          <ul className="list-disc list-inside text-sm space-y-1">
                            {ships.map((ship, idx) => (
                              <li key={idx}>{ship.name}</li>
                            ))}
                          </ul>
                        </div>
                      );
                    }
                  )}
                </div>

              </div>
            )}

          </div>

          {/* Bottom action buttons */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSaveProjects}
              className={` cursor-pointer px-4 py-2 rounded-lg text-white transition bg-blue-700 hover:bg-blue-800`}            
              >
               Salva
            </button>
          </div>
        </div>
      </div>

      {/* Modali */}
      {showShipModelModal && (
        <SelectShipModal
          onClose={() => setShowShipModelModal(false)}
          onSelectModel={(model) => {
            setShipModels((prev) => {
              const exists = prev.some((m) => String(m.id) === String(model.id));
              return exists ? prev : [...prev, model];
            });
            handleModelSelect(model.id);
            setShowShipModelModal(false);
          }}
        />
      )}

      {showShipNameModal && (
        <AddShipNameModal onClose={() => setShowShipNameModal(false)} />
      )}
    </>
  );
}

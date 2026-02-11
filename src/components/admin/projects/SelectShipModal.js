"use client";
import { useEffect, useState } from "react";
import { X, Plus } from "lucide-react";
import { getShipyards, getShipModels, createShipModel } from "@/api/admin/shipyards";

export default function SelectShipModal({ onClose, onSelectModel }) {
  const [shipModels, setShipModels] = useState([]);
  const [shipyards, setShipyards] = useState([]);
  const [isNew, setIsNew] = useState(false);

  const [newModel, setNewModel] = useState({
    shipyard_id: "",
    model_name: "",
    model_code: "",
    Overall_length_LOA: "",
    Breadth_moulded_Bmax: "",
    Depth_moulded_D: "",
    Max_Draft: "",
    Displacement_fully_loaded: "",
    Maximum_Speed: "",
    Cruising_speed: "",
    Range: "",
    Logistic_range: "",
    Crew: "",
    Ship_Logistic_Model_Identification: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const [models, yards] = await Promise.all([
        getShipModels(),
        getShipyards(),
      ]);
      setShipModels(models);
      setShipyards(yards);
    };
    fetchData();
  }, []);

  const handleCreate = async () => {
    if (!newModel.model_name) {
      alert("Nome modello obbligatorio");
      return;
    }

    const payload = {
      ...newModel,
      shipyard_id: newModel.shipyard_id || null,
    };

    const created = await createShipModel(payload);
    onSelectModel(created);
  };

  const inputClass =
    "px-4 py-2 rounded-xl bg-gray-50 text-gray-900 border border-gray-200 placeholder-gray-400 focus:outline-none transition w-full";
  const selectClass =
    "px-4 py-2 rounded-xl bg-gray-50 text-gray-900 border border-gray-200 focus:outline-none transition w-full";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-4xl relative">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X size={24} />
        </button>

        <h3 className="text-xl font-semibold mb-6 text-gray-900">
          Seleziona o Crea Modello Nave
        </h3>

        {/* === SELEZIONE MODELLO ESISTENTE === */}
        {!isNew ? (
          <>
            <div className="grid grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
              {shipModels.map((m) => (
                <button
                  key={m.id}
                  onClick={() => onSelectModel(m)}
                  className="border rounded-xl p-4 hover:bg-blue-50 text-left"
                >
                  <div className="font-semibold text-gray-900">
                    {m.model_name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {m.model_code}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setIsNew(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white"
              >
                <Plus size={18} /> Nuovo modello
              </button>
            </div>
          </>
        ) : (
          /* === CREAZIONE NUOVO MODELLO === */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[65vh] overflow-y-auto pr-2">

            {/* COLONNA SX */}
            <div className="space-y-3">
              <select
                className={selectClass}
                value={newModel.shipyard_id}
                onChange={(e) =>
                  setNewModel({ ...newModel, shipyard_id: e.target.value })
                }
              >
                <option value="">Cantiere (opzionale)</option>
                {shipyards.map((s) => (
                  <option key={s.ID} value={s.ID}>
                    {s.companyName}
                  </option>
                ))}
              </select>

              <input
                className={inputClass}
                placeholder="Nome modello"
                value={newModel.model_name}
                onChange={(e) =>
                  setNewModel({ ...newModel, model_name: e.target.value })
                }
              />

              <input
                className={inputClass}
                placeholder="Codice modello"
                value={newModel.model_code}
                onChange={(e) =>
                  setNewModel({ ...newModel, model_code: e.target.value })
                }
              />

              <input
                className={inputClass}
                placeholder="LOA (m)"
                value={newModel.Overall_length_LOA}
                onChange={(e) =>
                  setNewModel({ ...newModel, Overall_length_LOA: e.target.value })
                }
              />

              <input
                className={inputClass}
                placeholder="Bmax (m)"
                value={newModel.Breadth_moulded_Bmax}
                onChange={(e) =>
                  setNewModel({ ...newModel, Breadth_moulded_Bmax: e.target.value })
                }
              />

              <input
                className={inputClass}
                placeholder="Depth (m)"
                value={newModel.Depth_moulded_D}
                onChange={(e) =>
                  setNewModel({ ...newModel, Depth_moulded_D: e.target.value })
                }
              />

              <input
                className={inputClass}
                placeholder="Logistic Model ID"
                value={newModel.Ship_Logistic_Model_Identification}
                onChange={(e) =>
                  setNewModel({
                    ...newModel,
                    Ship_Logistic_Model_Identification: e.target.value,
                  })
                }
              />
            </div>

            {/* COLONNA DX */}
            <div className="space-y-3">
              <input
                className={inputClass}
                placeholder="Draft (m)"
                value={newModel.Max_Draft}
                onChange={(e) =>
                  setNewModel({ ...newModel, Max_Draft: e.target.value })
                }
              />

              <input
                className={inputClass}
                placeholder="Displacement (t)"
                value={newModel.Displacement_fully_loaded}
                onChange={(e) =>
                  setNewModel({
                    ...newModel,
                    Displacement_fully_loaded: e.target.value,
                  })
                }
              />

              <input
                className={inputClass}
                placeholder="Velocità massima (kn)"
                value={newModel.Maximum_Speed}
                onChange={(e) =>
                  setNewModel({ ...newModel, Maximum_Speed: e.target.value })
                }
              />

              <input
                className={inputClass}
                placeholder="Velocità crociera (kn)"
                value={newModel.Cruising_speed}
                onChange={(e) =>
                  setNewModel({ ...newModel, Cruising_speed: e.target.value })
                }
              />

              <input
                className={inputClass}
                placeholder="Range (nm)"
                value={newModel.Range}
                onChange={(e) =>
                  setNewModel({ ...newModel, Range: e.target.value })
                }
              />

              <input
                className={inputClass}
                placeholder="Logistic range (days)"
                value={newModel.Logistic_range}
                onChange={(e) =>
                  setNewModel({ ...newModel, Logistic_range: e.target.value })
                }
              />

              <input
                className={inputClass}
                placeholder="Crew"
                value={newModel.Crew}
                onChange={(e) =>
                  setNewModel({ ...newModel, Crew: e.target.value })
                }
              />
            </div>

            {/* ACTIONS */}
            <div className="col-span-2 flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsNew(false)}
                className="cursor-pointer px-4 py-2 rounded-lg bg-gray-300 text-gray-900"
              >
                Indietro
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 rounded-lg bg-green-600 text-white"
              >
                Crea modello
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

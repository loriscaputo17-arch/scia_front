"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Ship,
  ChevronDown,
  ChevronRight,
  Loader2,
  LogOut,
  Settings as SettingsIcon,
} from "lucide-react";
import { getShipModels, createShipModel, createShip } from "@/api/admin/projects";
import { getShipsByModel } from "@/api/admin/ships";
import { useUser } from "@/context/UserContext";

export default function AdminSidebar({ activeModelId = null }) {
  const [shipModels, setShipModels] = useState([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [errorModels, setErrorModels] = useState(null);

  const [showAddModel, setShowAddModel] = useState(false);
  const [newModelName, setNewModelName] = useState("");
  const [creatingModel, setCreatingModel] = useState(false);

  const [openModelId, setOpenModelId] = useState(null);
  const [shipsByModel, setShipsByModel] = useState({});
  const [loadingShips, setLoadingShips] = useState({});
  const [errorShips, setErrorShips] = useState({});

  const [showAddShip, setShowAddShip] = useState(false);
  const [newShipName, setNewShipName] = useState("");
  const [selectedModelId, setSelectedModelId] = useState(null);
  const [creatingShip, setCreatingShip] = useState(false);


  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL_DEV;

  const match = pathname.match(/\/admin\/projects\/(\d+)/);
  const projectId = match ? match[1] : null;

  useEffect(() => {
    if (!projectId) return;

    const fetchModels = async () => {
      setLoadingModels(true);
      setErrorModels(null);
      try {
        const data = await getShipModels(projectId);
        setShipModels(data || []);
      } catch (err) {
        console.error("Errore nel caricamento modelli nave:", err);
        setErrorModels("Errore nel caricamento modelli nave");
      } finally {
        setLoadingModels(false);
      }
    };

    fetchModels();
  }, [projectId]);

  useEffect(() => {
    if (activeModelId && !openModelId) {
      setOpenModelId(activeModelId);
      loadShips(activeModelId);
    }
  }, [activeModelId]);

  const loadShips = async (modelId) => {
    setLoadingShips((prev) => ({ ...prev, [modelId]: true }));
    setErrorShips((prev) => ({ ...prev, [modelId]: null }));

    try {
      const data = await getShipsByModel(user?.id, modelId);
      setShipsByModel((prev) => ({
        ...prev,
        [modelId]: data.ships || [],
      }));
    } catch (err) {
      console.error("Errore nel caricamento navi:", err);
      setErrorShips((prev) => ({
        ...prev,
        [modelId]: "Errore nel caricamento navi",
      }));
    } finally {
      setLoadingShips((prev) => ({ ...prev, [modelId]: false }));
    }
  };

  const toggleModel = async (modelId) => {
    router.push(`/admin/projects/${projectId}/model/${modelId}`);

    setOpenModelId(modelId);

    if (!shipsByModel[modelId]) {
      await loadShips(modelId);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${BASE_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            typeof window !== "undefined"
              ? `Bearer ${localStorage.getItem("token")}`
              : "",
        },
      });
      localStorage.removeItem("token");
      router.push("/adminLogin");
    } catch (error) {
      console.error("Errore durante il logout:", error);
    }
  };

  const menuItemStyle = (active = false) =>
    `relative flex items-center justify-between gap-3 p-3 rounded-lg transition-all duration-200 cursor-pointer select-none ${
      active
        ? "bg-gradient-to-r from-blue-800/30 to-transparent font-semibold text-blue-300"
        : "hover:bg-gray-800 text-gray-300"
  }`;

  const handleCreateModel = async () => {
    if (!newModelName.trim()) return;

    try {
      setCreatingModel(true);
      const response = await createShipModel(projectId, newModelName);

      const updatedModels = await getShipModels(projectId);
      setShipModels(updatedModels);

      setNewModelName("");
      setShowAddModel(false);
    } catch (err) {
      console.error("Errore creazione modello nave:", err);
    } finally {
      setCreatingModel(false);
    }
  };

  const handleCreateShip = (modelId) => {
    setSelectedModelId(modelId);
    setShowAddShip(true);
  };


  const submitCreateShip = async () => {
    if (!newShipName.trim()) return;

    try {
      setCreatingShip(true);

      await createShip(selectedModelId, newShipName, user?.teamInfo.teamId);

      const updatedShips = await getShipsByModel(user?.id, selectedModelId);

      setShipsByModel((prev) => ({
        ...prev,
        [selectedModelId]: updatedShips.ships,
      }));

      setNewShipName("");
      setShowAddShip(false);

      if (openModelId !== selectedModelId) {
        setOpenModelId(selectedModelId);
      }

    } catch (err) {
      console.error("Errore creazione nave:", err);
    } finally {
      setCreatingShip(false);
    }
  };

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-900 text-white flex flex-col justify-between shadow-xl">
        {/* 🔹 Contenuto principale */}
        <nav className="flex-1 p-4 overflow-y-auto">
          {projectId && (
            <div>
              <div className="flex items-center mb-2">

                <h3 className="text-sm uppercase tracking-wide text-gray-400 flex items-center gap-2">
                  <Ship size={16} /> Modelli Nave
                </h3>

                <div className="cursor-pointer ml-auto" onClick={() => setShowAddModel(true)}>
                  <svg xmlns="http://www.w3.org/2000/svg" height={"18px"} width={"18px"} fill="white" viewBox="0 0 640 640"><path d="M352 128C352 110.3 337.7 96 320 96C302.3 96 288 110.3 288 128L288 288L128 288C110.3 288 96 302.3 96 320C96 337.7 110.3 352 128 352L288 352L288 512C288 529.7 302.3 544 320 544C337.7 544 352 529.7 352 512L352 352L512 352C529.7 352 544 337.7 544 320C544 302.3 529.7 288 512 288L352 288L352 128z"/></svg>
                </div>
              </div>
        
              {/* Stato caricamento modelli */}
              {loadingModels && (
                <p className="text-gray-500 text-sm">Caricamento...</p>
              )}
              {errorModels && (
                <p className="text-red-400 text-sm">{errorModels}</p>
              )}

              {!loadingModels && shipModels.length === 0 && (
                <p className="text-gray-500 text-sm">Nessun modello disponibile</p>
              )}

              {/* 🔹 Lista modelli */}
              <ul className="space-y-1 mt-2">
                {shipModels.map((model) => {
                  const isOpen = openModelId === String(model.id);
                  return (
                    <li key={model.id} className="relative">
                      {/* 🔸 Intestazione modello */}
                      <div
                        className={menuItemStyle(isOpen)}
                        onClick={() => toggleModel(String(model.id))}
                      >
                        <span className="flex items-center gap-2">
                          {model.model_name || `Modello #${model.id}`}
                        </span>
                        {isOpen ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </div>

                      {/* 🔸 Accordion: lista navi */}
                      <div
                        className={`ml-4 mt-1 space-y-1 border-l border-gray-700 pl-3 transition-all overflow-hidden ${
                          isOpen
                            ? "max-h-[500px] opacity-100 duration-300"
                            : "max-h-0 opacity-0 duration-200"
                        }`}
                      >
                        {loadingShips[model.id] && (
                          <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <Loader2
                              size={16}
                              className="animate-spin text-blue-400"
                            />
                            Caricamento navi...
                          </div>
                        )}

                        {errorShips[model.id] && (
                          <p className="text-red-400 text-sm">
                            {errorShips[model.id]}
                          </p>
                        )}

                        {!loadingShips[model.id] &&
                          !errorShips[model.id] &&
                          (shipsByModel[model.id]?.length > 0 ? (
                            shipsByModel[model.id].map((ship) => {
                              const active = pathname.startsWith(
                                `/admin/projects/${projectId}/ship/${model.id}/vessel/${ship.id}`
                              );
                              return (
                                <Link
                                  key={ship.id}
                                  href={`/admin/projects/${projectId}/ship/${model.id}/vessel/${ship.id}`}
                                  className={`block text-sm rounded-md p-2 transition-all ${
                                    active
                                      ? "bg-blue-900/30 text-blue-300"
                                      : "hover:bg-gray-800 text-gray-300"
                                  }`}
                                >
                                  {ship.unit_name || `Nave #${ship.id}`}
                                </Link>
                                
                              );
                            })
                          ) : (
                            <p className="text-gray-500 text-sm">
                              Nessuna nave associata
                            </p>
                          ))}

                          <div className="cursor-pointer ml-auto flex items-center gap-2" onClick={() => handleCreateShip(model.id)}>
                            <p className="text-[14px] text-white">Aggiungi nave</p>
                            <svg xmlns="http://www.w3.org/2000/svg" height={"16px"} width={"16px"} fill="white" viewBox="0 0 640 640"><path d="M352 128C352 110.3 337.7 96 320 96C302.3 96 288 110.3 288 128L288 288L128 288C110.3 288 96 302.3 96 320C96 337.7 110.3 352 128 352L288 352L288 512C288 529.7 302.3 544 320 544C337.7 544 352 529.7 352 512L352 352L512 352C529.7 352 544 337.7 544 320C544 302.3 529.7 288 512 288L352 288L352 128z"/></svg>
                          </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </nav>

        {/* 🔹 Footer */}
        <div className="p-4 border-t border-gray-700 space-y-2 text-gray-400 text-sm mb-8">
          <Link
            href="/admin/settings"
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800 transition"
          >
            <SettingsIcon size={18} /> Impostazioni
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800 transition w-full text-left"
          >
            <LogOut size={18} /> Logout
          </button>

          <div className="mt-4 text-center text-xs opacity-70">
            &copy; {new Date().getFullYear()} Scia Services <br />
            Versione 1.0.0
          </div>
        </div>
      </aside>

      {showAddModel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-2xl p-6 relative w-80">
            <h3 className="text-gray-700 text-lg mb-4">Aggiungi Modello Nave</h3>

            <input
              type="text"
              placeholder="Nome modello"
              className="w-full border border-gray-700 p-2 rounded text-gray-700"
              value={newModelName}
              onChange={(e) => setNewModelName(e.target.value)}
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-3 py-2 bg-gray-600 cursor-pointer rounded hover:bg-gray-500"
                onClick={() => setShowAddModel(false)}
              >
                Annulla
              </button>
              <button
                onClick={handleCreateModel}
                className="px-3 py-2 bg-blue-600 cursor-pointer rounded hover:bg-blue-500 disabled:opacity-50"
                disabled={creatingModel}
              >
                {creatingModel ? "Salvataggio..." : "Aggiungi"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddShip && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-2xl p-6 relative w-80">
            <h3 className="text-gray-700 text-lg mb-4">Aggiungi Nave</h3>

            <input
              type="text"
              placeholder="Nome nave"
              className="w-full border border-gray-700 p-2 rounded text-gray-700"
              value={newShipName}
              onChange={(e) => setNewShipName(e.target.value)}
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-3 py-2 bg-gray-600 cursor-pointer rounded hover:bg-gray-500"
                onClick={() => {
                  setShowAddShip(false);
                  setNewShipName("");
                }}
              >
                Annulla
              </button>

              <button
                onClick={submitCreateShip}
                className="px-3 py-2 bg-blue-600 cursor-pointer rounded hover:bg-blue-500 disabled:opacity-50"
                disabled={creatingShip}
              >
                {creatingShip ? "Salvataggio..." : "Aggiungi"}
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}

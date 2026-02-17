"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "@/components/ui/SortableItem";
import { Virtuoso } from "react-virtuoso";

import { getESWBSGlossary } from "@/api/admin/eswbs";
import { saveElementModels, getElementModels } from "@/api/admin/elementModel";
import { getMaintenancesModel } from "@/api/admin/maintenances";

export default function ProjectESWBSTab({ projectId }) {
  const [availableItems, setAvailableItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [maintenances, setMaintenances] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [popupTarget, setPopupTarget] = useState(null);
  const [newElementName, setNewElementName] = useState("");
  const [newElementType, setNewElementType] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const getLevelFromCode = (code) => {
    if (!code) return 0;
    const clean = code.toString().trim();
    if (/0000$/.test(clean)) return 0;
    if (/00$/.test(clean)) return 1;
    return 2;
  };

  // 🔹 Carica glossario
  useEffect(() => {
    const fetchGlossary = async () => {
      try {
        const data = await getESWBSGlossary();
        const mapped = data.map((item, index) => ({
          id:
            item.id?.toString() ||
            item.eswbs_glossary_id?.toString() ||
            `temp-${index}`,
          code: item.eswbs_glossary_code || "",
          name: item.short_description_ita || "(senza descrizione)",
          level: getLevelFromCode(item.eswbs_glossary_code),
        }));

        mapped.sort((a, b) => Number(a.code) - Number(b.code));
        setAvailableItems(mapped);
        setFilteredItems(mapped);
      } catch (err) {
        console.error("Errore caricando il glossario:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGlossary();
  }, []);

  // 🔹 Ricerca nel glossario
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredItems(availableItems);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = availableItems.filter(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        item.code.toLowerCase().includes(term)
    );
    setFilteredItems(filtered);
  }, [searchTerm, availableItems]);

  // 🔹 Carica elementi salvati
  useEffect(() => {
    const fetchSelected = async () => {
      try {
        const data = await getElementModels(projectId);
        console.log(projectId)

        const mapped = data.map((item, index) => ({
          id:
            item.eswbs_glossary_id?.toString() ||
            item.id?.toString() ||
            `selected-${index}`,
          code: item.ESWBS_code || "",
          name: item.LCN_name || "(senza nome)",
          level: getLevelFromCode(item.ESWBS_code),
        }));

        mapped.sort((a, b) => Number(a.code) - Number(b.code));
        setSelectedItems(mapped);

        setAvailableItems((prev) =>
          prev.filter((g) => !mapped.find((s) => s.id === g.id))
        );
      } catch (err) {
        console.error("Errore caricando ElementModel:", err);
      }
    };

    if (projectId) fetchSelected();
  }, [projectId]);

  // 🔹 Carica manutenzioni
  useEffect(() => {
    const fetchLinkedMaintenances = async () => {
      try {
        const data = await getMaintenancesModel(projectId);
        setMaintenances(data);

        setSelectedItems((prev) =>
          prev.map((item) => ({
            ...item,
            hasMaintenance: data.some(
              (m) => m.System_ElementModel_ID === parseInt(item.id)
            ),
          }))
        );
      } catch (err) {
        console.error("Errore caricando manutenzioni collegate:", err);
      }
    };

    if (projectId) fetchLinkedMaintenances();
  }, [projectId]);

  const handleDragStart = (event) => setActiveId(event.active.id);

  const handleDragEnd = (event) => {
    const { active } = event;
    if (!active) return;

    if (availableItems.find((i) => i.id === active.id)) {
      const item = availableItems.find((i) => i.id === active.id);
      setAvailableItems((prev) => prev.filter((i) => i.id !== active.id));
      setFilteredItems((prev) => prev.filter((i) => i.id !== active.id));
      setSelectedItems((prev) => [...prev, item]);
    } else if (selectedItems.find((i) => i.id === active.id)) {
      const item = selectedItems.find((i) => i.id === active.id);
      setSelectedItems((prev) => prev.filter((i) => i.id !== active.id));
      setAvailableItems((prev) => {
        const updated = [...prev, item];
        return updated.sort((a, b) => Number(a.code) - Number(b.code));
      });
    }

    setActiveId(null);
  };

  const handleSave = async () => {
    if (selectedItems.length === 0) {
      alert("Nessun elemento selezionato da salvare.");
      return;
    }

    try {
      setSaving(true);
      const payload = selectedItems.map((item) => ({
        ship_model_id: projectId,
        ESWBS_code: item.code,
        LCN_name: item.name,
        eswbs_glossary_id: parseInt(item.id),
        parent_element_model_id: 0,
        Installed_quantity_on_End_Item: 1,
        Installed_Quantity_on_Ship: 1,
      }));

      await saveElementModels(payload);
      alert("Elementi salvati correttamente!");
    } catch (err) {
      console.error("Errore durante il salvataggio:", err);
      alert("Errore durante il salvataggio degli elementi");
    } finally {
      setSaving(false);
    }
  };

  const handleFilterByElement = (elementModelId) => {
    window.dispatchEvent(
      new CustomEvent("filterMaintenanceByElement", { detail: elementModelId })
    );
    window.postMessage({ type: "openMaintenanceTab", elementModelId }, "*");
  };

  // 🔹 Aggiunta nuovo elemento
  const openPopup = (targetId, type) => {
    setPopupTarget(targetId);
    setNewElementType(type);
    setShowPopup(true);
  };

  const handleAddElement = () => {
    if (!newElementName.trim()) return alert("Inserisci un nome valido");

    setSelectedItems((prev) => {
      const target = prev.find((i) => i.id === popupTarget);
      if (!target) return prev;

      const newItem = {
        id: `custom-${Date.now()}`,
        code: "",
        name: newElementName,
        level: newElementType === "child" ? target.level + 1 : target.level,
        isCustom: true,
      };

      const index = prev.findIndex((i) => i.id === popupTarget);
      const updated = [...prev];
      updated.splice(index + 1, 0, newItem);
      return updated;
    });

    setShowPopup(false);
    setNewElementName("");
    setPopupTarget(null);
  };

  const handleDeleteElement = (targetId) => {
    setSelectedItems((prev) => {
      const index = prev.findIndex((i) => i.id === targetId);
      if (index === -1) return prev;

      const target = prev[index];
      if (!target.isCustom) {
        alert("⚠️ Non puoi eliminare un elemento ufficiale ESWBS.");
        return prev;
      }

      const targetLevel = target.level;
      let endIndex = index + 1;
      while (
        endIndex < prev.length &&
        prev[endIndex].level > targetLevel &&
        prev[endIndex].isCustom
      ) {
        endIndex++;
      }

      const updated = [...prev];
      updated.splice(index, endIndex - index);
      return updated;
    });
  };

  if (loading)
    return (
      <p className="text-gray-500 text-center mt-6">
        Caricamento glossario ESWBS...
      </p>
    );

  return (
    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex justify-end mb-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`cursor-pointer px-4 py-2 rounded-lg text-white ${
              saving
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {saving ? "Salvataggio..." : "Salva ESWBS Elementi"}
          </button>
        </div>

        <div className="flex gap-6">
          {/* SELEZIONATI */}
          <div className="flex-1 p-4 border rounded-xl h-[60vh] overflow-y-auto bg-gradient-to-b from-green-50 to-emerald-100 shadow-inner">
            <h3 className="font-semibold mb-4 text-gray-700">
              ESWBS Selezionati
            </h3>
            <SortableContext
              items={selectedItems}
              strategy={verticalListSortingStrategy}
            >
              {selectedItems.map((item, index) => (
                <div
                  key={item.id || `selected-${index}`}
                  style={{ paddingLeft: `${item.level * 20}px` }}
                  className={`flex flex-col gap-1 mb-1 ${
                    item.hasMaintenance
                      ? "bg-emerald-50"
                      : ""
                  } rounded-md p-1`}
                >
                  <div className="flex items-center justify-between group">
                    <SortableItem
                      id={item.id}
                      name={`${item.code} - ${item.name}`}
                      dragging={activeId === item.id}
                      bgColor="#16A34A"
                    />
                    <div className="flex items-center gap-2 ml-2 text-sm">
                      <button
                        onClick={() => handleFilterByElement(item.id)}
                        title="Vedi le manutenzioni di questo elemento"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="cursor-pointer" width="22px" height="22px" fill="black" viewBox="0 0 640 640"><path d="M541.4 162.6C549 155 561.7 156.9 565.5 166.9C572.3 184.6 576 203.9 576 224C576 312.4 504.4 384 416 384C398.5 384 381.6 381.2 365.8 376L178.9 562.9C150.8 591 105.2 591 77.1 562.9C49 534.8 49 489.2 77.1 461.1L264 274.2C258.8 258.4 256 241.6 256 224C256 135.6 327.6 64 416 64C436.1 64 455.4 67.7 473.1 74.5C483.1 78.3 484.9 91 477.4 98.6L388.7 187.3C385.7 190.3 384 194.4 384 198.6L384 240C384 248.8 391.2 256 400 256L441.4 256C445.6 256 449.7 254.3 452.7 251.3L541.4 162.6z"/></svg>
                      </button>

                      <button
                        onClick={() => openPopup(item.id, "sibling")}
                        title="Crea un elemento fratello"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="cursor-pointer" width="22px" height="22px" fill="black" viewBox="0 0 640 640"><path d="M352 128C352 110.3 337.7 96 320 96C302.3 96 288 110.3 288 128L288 288L128 288C110.3 288 96 302.3 96 320C96 337.7 110.3 352 128 352L288 352L288 512C288 529.7 302.3 544 320 544C337.7 544 352 529.7 352 512L352 352L512 352C529.7 352 544 337.7 544 320C544 302.3 529.7 288 512 288L352 288L352 128z"/></svg>
                      </button>

                      {item.isCustom && (
                        <button
                          onClick={() => handleDeleteElement(item.id)}
                          title="Elimina elemento"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="cursor-pointer" width="22px" height="22px" fill="black" viewBox="0 0 640 640"><path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z"/></svg>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="ml-8">
                    <button
                      onClick={() => openPopup(item.id, "child")}
                      title="Crea un elemento figlio"
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="cursor-pointer" width="22px" height="22px" fill="black" viewBox="0 0 640 640"><path d="M352 128C352 110.3 337.7 96 320 96C302.3 96 288 110.3 288 128L288 288L128 288C110.3 288 96 302.3 96 320C96 337.7 110.3 352 128 352L288 352L288 512C288 529.7 302.3 544 320 544C337.7 544 352 529.7 352 512L352 352L512 352C529.7 352 544 337.7 544 320C544 302.3 529.7 288 512 288L352 288L352 128z"/></svg>
                    </button>
                  </div>
                </div>
              ))}
            </SortableContext>
          </div>

          <div className="flex-1 p-4 border rounded-xl h-[60vh] overflow-y-auto bg-gradient-to-b from-gray-100 to-gray-200 shadow-inner">
            <div className="justify-between mb-4">
              <h3 className="font-semibold text-gray-700">Glossario ESWBS</h3>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cerca per codice o nome..."
                className="text-[14px] mt-2 w-full text-gray-700 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-300"
              />
            </div>
            <SortableContext
              items={filteredItems}
              strategy={verticalListSortingStrategy}
            >
              <Virtuoso
                style={{ height: 480 }}
                totalCount={filteredItems.length}
                itemContent={(index) => {
                  const item = filteredItems[index];
                  return (
                    <div
                      key={item.id || `available-${index}`}
                      style={{ paddingLeft: `${item.level * 20}px` }}
                    >
                      <SortableItem
                        key={`sortable-${item.id || index}`}
                        id={item.id}
                        name={`${item.code} - ${item.name}`}
                        dragging={activeId === item.id}
                      />
                    </div>
                  );
                }}
              />
            </SortableContext>
          </div>
        </div>

        {/* POPUP AGGIUNTA */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-[40vw]">
              <h4 className="font-semibold mb-3 text-gray-700">
                {newElementType === "child"
                  ? "Aggiungi elemento figlio"
                  : "Aggiungi elemento fratello"}
              </h4>
              <input
                type="text"
                value={newElementName}
                onChange={(e) => setNewElementName(e.target.value)}
                placeholder="Nome nuovo elemento"
                className="border border-gray-300 rounded-lg w-full px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-300 mb-4 text-gray-700"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowPopup(false)}
                  className="cursor-pointer px-3 py-2 text-sm rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  Annulla
                </button>
                <button
                  onClick={handleAddElement}
                  className="cursor-pointer px-3 py-2 text-sm rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Aggiungi
                </button>
              </div>
            </div>
          </div>
        )}

        <DragOverlay>
          {activeId ? (
            <div className="p-3 border rounded-lg bg-emerald-400 text-white shadow-lg font-semibold">
              {availableItems.find((i) => i.id === activeId)?.name ||
                selectedItems.find((i) => i.id === activeId)?.name}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

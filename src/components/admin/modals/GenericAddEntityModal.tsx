"use client";

import BaseAddModal from "../BaseAddModal";
import NCAGEForm from "@/components/admin/materials/NCAGEForm";
import { useMultiEntityForm } from "@/hooks/useMultiEntityForm";

export default function GenericAddEntityModal({
  title,
  emptyItem,
  entity,
  Tabs,
  MainForm,
  saveFn,
  onClose,
  onAdded,
  labels,
}) {
  const {
    items,
    activeTab,
    setActiveTab,
    loading,
    setLoading,
    hasNCAGEMap,
    setHasNCAGEMap,
    updateItem,
    addItem,
    removeItem,
  } = useMultiEntityForm(emptyItem);

  const handleSave = async () => {
    try {
      setLoading(true);

      const payloads = items.map((item, idx) => ({
        ...item,
        NCAGE_Code: hasNCAGEMap[idx] ? item.NCAGE_Code : null,
      }));

      const created = [];
      for (const p of payloads) {
        created.push(await saveFn(p));
      }

      onAdded?.(created);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseAddModal
      title={title}
      onClose={onClose}
      footer={
        <>
          <button
            onClick={addItem}
            disabled={loading}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Aggiungi {labels.singular}
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 bg-gray-200 rounded-lg text-black"
            >
              Annulla
            </button>

            <button
              onClick={handleSave}
              disabled={loading}
              className={`px-4 py-2 rounded-lg text-white ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Salvataggio..." : "Salva"}
            </button>
          </div>
        </>
      }
    >
      {/* Tabs */}
      <Tabs
        items={items}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        label={labels.singular}
      />

      {/* Forms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <MainForm
          data={items[activeTab]}
          hasNCAGE={hasNCAGEMap[activeTab]}
          setHasNCAGE={(v) =>
            setHasNCAGEMap((prev) => ({ ...prev, [activeTab]: v }))
          }
          onChange={(u) => updateItem(activeTab, u)}
        />

        {hasNCAGEMap[activeTab] && (
          <NCAGEForm
            data={items[activeTab]}
            onChange={(u) => updateItem(activeTab, u)}
          />
        )}
      </div>

      {/* Remove */}
      {items.length > 1 && (
        <button
          onClick={() => removeItem(activeTab)}
          className="mt-4 text-red-600 hover:text-red-700 text-sm font-medium"
        >
          Rimuovi {labels.singular}
        </button>
      )}
    </BaseAddModal>
  );
}

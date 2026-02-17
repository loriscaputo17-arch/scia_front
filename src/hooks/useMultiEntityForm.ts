import { useState } from "react";

export function useMultiEntityForm(emptyItem) {
  const [items, setItems] = useState([{ ...emptyItem }]);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasNCAGEMap, setHasNCAGEMap] = useState({ 0: false });

  const updateItem = (index, updater) => {
    setItems((prev) =>
      prev.map((o, i) =>
        i === index ? (typeof updater === "function" ? updater(o) : updater) : o
      )
    );
  };

  const addItem = () => {
    setItems((prev) => [...prev, { ...emptyItem }]);
    setHasNCAGEMap((prev) => ({ ...prev, [items.length]: false }));
    setActiveTab(items.length);
  };

  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
    setActiveTab(0);
  };

  return {
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
  };
}

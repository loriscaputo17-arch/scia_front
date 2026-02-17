"use client";

import { useState, useEffect } from "react";
import SparesModal from "./SparesModal";
import { getSpares } from "@/api/admin/spares";
import SparesList from "./SparesList";

export default function ProjectSparesTab({ projectId }) {
  const [spares, setSpares] = useState([]);
  const [filteredSpares, setFilteredSpares] = useState([]);

  const [selectedSpare, setSelectedSpare] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [search, setSearch] = useState("");

  // 🔹 Caricamento ricambi dal backend
  useEffect(() => {
    const fetchSpares = async () => {
      try {
        const data = await getSpares(projectId);
        setSpares(data);
        setFilteredSpares(data);
      } catch (err) {
        console.error("Errore nel caricamento ricambi:", err);
      }
    };
    fetchSpares();
  }, [projectId]);

  // 🔍 Ricerca live
  useEffect(() => {
    if (!search.trim()) {
      setFilteredSpares(spares);
      return;
    }

    const lower = search.toLowerCase();
    setFilteredSpares(
      spares.filter((s) =>
        `${s.Spare_Name} ${s.Part_Number} ${s.Description}`
          .toLowerCase()
          .includes(lower)
      )
    );
  }, [search, spares]);

  const handleAdd = () => {
    setSelectedSpare(null);
    setModalOpen(true);
  };

  const handleEdit = (spare) => {
    setSelectedSpare(spare);
    setModalOpen(true);
  };

  const handleSave = async () => {
    // 🟢 ricarichiamo dal backend per avere dati corretti
    const fresh = await getSpares(projectId);
    setSpares(fresh);
    setFilteredSpares(fresh);
    setModalOpen(false);
  };

  return (
    <div className="p-4 text-gray-600 text-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Ricambi</h2>

        <button
          onClick={handleAdd}
          className="cursor-pointer px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700"
        >
          Aggiungi ricambio
        </button>
      </div>

      {/* 🔎 Barra di ricerca */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Cerca per nome, part number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 rounded-lg text-gray-700 flex flex-wrap items-center gap-3 bg-white shadow-sm border border-gray-200"
        />
      </div>

      {/* 📄 Lista ricambi */}
      <SparesList items={filteredSpares} onEdit={handleEdit} />

      {/* 🛠️ Modale */}
      {modalOpen && (
        <SparesModal
          projectId={projectId}
          spare={selectedSpare}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

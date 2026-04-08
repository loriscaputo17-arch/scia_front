"use client";

import { useEffect, useState } from "react";
import { getThresholds } from "@/api/admin/thresholds";
import ThresholdsTable from "@/components/admin/thresholds/ThresholdsTable";
import AddThresholdButton from "@/components/admin/thresholds/AddThresholdButton";
import AddThresholdModal from "@/components/admin/thresholds/AddThresholdModal";

export default function ThresholdsPage() {
  const [thresholds, setThresholds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // 🔹 Fetch iniziale
  useEffect(() => {
    const fetchThresholds = async () => {
      try {
        const data = await getThresholds();
        setThresholds(data);
      } catch (err) {
        console.error("Errore nel fetch soglie:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchThresholds();
  }, []);

  // 🔹 Aggiornamento dopo salvataggio o eliminazione
  const handleSave = (updated) => {
    setModalOpen(false);
    setThresholds((prev) => {
      // se eliminato
      if (updated.deletedId) {
        return prev.filter((t) => t.id !== updated.deletedId);
      }

      const exists = prev.find((t) => t.id === updated.id);
      if (exists) {
        return prev.map((t) => (t.id === updated.id ? updated : t));
      } else {
        return [...prev, updated];
      }
    });
  };

  // 🔹 UI
  return (
    <div>
      <h2 className="text-3xl font-semibold mb-6 text-gray-900">
        Gestione Soglie
      </h2>
      
      {/* Tabella */}
      {loading ? (
        <p className="text-gray-500">Caricamento soglie...</p>
      ) : (
        <ThresholdsTable
          thresholds={thresholds}
          onThresholdUpdated={handleSave}
        />
      )}

      {/* Bottone aggiungi */}
      <AddThresholdButton onClick={() => setModalOpen(true)} />

      {/* Modale aggiungi */}
      {modalOpen && (
        <AddThresholdModal
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { getProjectRuntime, startJobs } from "@/api/admin/runtime";
import ProjectRuntimeModal from "./ProjectRuntimeModal";

export default function ProjectRuntimeTab({ project, shipId, shipModelId }) {
  const [runtimeData, setRuntimeData] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [startingJobs, setStartingJobs] = useState(false);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const loadRuntime = async () => {
    try {
      const data = await getProjectRuntime(shipId);

      const formattedArray = Array.isArray(data) ? data : [data];

      const formatted = formattedArray.map((item) => ({
        id: item.id,
        type: item?.maintenance_list?.name || "N/D",
        date: item?.starting_date
          ? new Date(item.starting_date).toLocaleDateString()
          : "N/D",
        status: item?.execution_state || "N/D",
        raw: item,
      }));

      setRuntimeData(formatted.filter(x => x.id !== undefined));
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (!project?.id) return;

    setLoading(true);
    loadRuntime().finally(() => setLoading(false));
  }, [project?.id, shipId]);

  const handleStartJobs = async () => {
    setStartingJobs(true);
    setFeedback(null);

    try {
      const res = await startJobs(shipModelId, shipId);
      setFeedback(`✔ ${res.count} job avviati con successo.`);
      await loadRuntime();
    } catch (error) {
      setFeedback(`❌ ${error.message}`);
    } finally {
      setStartingJobs(false);
    }
  };

  const filteredData = runtimeData.filter((r) =>
    r.type?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 p-6 text-gray-700 text-sm">

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Runtime</h2>

        <button
          onClick={handleStartJobs}
          disabled={runtimeData.length > 0 || startingJobs}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition 
          ${runtimeData.length > 0 
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-red-600 text-white hover:bg-red-700"}`}
        >
          {startingJobs ? "Avvio..." : "Start Jobs"}
        </button>
      </div>
      
      {feedback && (
        <p className={`text-sm ${feedback.includes("✔") ? "text-green-600" : "text-red-500"}`}>
          {feedback}
        </p>
      )}

      <p className="text-gray-600 mb-2">Storico manutenzioni pianificate ed eseguite del progetto.</p>

      {/* 🔍 Filtro */}
      <input
        type="text"
        placeholder="Cerca manutenzione..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-gray-200 p-2 rounded-lg w-full text-sm focus:ring focus:ring-blue-200"
      />

      {/* ⏳ Loading */}
      {loading && (
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="animate-spin" size={18} />
          Caricamento runtime...
        </div>
      )}

      {/* ❌ Error */}
      {error && <p className="text-red-500">{error}</p>}

      {/* 🧪 Nessun risultato */}
      {!loading && filteredData.length === 0 && (
        <p className="text-gray-500 italic">Nessun runtime trovato.</p>
      )}

      {/* 📄 Tabella */}
      {!loading && filteredData.length > 0 && (
        <div className="overflow-x-auto bg-gray-50 shadow-xl rounded-xl relative">
          <table className="min-w-full rounded-xl divide-y divide-gray-200">
            <thead className="bg-gray-100 text-gray-600 uppercase text-sm font-semibold">
              <tr>
                <th className="px-6 py-4 text-left rounded-tl-xl">Tipo</th>
                <th className="px-6 py-4 text-left">Data esecuzione</th>
                <th className="px-6 py-4 text-left">Stato</th>
                <th className="px-6 py-4 text-left rounded-tr-xl">Azioni</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {filteredData.map((row, idx) => (
                <tr
                  key={row.id}
                  className={`cursor-pointer transition-all hover:bg-blue-50 ${
                    idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="px-6 py-4 font-medium">{row.type}</td>
                  <td className="px-6 py-4">{row.date}</td>
                  <td className="px-6 py-4">{row.status}</td>
                  <td
                    onClick={() => setSelectedRow(row.raw)}
                    className="px-6 py-4 text-blue-600 hover:underline"
                  >
                    Dettagli
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 🪟 Modal Dettaglio */}
      {selectedRow && (
        <ProjectRuntimeModal item={selectedRow} onClose={() => setSelectedRow(null)} />
      )}

    </div>
  );
}

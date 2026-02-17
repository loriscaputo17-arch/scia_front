"use client";

import { useState, useEffect } from "react";
import FileUploadModal from "./FileUploadModal";
import { getProjectFiles, deleteFile } from "@/api/admin/files";
import FileList from "./FileList";
import { useUser } from "@/context/UserContext";

export default function ProjectFilesTab({ shipModelId }) {
  const [files, setFiles] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (!shipModelId) return;
    loadFiles();
  }, [shipModelId]);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const data = await getProjectFiles(shipModelId);
      setFiles(data);

      console.log(data)
    } catch (err) {
      console.error("Errore caricamento files:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = async () => {
    await loadFiles();
    setModalOpen(false);
  };


  const handleDelete = async (fileId) => {
    if (!confirm("Vuoi davvero eliminare questo file?")) return;

    try {
      await deleteFile(fileId);
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
    } catch (err) {
      console.error("Errore eliminazione file:", err);
    }
  };

  return (
    <div className="p-4 text-gray-600 text-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Documenti & File Progetto
        </h2>

        <button
          className="cursor-pointer px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700"
          onClick={() => setModalOpen(true)}
        >
          Carica File
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Caricamento file...</p>
      ) : files.length === 0 ? (
        <p className="text-gray-500">Nessun file caricato.</p>
      ) : (
        <FileList items={files} onDelete={handleDelete} />
      )}

      {modalOpen && (
        <FileUploadModal
          projectId={shipModelId}
          userId={user?.id}
          onClose={() => setModalOpen(false)}
          onUploadSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
}

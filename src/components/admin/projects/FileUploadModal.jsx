"use client";

import { useState } from "react";
import { uploadFile } from "@/api/admin/files";
import { Loader2, Upload, X } from "lucide-react";

export default function FileUploadModal({
  projectId,
  userId,
  onClose,
  onUploadSuccess,
}) {
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (e) => {
    if (!e.target.files) return;
    setFiles(Array.from(e.target.files));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.length) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleUpload = async () => {
    if (!files.length) return;

    setUploading(true);
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        await uploadFile(projectId, userId, formData);
      }
      onUploadSuccess();
      onClose();
    } catch (err) {
      console.error("Errore upload file:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl">

        {/* Header */}
        <div className="flex justify-between items-center px-5 py-3">
          <h3 className="text-lg font-semibold text-gray-700">Carica file</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        {/* Drop zone */}
        <div
          className={`m-5 p-6 border-2 border-dashed rounded-lg text-center
            ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
        >
          {!files.length ? (
            <>
              <Upload className="mx-auto text-gray-400 mb-2" size={32} />
              <p className="text-sm text-gray-500">Trascina file qui o</p>
              <label className="cursor-pointer mt-2 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg">
                Seleziona file
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </label>
            </>
          ) : (
            <ul className="text-sm text-left space-y-1 max-h-40 overflow-auto">
              {files.map((f, i) => (
                <li key={i} className="text-gray-700">
                  • {f.name} ({(f.size / 1024 / 1024).toFixed(2)} MB)
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">
            Annulla
          </button>
          <button
            disabled={!files.length || uploading}
            onClick={handleUpload}
            className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2"
          >
            {uploading && <Loader2 size={16} className="animate-spin" />}
            {uploading ? "Caricamento..." : `Carica (${files.length})`}
          </button>
        </div>
      </div>
    </div>
  );
}

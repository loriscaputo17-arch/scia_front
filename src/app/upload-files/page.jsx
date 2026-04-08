"use client";

import { useState, useRef, useEffect } from "react";

const API = process.env.NEXT_PUBLIC_API_URL_DEV;

export default function UploadFilesPage() {
  const [files, setFiles]               = useState([]);
  const [shipId, setShipId]             = useState("");
  const [uploading, setUploading]       = useState(false);
  const [tree, setTree]                 = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null); // { id, file_name }
  const [breadcrumbs, setBreadcrumbs]   = useState([]);     // stack navigazione
  const [newFolderName, setNewFolderName] = useState("");
  const [creatingFolder, setCreatingFolder] = useState(false);
  const inputRef = useRef(null);

  // Carica albero quando cambia nave
  useEffect(() => {
    if (!shipId) return;
    fetchTree();
  }, [shipId]);

  const fetchTree = async () => {
    const res = await fetch(`${API}/api/shipFiles/tree/${shipId}`);
    const data = await res.json();
    setTree(data);
  };

  // Nodi da mostrare nel livello corrente
  const currentNodes = currentFolder
    ? findChildren(tree, currentFolder.id)
    : tree;

    console.log("currentFolder:", currentFolder);
console.log("currentNodes:", currentNodes);
console.log("tree:", tree);

  function findChildren(nodes, parentId) {
  for (const node of nodes) {
    if (node.id === parentId) return node.children || [];
    if (node.children?.length) {
      const found = findChildren(node.children, parentId);
      if (found !== null) return found;  // usa null come sentinel
    }
  }
  return null;  // non trovato
}

  const enterFolder = (folder) => {
    setBreadcrumbs((prev) => [...prev, folder]);
    setCurrentFolder(folder);
  };

  const goToBreadcrumb = (index) => {
    if (index === -1) {
      setBreadcrumbs([]);
      setCurrentFolder(null);
    } else {
      const crumb = breadcrumbs[index];
      setBreadcrumbs((prev) => prev.slice(0, index + 1));
      setCurrentFolder(crumb);
    }
  };

  // ── Crea cartella ──────────────────────────────────────
  const handleCreateFolder = async () => {
    if (!newFolderName.trim() || !shipId) return;
    setCreatingFolder(true);
    try {
      await fetch(`${API}/api/shipFiles/createFolder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ship_id: shipId,
          user_id: 1,
          folder_name: newFolderName.trim(),
          parent_folder_id: currentFolder?.id || null,
        }),
      });
      setNewFolderName("");
      await fetchTree();
    } finally {
      setCreatingFolder(false);
    }
  };

  // ── Drag & drop ────────────────────────────────────────
  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files).filter(
      (f) => f.type === "application/pdf"
    );
    setFiles((prev) => [...prev, ...dropped]);
  };

  const handleSelectFiles = (e) => {
    const selected = Array.from(e.target.files).filter(
      (f) => f.type === "application/pdf"
    );
    setFiles((prev) => [...prev, ...selected]);
  };

  // ── Upload ─────────────────────────────────────────────
  const handleUpload = async () => {
    if (!shipId || files.length === 0) return alert("Seleziona nave e file");
    setUploading(true);

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("ship_id", shipId);
      formData.append("user_id", 1);
      if (currentFolder?.id) {
        formData.append("parent_folder_id", currentFolder.id);
      }

      try {
        await fetch(`${API}/api/shipFiles/uploadShipFile`, {
          method: "POST",
          body: formData,
        });
      } catch (err) {
        console.error("Errore:", file.name);
      }
    }

    setUploading(false);
    setFiles([]);
    await fetchTree();
  };

  return (
    <div className="p-6 text-white max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Upload File Nave</h1>

      {/* ── Selezione nave ── */}
      <div className="mb-6">
        <label className="block mb-2 text-white/60 text-sm">Seleziona Nave</label>
        <select
          value={shipId}
          onChange={(e) => { setShipId(e.target.value); setCurrentFolder(null); setBreadcrumbs([]); }}
          className="bg-[#022a52] p-3 rounded-md w-full border border-[#ffffff15]"
        >
          <option value="">-- Seleziona --</option>
          <option value="31">Nave 31</option>
          <option value="32">Nave 32</option>
        </select>
      </div>

      {shipId && (
        <>
          {/* ── Explorer cartelle ── */}
          <div className="mb-6 bg-[#022a52] rounded-xl border border-[#ffffff10] overflow-hidden">

            {/* Breadcrumb */}
            <div className="flex items-center gap-1 px-4 py-3 border-b border-[#ffffff10] flex-wrap">
              <button
                onClick={() => goToBreadcrumb(-1)}
                className="text-sm text-[#789fd6] hover:underline"
              >
                Root
              </button>
              {breadcrumbs.map((crumb, i) => (
                <span key={crumb.id} className="flex items-center gap-1">
                  <span className="text-white/30">/</span>
                  <button
                    onClick={() => goToBreadcrumb(i)}
                    className="text-sm text-[#789fd6] hover:underline"
                  >
                    {crumb.file_name}
                  </button>
                </span>
              ))}
            </div>

            {/* Contenuto cartella corrente */}
            <div className="p-3 min-h-[120px]">
              {currentNodes.length === 0 ? (
                <p className="text-white/30 text-sm text-center py-6">Cartella vuota</p>
              ) : (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                  {currentNodes.map((node) => (
                    <div
                      key={node.id}
                      onClick={() => node.is_folder && enterFolder(node)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg border border-[#ffffff10]
                        ${node.is_folder ? "cursor-pointer hover:bg-[#789fd6]/10 hover:border-[#789fd6]/40" : "opacity-70"}
                        bg-[#ffffff05] transition`}
                    >
                      {node.is_folder ? (
                        <svg width="32" height="32" fill="#789fd6" viewBox="0 0 24 24">
                          <path d="M10 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2h-8l-2-2z"/>
                        </svg>
                      ) : (
                        <svg width="32" height="32" fill="none" stroke="#789fd6" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                        </svg>
                      )}
                      <span className="text-xs text-center text-white/70 truncate w-full text-center">
                        {node.file_name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Crea nuova cartella */}
            <div className="flex gap-2 px-3 pb-3">
              <input
                type="text"
                placeholder="Nome nuova cartella..."
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
                className="flex-1 bg-[#ffffff08] border border-[#ffffff15] rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none"
              />
              <button
                onClick={handleCreateFolder}
                disabled={creatingFolder || !newFolderName.trim()}
                className="bg-[#789fd6] hover:bg-[#6a8fc4] px-4 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-40"
              >
                + Cartella
              </button>
            </div>
          </div>

          {/* ── Drop zone ── */}
          <div className="mb-2 text-sm text-white/40">
            Stai caricando in:{" "}
            <span className="text-[#789fd6]">
              {breadcrumbs.length > 0 ? breadcrumbs.map(b => b.file_name).join(" / ") : "Root"}
            </span>
          </div>

          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => inputRef.current.click()}
            className="border-2 border-dashed border-[#ffffff20] hover:border-[#789fd6] p-10 rounded-xl text-center cursor-pointer transition"
          >
            <p className="text-white/50">Trascina PDF qui oppure clicca per selezionare</p>
            <input type="file" multiple accept="application/pdf" ref={inputRef} onChange={handleSelectFiles} className="hidden" />
          </div>

          {/* ── File selezionati ── */}
          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              {files.map((file, i) => (
                <div key={i} className="flex items-center justify-between bg-[#022a52] px-4 py-2 rounded-lg border border-[#ffffff10]">
                  <span className="text-sm text-white/70">{file.name}</span>
                  <button onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))} className="text-white/30 hover:text-red-400 transition">✕</button>
                </div>
              ))}
            </div>
          )}

          {/* ── Upload button ── */}
          <button
            onClick={handleUpload}
            disabled={uploading || files.length === 0}
            className="mt-6 w-full bg-[#789fd6] hover:bg-[#6a8fc4] py-3 rounded-xl font-bold transition disabled:opacity-40"
          >
            {uploading ? "Caricamento..." : `Carica ${files.length > 0 ? files.length + " file" : ""}`}
          </button>
        </>
      )}
    </div>
  );
}
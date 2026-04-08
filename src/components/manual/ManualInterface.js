'use client';

import { useEffect, useState, useRef } from "react";
import PdfViewer from "@/components/manual/PdfViewer";
import SelectModal from "./SelectModal";
import ImpiantiList from "@/components/facilities/FacilitiesList";
import { useUser } from "@/context/UserContext";

const API = process.env.NEXT_PUBLIC_API_URL_DEV;
const S3_BASE = process.env.NEXT_PUBLIC_S3_BASE_URL || ""; // es. "https://your-bucket.s3.amazonaws.com/"

// ─── File fisso SG118 ─────────────────────────────────────────────────────────
const MANUAL_SG118 = {
  id: "sg118-manual",
  file_name: "Manuale Nave SG_118 digital",
  file_link: "https://drive.google.com/file/d/1sbTC0cKFtwSehB01PqjXLsxICUOl4TWc/view?usp=drive_link",
  file_type: "application/pdf",
  isFixed: true,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Costruisce URL completo da una S3 key o URL assoluto */
function resolveUrl(link) {
  if (!link) return null;
  if (link.startsWith("http")) return link;
  return S3_BASE ? `${S3_BASE.replace(/\/$/, "")}/${link}` : link;
}

function isGDriveLink(link) {
  return link?.includes("drive.google.com");
}

// ─── Modal filtro impianto ────────────────────────────────────────────────────
function ElementFilterModal({ isOpen, onClose, onSelect }) {
  const [search, setSearch] = useState("");
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-30">
      <div className="bg-[#022a52] w-[70%] max-w-2xl p-6 rounded-xl shadow-2xl text-white flex flex-col gap-4" style={{ maxHeight: "80vh" }}>
        <div className="flex justify-between items-center">
          <h2 className="text-[20px] font-semibold">Filtra per Impianto</h2>
          <button onClick={onClose} className="cursor-pointer opacity-60 hover:opacity-100 transition">
            <svg width="22" height="22" fill="white" viewBox="0 0 384 512">
              <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
            </svg>
          </button>
        </div>
        <input
          type="text"
          placeholder="Cerca impianto…"
          className="w-full px-4 py-2 bg-[#ffffff10] text-white rounded-md outline-none placeholder:text-white/30"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex-1 overflow-y-auto rounded-md" style={{ minHeight: 0 }}>
          <ImpiantiList
            search={search}
            modal="yes"
            onSelect={(node) => { if (node) { onSelect(node); onClose(); } }}
            close={onClose}
          />
        </div>
        <button
          className="w-full bg-[#789fd6] p-3 text-white font-semibold rounded-md cursor-pointer hover:bg-[#6a8fc4] transition"
          onClick={onClose}
        >
          Conferma
        </button>
      </div>
    </div>
  );
}

// ─── FileCard ─────────────────────────────────────────────────────────────────
function FileCard({ file, isActive, onClick }) {
  const gdrive = isGDriveLink(file.file_link);
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-lg px-3 py-2.5 border transition-all flex items-center gap-2.5
        ${isActive
          ? "bg-[#789fd6]/20 border-[#789fd6]"
          : "bg-[#ffffff04] border-transparent hover:bg-[#ffffff08] hover:border-[#ffffff15]"
        }`}
    >
      <div className="flex-shrink-0">
        {gdrive ? (
          <svg width="16" height="16" viewBox="0 0 87.3 78" fill="none">
            <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
            <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0-1.2 4.5h27.5z" fill="#00ac47"/>
            <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
            <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
            <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
            <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 27h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
          </svg>
        ) : (
          <svg width="14" height="14" fill="none" stroke={isActive ? "#789fd6" : "rgba(255,255,255,0.4)"} strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
          </svg>
        )}
      </div>
      <span className={`text-xs leading-snug truncate ${isActive ? "text-white font-medium" : "text-white/70"}`}>
        {file.file_name}
      </span>
    </div>
  );
}

// ─── FolderRow — riga cartella espandibile ────────────────────────────────────
function FolderRow({ node, depth = 0, selectedFile, onSelectFile }) {
  const [open, setOpen] = useState(false);
  const hasChildren = node.children?.length > 0;

  return (
    <div>
      {/* Riga cartella */}
      <div
        onClick={() => hasChildren && setOpen((o) => !o)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition
          hover:bg-[#ffffff08] group`}
        style={{ paddingLeft: `${12 + depth * 14}px` }}
      >
        {/* chevron */}
        <svg
          width="12" height="12"
          fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" viewBox="0 0 24 24"
          className={`flex-shrink-0 transition-transform duration-200 ${open ? "rotate-90" : ""} ${!hasChildren ? "opacity-0" : ""}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6"/>
        </svg>

        {/* icona cartella */}
        <svg width="15" height="15" fill="#789fd6" viewBox="0 0 24 24" className="flex-shrink-0 opacity-80">
          <path d="M10 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2h-8l-2-2z"/>
        </svg>

        <span className="text-xs text-white/70 group-hover:text-white/90 transition truncate font-medium">
          {node.file_name}
        </span>

        {hasChildren && (
          <span className="ml-auto text-[10px] text-white/25 flex-shrink-0">{node.children.length}</span>
        )}
      </div>

      {/* Figli */}
      {open && hasChildren && (
        <div>
          {node.children.map((child) =>
            child.is_folder ? (
              <FolderRow
                key={child.id}
                node={child}
                depth={depth + 1}
                selectedFile={selectedFile}
                onSelectFile={onSelectFile}
              />
            ) : (
              <div key={child.id} style={{ paddingLeft: `${12 + (depth + 1) * 14}px` }} className="pr-2 mb-0.5">
                <FileCard
                  file={child}
                  isActive={selectedFile?.id === child.id}
                  onClick={() => onSelectFile(child)}
                />
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const ManualInterface = () => {
  const [tree, setTree] = useState([]);          // albero gerarchico
  const [flatFiles, setFlatFiles] = useState([]); // file root (senza cartella)
  const [selectedFile, setSelectedFile] = useState(MANUAL_SG118);
  const [loading, setLoading] = useState(true);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedElement, setSelectedElement] = useState(null);
  const [filteredFiles, setFilteredFiles] = useState(null);

  const { user, selectedShipId: shipId } = useUser();

  // Carica albero
  useEffect(() => {
    if (!shipId) return;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API}/api/shipFiles/tree/${shipId}`);
        const data = await res.json();
        // Separa cartelle root e file root (senza parent_folder_id e non cartella)
        const rootFolders = data.filter((n) => n.is_folder);
        const rootFiles   = data.filter((n) => !n.is_folder);
        setTree(rootFolders);
        setFlatFiles(rootFiles);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [shipId]);

  // Filtro per impianto
  const handleElementSelect = (node) => {
    setSelectedElement(node);
    const filtered = flatFiles.filter(
      (f) => f.element_id === node.id || f.element_model_id === node.element_model_id
    );
    setFilteredFiles(filtered);
    if (filtered.length > 0) setSelectedFile(filtered[0]);
  };

  const clearElementFilter = () => {
    setSelectedElement(null);
    setFilteredFiles(null);
    setSelectedFile(MANUAL_SG118);
  };

  const displayFlatFiles = filteredFiles !== null ? filteredFiles : flatFiles;

  // URL del file selezionato
  const fileUrl = resolveUrl(selectedFile?.file_link);
  const gdrive  = isGDriveLink(fileUrl);

  return (
    <div className="flex flex-col h-full gap-3 mt-4">

      {/* ── Header ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <h1 className="text-white text-lg font-semibold flex-1 truncate min-w-0">
          {selectedFile?.file_name || "Seleziona un file"}
        </h1>

        {selectedElement && (
          <div className="flex items-center gap-2 bg-[#789fd6]/20 border border-[#789fd6]/40 rounded-lg px-3 py-1.5 text-sm text-[#789fd6]">
            <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"/>
            </svg>
            <span className="max-w-[130px] truncate">{selectedElement.name}</span>
            <button onClick={clearElementFilter} className="ml-1 opacity-60 hover:opacity-100 cursor-pointer">
              <svg width="11" height="11" fill="currentColor" viewBox="0 0 384 512">
                <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
              </svg>
            </button>
          </div>
        )}

        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-2 bg-[#ffffff10] hover:bg-[#ffffff18] border border-[#ffffff15] rounded-lg px-3 py-2 text-sm text-white/70 hover:text-white transition cursor-pointer"
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"/>
          </svg>
          Filtra per Impianto
        </button>

        <button
          onClick={() => fileUrl && window.open(fileUrl, "_blank")}
          className="flex items-center gap-2 bg-[#789fd6] hover:bg-[#6a8fc4] rounded-lg px-3 py-2 text-sm text-white font-semibold transition cursor-pointer"
        >
          <svg width="14" height="14" fill="white" viewBox="0 0 512 512">
            <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 242.7-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7 288 32zM64 352c-35.3 0-64 28.7-64 64l0 32c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-32c0-35.3-28.7-64-64-64l-101.5 0-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352 64 352zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"/>
          </svg>
          Download
        </button>
      </div>

      {/* ── Layout principale ── */}
      <div className="flex gap-4 flex-1 min-h-0" style={{ height: "calc(100vh - 210px)" }}>

        {/* ── Sidebar ── */}
        <div className="w-72 flex-shrink-0 flex flex-col gap-1 overflow-y-auto pr-1" style={{ scrollbarWidth: "thin" }}>

          {/* Manuale fisso */}
          <div className="mb-2">
            <p className="text-[10px] text-white/25 uppercase tracking-widest font-mono mb-1.5 px-1">Documento principale</p>
            <FileCard
              file={MANUAL_SG118}
              isActive={selectedFile?.id === MANUAL_SG118.id}
              onClick={() => setSelectedFile(MANUAL_SG118)}
            />
          </div>

          <div className="border-t border-[#ffffff08] mb-2" />

          {loading && (
            <div className="flex justify-center py-8">
              <div className="w-4 h-4 border-2 border-[#789fd6] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && (
            <>
              {/* Cartelle con gerarchia */}
              {tree.length > 0 && (
                <div className="mb-2">
                  <p className="text-[10px] text-white/25 uppercase tracking-widest font-mono mb-1.5 px-1">Cartelle</p>
                  {tree.map((folder) => (
                    <FolderRow
                      key={folder.id}
                      node={folder}
                      depth={0}
                      selectedFile={selectedFile}
                      onSelectFile={setSelectedFile}
                    />
                  ))}
                </div>
              )}

              {/* File root (senza cartella) */}
              {displayFlatFiles.length > 0 && (
                <>
                  {tree.length > 0 && <div className="border-t border-[#ffffff08] mb-2" />}
                  <div>
                    <p className="text-[10px] text-white/25 uppercase tracking-widest font-mono mb-1.5 px-1">
                      {selectedElement ? `Impianto: ${selectedElement.name}` : "Documenti"}
                    </p>
                    <div className="flex flex-col gap-0.5">
                      {displayFlatFiles.map((file) => (
                        <FileCard
                          key={file.id}
                          file={file}
                          isActive={selectedFile?.id === file.id}
                          onClick={() => setSelectedFile(file)}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}

              {!loading && tree.length === 0 && displayFlatFiles.length === 0 && (
                <p className="text-white/25 text-xs text-center py-6">
                  Nessun documento disponibile
                </p>
              )}
            </>
          )}
        </div>

        {/* ── Viewer ── */}
        <div className="flex-1 rounded-xl overflow-hidden bg-[#ffffff05] border border-[#ffffff10] flex flex-col min-w-0">
          {selectedFile ? (
            gdrive ? (
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-[#ffffff10] bg-[#ffffff05] flex-shrink-0">
                  <svg width="15" height="15" viewBox="0 0 87.3 78" fill="none">
                    <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                    <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0-1.2 4.5h27.5z" fill="#00ac47"/>
                    <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
                    <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
                    <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
                    <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 27h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
                  </svg>
                  <span className="text-white/50 text-xs">Google Drive — {selectedFile.file_name}</span>
                  <a href={fileUrl} target="_blank" rel="noopener noreferrer"
                    className="ml-auto text-[#789fd6] text-xs hover:underline flex items-center gap-1">
                    Apri in Drive
                    <svg width="9" height="9" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                    </svg>
                  </a>
                </div>
                <iframe
                  src={fileUrl.replace("/view", "/preview")}
                  className="flex-1 w-full border-0"
                  allow="autoplay"
                  title={selectedFile.file_name}
                />
              </div>
            ) : fileUrl ? (
              <PdfViewer fileUrl={fileUrl} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-white/20">
                <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                </svg>
                <p className="text-sm">File non disponibile</p>
              </div>
            )
          ) : (
            <div className="flex items-center justify-center h-full text-white/20 text-sm">
              Seleziona un documento dalla lista
            </div>
          )}
        </div>
      </div>

      {/* ── Modals ── */}
      <ElementFilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onSelect={handleElementSelect}
      />
    </div>
  );
};

export default ManualInterface;
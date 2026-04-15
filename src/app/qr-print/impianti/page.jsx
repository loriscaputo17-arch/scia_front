"use client";

import { useState, useEffect, useMemo } from "react";
import { useUser } from "@/context/UserContext";
import { fetchElements } from "@/api/elements";

const BASE_APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://scia-frontend.vercel.app/";

const flattenElements = (nodes, level = 0) => {
  let result = [];

  nodes.forEach((node) => {
    result.push({ ...node, level });

    if (node.children?.length) {
      result = result.concat(flattenElements(node.children, level + 1));
    }
  });

  return result;
};

export default function QRPrintPage() {
  const { user, selectedShipId: shipId } = useUser();
  const teamId = user?.teamInfo?.teamId;
  const [elements, setElements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(new Set());
  const [selectMode, setSelectMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      try {
        const result = await fetchElements(shipId, user.id, teamId, ["El", "EI"]);
        const flat = flattenElements(result || []);
        setElements(flat);
        setLoading(false);
      } catch (error) {
        console.error("Errore durante il fetch degli elementi:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const filtered = useMemo(() => {
    if (!search.trim()) return elements;
    const q = search.toLowerCase();
    return elements.filter(
      (el) =>
        el.name?.toLowerCase().includes(q) ||
        el.serial_number?.toLowerCase().includes(q) ||
        (el.element_model?.ESWBS_code || el.eswbs_code)?.toLowerCase().includes(q)
    );
  }, [elements, search]);

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAll = () => setSelected(new Set(filtered.map((el) => el.id)));
  const clearAll = () => setSelected(new Set());
  const toPrint = selectMode && selected.size > 0 ? filtered.filter((el) => selected.has(el.id)) : filtered;

  if (loading) {
    return (
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh", background:"#001c38", color:"white" }}>
        Caricamento impianti...
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@400;500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #001c38; font-family: 'Rajdhani', sans-serif; color: white; }
        .toolbar { position: sticky; top: 0; z-index: 100; background: #022a52; border-bottom: 1px solid rgba(120,159,214,0.2); padding: 14px 24px; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .toolbar-title { font-size: 17px; font-weight: 700; letter-spacing: 0.08em; white-space: nowrap; }
        .toolbar-meta { font-family: 'Share Tech Mono', monospace; font-size: 10px; color: #789fd6; letter-spacing: 0.1em; }
        .divider { width: 1px; height: 28px; background: rgba(120,159,214,0.2); flex-shrink: 0; }
        .search-wrap { position: relative; flex: 1; min-width: 180px; max-width: 320px; }
        .search-wrap svg { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #789fd6; pointer-events: none; }
        .search-input { width: 100%; background: rgba(0,0,0,0.25); border: 1px solid rgba(120,159,214,0.25); color: white; padding: 7px 12px 7px 34px; border-radius: 4px; font-family: 'Rajdhani', sans-serif; font-size: 14px; outline: none; transition: border-color 0.2s; }
        .search-input::placeholder { color: rgba(255,255,255,0.3); }
        .search-input:focus { border-color: #789fd6; }
        .btn { border: none; padding: 7px 16px; font-family: 'Rajdhani', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; border-radius: 4px; transition: background 0.15s; white-space: nowrap; flex-shrink: 0; }
        .btn-ghost { background: transparent; border: 1px solid rgba(120,159,214,0.35); color: #789fd6; }
        .btn-ghost:hover { background: rgba(120,159,214,0.1); }
        .btn-ghost.active { background: rgba(120,159,214,0.18); border-color: #789fd6; color: white; }
        .btn-primary { background: #789fd6; color: white; }
        .btn-primary:hover { background: #5a83c0; }
        .btn-danger { background: transparent; border: 1px solid rgba(248,113,113,0.4); color: #f87171; }
        .btn-danger:hover { background: rgba(248,113,113,0.1); }
        .badge { display: inline-flex; align-items: center; justify-content: center; background: #789fd6; color: white; border-radius: 999px; font-size: 11px; font-weight: 700; min-width: 20px; height: 20px; padding: 0 6px; margin-left: 6px; }
        .toolbar-right { margin-left: auto; display: flex; align-items: center; gap: 8px; }
        .stats-bar { padding: 8px 24px; background: rgba(0,0,0,0.2); border-bottom: 1px solid rgba(120,159,214,0.1); display: flex; align-items: center; gap: 20px; font-family: 'Share Tech Mono', monospace; font-size: 14px; color: rgba(120,159,214,0.7); letter-spacing: 0.1em; }
        .stats-bar strong { color: white; margin-left: 4px; }
        .grid-wrapper { padding: 24px; display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 16px; }
        .qr-card { background: white; color: #001c38; border-radius: 6px; overflow: hidden; display: flex; flex-direction: column; position: relative; transition: box-shadow 0.15s, transform 0.15s; }
        .qr-card.selectable { cursor: pointer; }
        .qr-card.selectable:hover { transform: translateY(-2px); box-shadow: 0 4px 20px rgba(120,159,214,0.3); }
        .qr-card.is-selected { outline: 2.5px solid #789fd6; outline-offset: 2px; }
        .qr-card.is-deselected { opacity: 0.35; }
        .select-check { position: absolute; top: 8px; right: 8px; width: 22px; height: 22px; border-radius: 50%; background: white; border: 2px solid #789fd6; display: flex; align-items: center; justify-content: center; z-index: 5; transition: background 0.15s; }
        .qr-card.is-selected .select-check { background: #789fd6; }
        .select-check svg { display: none; }
        .qr-card.is-selected .select-check svg { display: block; }
        .qr-card-header { background: #001c38; padding: 8px 12px 6px; display: flex; align-items: center; justify-content: space-between; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .qr-card-header-label { font-family: 'Share Tech Mono', monospace; font-size: 10px; letter-spacing: 0.15em; color: #789fd6; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .qr-card-header-eswbs { font-family: 'Share Tech Mono', monospace; font-size: 14px; color: rgba(255,255,255,0.6); }
        .qr-card-body { padding: 12px; display: flex; flex-direction: column; align-items: center; gap: 7px; flex: 1; }
        .qr-img-wrapper img { width: 180px; height: 180px; display: block; }
        .qr-card-name { font-size: 14px; font-weight: 700; text-align: center; line-height: 1.3; color: #001c38; }
        .qr-card-serial { font-family: 'Share Tech Mono', monospace; font-size: 14px; color: #789fd6; text-align: center; }
        .qr-card-url { font-family: 'Share Tech Mono', monospace; font-size: 7px; color: #aaa; text-align: center; word-break: break-all; line-height: 1.4; }
        .empty { grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: rgba(120,159,214,0.5); font-family: 'Share Tech Mono', monospace; font-size: 13px; letter-spacing: 0.1em; }
        @media print {
          .toolbar, .stats-bar { display: none !important; }
          body { background: white !important; }
          .grid-wrapper { padding: 6mm; gap: 5mm; grid-template-columns: repeat(4, 1fr); }
          .qr-card { break-inside: avoid; border: 1px solid #ddd; box-shadow: none !important; outline: none !important; opacity: 1 !important; transform: none !important; }
          .select-check { display: none !important; }
        }
      `}</style>

      <div className="toolbar">
        <div>
          <div className="toolbar-title">QR Code Impianti</div>
          <div className="toolbar-meta">NAVE {shipId}</div>
        </div>
        <div className="divider" />
        <div className="search-wrap">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input className="search-input" placeholder="Cerca nome, S/N, ESWBS..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="divider" />
        <button className={`btn btn-ghost ${selectMode ? "active" : ""}`} onClick={() => { setSelectMode((v) => !v); clearAll(); }}>
          ☑ Selezione manuale
          {selectMode && selected.size > 0 && <span className="badge">{selected.size}</span>}
        </button>
        {selectMode && <>
          <button className="btn btn-ghost" onClick={selectAll}>Tutti</button>
          <button className="btn btn-danger" onClick={clearAll}>Deseleziona</button>
        </>}
        <div className="toolbar-right">
          <button className="btn btn-primary" onClick={() => window.print()}>
            Stampa {selectMode && selected.size > 0 ? `(${selected.size})` : ""}
          </button>
        </div>
      </div>

      <div className="stats-bar">
        <span>TOTALE <strong>{elements.length}</strong></span>
        <span>VISUALIZZATI <strong>{filtered.length}</strong></span>
        {selectMode && <span>SELEZIONATI <strong>{selected.size}</strong></span>}
        <span>DA STAMPARE <strong>{toPrint.length}</strong></span>
      </div>

      <div className="grid-wrapper">
        {filtered.length === 0 ? (
          <div className="empty">NESSUN RISULTATO PER "{search}"</div>
        ) : filtered.map((el) => {
          const isSelected = selected.has(el.id);
          const isDeselected = selectMode && selected.size > 0 && !isSelected;
          const url = `${BASE_APP_URL}/dashboard/impianti/${el.id}`;
          const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(url)}&margin=6&color=001c38`;
          return (
            <div key={el.id} className={`qr-card ${selectMode ? "selectable" : ""} ${isSelected ? "is-selected" : ""} ${isDeselected ? "is-deselected" : ""}`} onClick={selectMode ? () => toggleSelect(el.id) : undefined}>
              {selectMode && (
                <div className="select-check">
                  <svg width="12" height="12" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              )}
              <div className="qr-card-header">
                <span className="qr-card-header-label">SCIA · IMPIANTO</span>
                <span className="qr-card-header-eswbs">{el.element_model?.ESWBS_code || el.eswbs_code}</span>
              </div>
              <div className="qr-card-body">
                <div className="qr-img-wrapper"><img src={qrSrc} alt={`QR ${el.name}`} /></div>
                <div className="qr-card-name" style={{ paddingLeft: `${(el.level ?? 0) * 10}px` }}>
                  {el.name}
                </div>
                <div className="qr-card-serial">Code: {el.code}</div>
                <div className="qr-card-serial">ESWBS: {el.eswbs_code}</div>
                <div className="qr-card-url">{url}</div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
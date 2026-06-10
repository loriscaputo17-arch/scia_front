"use client";

import { useState } from "react";
import { getCompletedReport } from "@/api/maintenance";
import { useTranslation } from "@/app/i18n";

// helper: evita di rompere l'HTML della finestra di stampa
const esc = (v) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const fmtDate = (d) => {
  if (!d) return "—";
  const date = new Date(d);
  return isNaN(date) ? "—" : date.toLocaleDateString("it-IT");
};

// preset periodo → ritorna {from, to} in formato YYYY-MM-DD
const presetRange = (key) => {
  const today = new Date();
  const to = today.toISOString().slice(0, 10);
  const start = new Date(today);
  switch (key) {
    case "month": start.setMonth(start.getMonth() - 1); break;
    case "quarter": start.setMonth(start.getMonth() - 3); break;
    case "year": start.setFullYear(start.getFullYear() - 1); break;
    case "all": return { from: "", to: "" };
    default: return { from: "", to: "" };
  }
  return { from: start.toISOString().slice(0, 10), to };
};

const PRESETS = [
  { key: "month", labelKey: "report_last_month" },
  { key: "quarter", labelKey: "report_last_quarter" },
  { key: "year", labelKey: "report_last_year" },
  { key: "all", labelKey: "report_all" },
];

export default function ReportModal({ isOpen, onClose, shipId }) {
  const { t, i18n } = useTranslation("maintenance");

  const [preset, setPreset] = useState("month");
  const [from, setFrom] = useState(presetRange("month").from);
  const [to, setTo] = useState(presetRange("month").to);
  const [rows, setRows] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const applyPreset = (key) => {
    setPreset(key);
    const r = presetRange(key);
    setFrom(r.from);
    setTo(r.to);
  };

  const onManualDate = (which, value) => {
    setPreset("custom");
    if (which === "from") setFrom(value);
    else setTo(value);
  };

  const generate = async () => {
    setLoading(true);
    setError(null);
    setRows(null);
    try {
      const data = await getCompletedReport(shipId, from, to);
      setRows(data);
    } catch (e) {
      setError(e.message || t("report_error"));
    } finally {
      setLoading(false);
    }
  };

const periodLabel = () => {
  const opts = { interpolation: { escapeValue: false } };
  if (!from && !to) return t("report_all_activities");
  if (from && to) return t("report_period_from_to", { from: fmtDate(from), to: fmtDate(to), ...opts });
  if (from) return t("report_period_from", { from: fmtDate(from), ...opts });
  return t("report_period_to", { to: fmtDate(to), ...opts });
};

  // traduce l'esito grezzo (OK / Anomalia / —) arrivato dal backend
  const esitoLabel = (esito) =>
    esito === "OK" ? t("report_outcome_ok")
    : esito === "Anomalia" ? t("report_outcome_anomaly")
    : "—";

  const printReport = () => {
    if (!rows || rows.length === 0) return;

    const body = rows
      .map(
        (r, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${esc(r.task)}</td>
          <td class="mono">${esc(r.eswbs)}</td>
          <td>${esc(r.componente)}</td>
          <td>${esc(r.esecutore)}</td>
          <td>${esc(fmtDate(r.data_esecuzione))}</td>
          <td>${esc(esitoLabel(r.esito))}</td>
        </tr>`
      )
      .join("");

    const html = `
      <!DOCTYPE html>
      <html lang="${esc(i18n.language || "it")}">
      <head>
        <meta charset="utf-8" />
        <title>${esc(t("report_title"))}</title>
        <style>
          * { box-sizing: border-box; }
          body { font-family: Arial, Helvetica, sans-serif; color: #111; margin: 32px; }
          .head { display: flex; align-items: baseline; justify-content: space-between; border-bottom: 3px solid #022a52; padding-bottom: 12px; margin-bottom: 16px; }
          .head h1 { color: #022a52; font-size: 20px; margin: 0; }
          .meta { font-size: 12px; color: #555; }
          .meta b { color: #022a52; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          thead th { background: #022a52; color: #fff; text-align: left; padding: 8px; }
          tbody td { border-bottom: 1px solid #ddd; padding: 7px 8px; vertical-align: top; }
          tbody tr:nth-child(even) { background: #f4f7fb; }
          .mono { font-family: monospace; }
          .empty { padding: 24px; text-align: center; color: #777; }
          .foot { margin-top: 18px; font-size: 10px; color: #999; }
          @media print { body { margin: 12mm; } }
        </style>
      </head>
      <body>
        <div class="head">
          <h1>${esc(t("report_title"))}</h1>
          <div class="meta">
            <div><b>${esc(t("report_period"))}:</b> ${esc(periodLabel())}</div>
            <div><b>${esc(t("report_total"))}:</b> ${rows.length}</div>
            <div>${esc(t("report_generated_on"))} ${esc(new Date().toLocaleString(i18n.language || "it"))}</div>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>${esc(t("report_col_task"))}</th>
              <th>${esc(t("report_col_eswbs"))}</th>
              <th>${esc(t("report_col_component"))}</th>
              <th>${esc(t("report_col_executor"))}</th>
              <th>${esc(t("report_col_date_exec"))}</th>
              <th>${esc(t("report_col_outcome"))}</th>
            </tr>
          </thead>
          <tbody>
            ${body || `<tr><td colspan="7" class="empty">${esc(t("report_empty_print"))}</td></tr>`}
          </tbody>
        </table>
        <div class="foot">${esc(t("report_footer"))}</div>
        <script>window.onload = function () { window.print(); }</script>
      </body>
      </html>`;

    const w = window.open("", "_blank");
    if (!w) {
      setError(t("report_popup_blocked"));
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-30">
      <div className="bg-[#022a52] w-full sm:w-[640px] max-w-[92vw] p-6 rounded-lg shadow-lg text-white flex flex-col" style={{ maxHeight: "85vh" }}>

        {/* header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[22px] font-semibold">{t("report_title")}</h2>
          <button className="text-white cursor-pointer opacity-70 hover:opacity-100" onClick={onClose}>
            <svg width="24" height="24" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
              <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
            </svg>
          </button>
        </div>

        {/* preset periodo */}
        <p className="text-[#789fd6] text-sm mb-2">{t("report_period")}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {PRESETS.map((p) => (
            <button
              key={p.key}
              onClick={() => applyPreset(p.key)}
              className={`px-3 py-1.5 rounded-full text-sm transition ${
                preset === p.key
                  ? "bg-[#789fd6] text-[#022a52] font-semibold"
                  : "bg-[#ffffff10] text-white/70 hover:bg-[#ffffff18]"
              }`}
            >
              {t(p.labelKey)}
            </button>
          ))}
        </div>

        {/* date custom */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col">
            <label className="text-[#789fd6] text-sm mb-1">{t("report_from")}</label>
            <input
              type="date"
              value={from}
              onChange={(e) => onManualDate("from", e.target.value)}
              className="px-3 py-2 bg-[#ffffff10] text-white rounded-md outline-none"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-[#789fd6] text-sm mb-1">{t("report_to")}</label>
            <input
              type="date"
              value={to}
              onChange={(e) => onManualDate("to", e.target.value)}
              className="px-3 py-2 bg-[#ffffff10] text-white rounded-md outline-none"
            />
          </div>
        </div>

        <button
          onClick={generate}
          disabled={loading}
          className="w-full bg-[#789fd6] hover:bg-[#6a8fc4] disabled:opacity-50 p-2.5 rounded-md font-semibold transition cursor-pointer mb-4"
        >
          {loading ? t("report_loading") : t("report_generate")}
        </button>

        {error && (
          <div className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200 mb-3">
            {error}
          </div>
        )}

        {/* anteprima */}
        {rows && (
          <div className="flex-1 min-h-0 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-white/70">
                {t("report_summary", { count: rows.length, period: "" })}
              </p>
              {rows.length > 0 && (
                <button
                  onClick={printReport}
                  className="flex items-center gap-2 bg-white text-[#022a52] font-semibold rounded-md px-4 py-1.5 text-sm cursor-pointer hover:bg-white/90 transition"
                >
                  <svg width="15" height="15" fill="currentColor" viewBox="0 0 512 512">
                    <path d="M128 0C92.7 0 64 28.7 64 64l0 96 64 0 0-96 226.7 0L384 93.3l0 66.7 64 0 0-66.7c0-17-6.7-33.3-18.7-45.3L400 18.7C388 6.7 371.7 0 354.7 0L128 0zM384 352l0 96-256 0 0-96 256 0zm64 32l32 0c17.7 0 32-14.3 32-32l0-96c0-35.3-28.7-64-64-64L64 192c-35.3 0-64 28.7-64 64l0 96c0 17.7 14.3 32 32 32l32 0 0 64c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-64zM432 248a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" />
                  </svg>
                  {t("report_print")}
                </button>
              )}
            </div>

            <div className="flex-1 overflow-auto rounded-md border border-[#ffffff12]">
              {rows.length === 0 ? (
                <p className="text-white/40 text-sm text-center py-10">
                  {t("report_empty")}
                </p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-[#001c38]">
                    <tr className="text-left text-white/60">
                      <th className="p-2">{t("report_col_task")}</th>
                      <th className="p-2">{t("report_col_eswbs")}</th>
                      <th className="p-2">{t("report_col_component")}</th>
                      <th className="p-2">{t("report_col_executor")}</th>
                      <th className="p-2">{t("report_col_date")}</th>
                      <th className="p-2">{t("report_col_outcome")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, i) => (
                      <tr key={r.id ?? i} className="border-t border-[#ffffff0d]">
                        <td className="p-2">{r.task || "—"}</td>
                        <td className="p-2 font-mono text-[#789fd6]">{r.eswbs || "—"}</td>
                        <td className="p-2">{r.componente || "—"}</td>
                        <td className="p-2">{r.esecutore || "—"}</td>
                        <td className="p-2 whitespace-nowrap">{fmtDate(r.data_esecuzione)}</td>
                        <td className="p-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            r.esito === "Anomalia" ? "bg-red-500/20 text-red-300"
                            : r.esito === "OK" ? "bg-green-500/20 text-green-300"
                            : "bg-white/10 text-white/50"
                          }`}>
                            {esitoLabel(r.esito)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
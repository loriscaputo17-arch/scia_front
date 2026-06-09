"use client";

import { useEffect, useState } from "react";
import DashboardHeader from "@/components/header/DashboardHeader";
import { getLogs } from "@/api/profile";

// stile per livello (barra laterale, pallino, badge, testo)
const LEVELS = {
  error: {
    label: "Error",
    bar: "bg-red-500",
    dot: "bg-red-400",
    badge: "bg-red-500/15 text-red-300 ring-1 ring-red-500/30",
  },
  warn: {
    label: "Warn",
    bar: "bg-amber-500",
    dot: "bg-amber-400",
    badge: "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30",
  },
  info: {
    label: "Info",
    bar: "bg-[#789fd6]",
    dot: "bg-[#789fd6]",
    badge: "bg-[#789fd6]/15 text-[#9ec3f0] ring-1 ring-[#789fd6]/30",
  },
  default: {
    label: "Log",
    bar: "bg-white/20",
    dot: "bg-white/40",
    badge: "bg-white/10 text-white/60 ring-1 ring-white/15",
  },
};

const styleFor = (level) => LEVELS[level] || LEVELS.default;

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [logType, setLogType] = useState("combined");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    getLogs(logType)
      .then((data) => {
        setLogs(data || []);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Errore nel caricamento dei log");
        setIsLoading(false);
      });
  }, [logType]);

  const tabs = [
    { id: "combined", label: "Logs" },
    { id: "error", label: "Errors" },
  ];

  return (
    <div className="flex h-screen flex-col bg-[#001c38] p-4 text-white">
      <DashboardHeader />

      {/* barra tab */}
      <div className="mt-8 flex items-center justify-between">
        <div className="flex gap-2">
          {tabs.map((tab) => {
            const active = logType === tab.id;
            const isErr = tab.id === "error";
            return (
              <button
                key={tab.id}
                onClick={() => setLogType(tab.id)}
                className={[
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? isErr
                      ? "bg-red-500 text-white shadow-sm shadow-red-500/30"
                      : "bg-[#789fd6] text-[#001c38] shadow-sm shadow-[#789fd6]/30"
                    : isErr
                      ? "text-red-300/80 ring-1 ring-red-500/30 hover:bg-red-500/10"
                      : "text-[#9ec3f0] ring-1 ring-[#789fd6]/30 hover:bg-[#789fd6]/10",
                ].join(" ")}
              >
                {tab.label}
                {active && !isLoading && (
                  <span className="ml-2 rounded-full bg-black/15 px-1.5 py-0.5 text-[11px]">
                    {logs.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* contenitore log */}
      <div className="mt-5 flex-1 overflow-auto rounded-2xl border border-white/10 bg-[#002340] p-3 sm:p-4">
        {/* loading: skeleton */}
        {isLoading && (
          <div className="space-y-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <div className="mb-3 flex justify-between">
                  <div className="h-4 w-20 rounded bg-white/10" />
                  <div className="h-4 w-32 rounded bg-white/10" />
                </div>
                <div className="h-3 w-3/4 rounded bg-white/10" />
              </div>
            ))}
          </div>
        )}

        {/* errore */}
        {error && !isLoading && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        )}

        {/* vuoto */}
        {!isLoading && !error && logs.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-2 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="1.8" className="text-white/40">
                <path d="M4 6h16M4 12h16M4 18h10" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-sm text-white/50">Nessun log disponibile.</p>
          </div>
        )}

        {/* lista */}
        {!isLoading && !error && logs.length > 0 && (
          <div className="space-y-3">
            {logs.map((log, index) => {
              const s = styleFor(log.level);
              return (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] pl-4 pr-4 py-3 transition-colors hover:bg-white/[0.05]"
                >
                  {/* barra laterale per livello */}
                  <span className={`absolute left-0 top-0 h-full w-1 ${s.bar}`} />

                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${s.badge}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                      {(log.level || "log")}
                    </span>
                    <span className="font-mono text-[11px] text-white/40">
                      {log.timestamp ? new Date(log.timestamp).toLocaleString() : "—"}
                    </span>
                  </div>

                  {/* messaggio in evidenza */}
                  {log.message && (
                    <p className="mb-2 text-sm text-white/90">{log.message}</p>
                  )}

                  {/* JSON grezzo */}
                  <pre className="overflow-x-auto rounded-lg bg-black/25 p-3 text-[11px] leading-relaxed text-white/55 font-mono whitespace-pre-wrap">
                    {JSON.stringify(log, null, 2)}
                  </pre>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
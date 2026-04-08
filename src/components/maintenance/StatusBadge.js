"use client";

import { forwardRef, useEffect, useState } from "react";
import { useTranslation } from "@/app/i18n";

const StatusBadge = forwardRef(function StatusBadge(
  { dueDate, dueDays, earlyThreshold, dueThreshold, delayThreshold, fallbackLabel },
  ref
) {
  const { t, i18n } = useTranslation("maintenance");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted || !i18n.isInitialized) return null;

  if (!dueDate && fallbackLabel) {
    return (
      <div className="flex items-center justify-center h-full px-3 py-2">
        <span className="text-white/60 text-sm font-medium italic">
          {fallbackLabel}
        </span>
      </div>
    );
  }

  const parseLocalDate = (value) => {
    if (!value) return null;

    if (value instanceof Date) return new Date(value.getFullYear(), value.getMonth(), value.getDate());

    if (typeof value === "string") {
      const [datePart] = value.split("T");
      const [y, m, d] = datePart.split("-").map(Number);
      return new Date(y, m - 1, d);
    }

    let tmp = new Date(value);
    return isNaN(tmp) ? null : new Date(tmp.getFullYear(), tmp.getMonth(), tmp.getDate());
  };

  const end = parseLocalDate(dueDate);
  if (!end) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const early = Number(earlyThreshold ?? 0);
  const due = Number(dueThreshold ?? 0);
  const delay = Number(delayThreshold ?? 0);

  const greenStart = new Date(end); greenStart.setDate(end.getDate() - early);
  const yellowStart = new Date(end); yellowStart.setDate(end.getDate() - due);
  const orangeStart = new Date(end);
  const redStart = new Date(end); redStart.setDate(end.getDate() + delay);

  const daysLeft = dueDays ?? 0;
  let bgColor = "transparent";

  if (daysLeft > early) {
    bgColor = "transparent";                 
  } else if (daysLeft > due) {
    bgColor = "rgb(45,182,71)";  //attiva              
  } else if (daysLeft > 0) {
    bgColor = "rgb(255,191,37)"; //in scadenza               
  } else if (daysLeft >= -delay) {
    bgColor = "rgb(244,114,22)"; //scaduta da poco              
  } else {
    bgColor = "rgb(208,2,27)"; //scaduta         
  }

  const formattedDate = end.toLocaleDateString(i18n.language === "en" ? "en-GB" : "it-IT");

  return (
    <div
      ref={ref}
      className="text-center sm:p-4 text-white"
      
    >
      <div className="flex sm:hidden items-center justify-center gap-2 text-xs">
        <span className="px-2 py-1 rounded-full" style={{ background: bgColor }}>
          {formattedDate}
        </span>
        <span className="opacity-60 text-white">
          {dueDays < 0 ? "+" : "-"} {Math.abs(dueDays)}{t("days_short")}
        </span>
      </div>

      <div className="hidden sm:block">
        <p className="text-xl">{formattedDate}</p>
        <p className="text-[16px] opacity-60">
          {dueDays < 0 ? "+" : "-"} {Math.abs(dueDays)}{t("days_short")}
        </p>
      </div>
    </div>
  );
});

export default StatusBadge;

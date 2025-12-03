import { useTranslation } from "@/app/i18n";
import { useState, useEffect } from "react";

const StatusBadgeDetail = ({ dueDate, pauseDate, string }) => {
  const { t, i18n } = useTranslation("maintenance");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted || !i18n.isInitialized) return null;

  let bgColor = "bg-gray-400"; 
  let textColor = "text-white";
  let symbol = "+";

  const today = new Date();
  const dueDateObj = new Date(dueDate);
  const diffDays = Math.ceil((dueDateObj - today) / (1000 * 60 * 60 * 24));

  if (string === "inPause") {
    bgColor = "bg-[rgba(255,255,255,0.2)]";
    symbol = "";
  } else if (diffDays < 0) {
    bgColor = "bg-[rgb(208,2,27)]"; // Rosso
    symbol = "+";
  } else if (diffDays <= 5) {
    bgColor = "bg-[rgb(244,114,22)]"; // Arancione
    symbol = "-";
  } else if (diffDays <= 15) {
    bgColor = "bg-[rgb(255,191,37)]"; // Giallo
    textColor = "text-black";
    symbol = "-";
  } else {
    bgColor = "bg-[rgb(45,182,71)]"; // Verde
    symbol = "-";
  }

  let label = "";
  let dateToShow = null;

  if (string === "inPause") {
    label = t("inPauseFrom"); // "in pausa dal"
    dateToShow = pauseDate;
  } else if (diffDays < 0) {
    label = t("expiredFrom"); // "scaduta da"
    dateToShow = dueDate;
  } else {
    label = t("activeFrom"); // "attiva da"
    dateToShow = dueDate;
  }

  const formattedDate =
    dateToShow ? new Date(dateToShow).toLocaleDateString("it-IT") : "N/A";

  /* =========================
            RENDER
  ========================== */

  return (
    <div
      className={`w-fit sm:text-[16px] text-[12px] rounded-full py-1 px-4 ${bgColor} ${textColor}`}
    >
      {label} {formattedDate}
    </div>
  );
};

export default StatusBadgeDetail;

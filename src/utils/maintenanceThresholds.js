// @/utils/maintenanceThresholds.js

// stessa logica di parseLocalDate usata prima in StatusBadge
const parseLocalDate = (value) => {
  if (!value) return null;

  if (value instanceof Date) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }

  if (typeof value === "string") {
    const [datePart] = value.split("T");
    const [y, m, d] = datePart.split("-").map(Number);
    return new Date(y, m - 1, d);
  }

  let tmp = new Date(value);
  return isNaN(tmp) ? null : new Date(tmp.getFullYear(), tmp.getMonth(), tmp.getDate());
};

/**
 * Calcola background e data finale partendo da dueDate + thresholds
 *
 * @param {Object} params
 * @param {Date|string|number|null} params.dueDate
 * @param {number|null|undefined} params.earlyThreshold
 * @param {number|null|undefined} params.dueThreshold
 * @param {number|null|undefined} params.delayThreshold
 * @param {Date} [params.today] - usato solo per test, di default new Date()
 * @returns {{ endDate: Date|null, bgColor: string }}
 */
export const getDeadlineVisuals = ({
  dueDate,
  earlyThreshold,
  dueThreshold,
  delayThreshold,
  today = new Date(),
}) => {
  const end = parseLocalDate(dueDate);
  if (!end) return { endDate: null, bgColor: "transparent" };

  const localToday = new Date(today);
  localToday.setHours(0, 0, 0, 0);

  const early = Number(earlyThreshold ?? 0);
  const due = Number(dueThreshold ?? 0);
  const delay = Number(delayThreshold ?? 0);

  const greenStart = new Date(end);
  greenStart.setDate(end.getDate() - early);

  const yellowStart = new Date(end);
  yellowStart.setDate(end.getDate() - due);

  const orangeStart = new Date(end);

  const redStart = new Date(end);
  redStart.setDate(end.getDate() + delay);

  let bgColor = "transparent";

  if (localToday < greenStart) bgColor = "transparent";
  else if (localToday < yellowStart) bgColor = "rgb(45,182,71)";
  else if (localToday < orangeStart) bgColor = "rgb(255,191,37)";
  else if (localToday < redStart) bgColor = "rgb(244,114,22)";
  else bgColor = "rgb(208,2,27)";

  return { endDate: end, bgColor };
};

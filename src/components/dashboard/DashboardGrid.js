"use client";

import useSWR from "swr";
import { useUser } from "@/context/UserContext";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { fetchDashboardSummary } from "@/api/summary";
import { useTranslation } from "@/app/i18n";

const categories = [
  { id: "Maintenance", key: "maintenance", imageSrc: "/icons/ico_dashboard_maintenance.png" },
  { id: "Checklist",   key: "checklist",   imageSrc: "/icons/dash_checklist.png" },
  { id: "Readings",    key: "readings",    imageSrc: "/icons/time.png" },
  { id: "Spare",       key: "spares",      imageSrc: "/icons/dash_corr.png" },
  { id: "files",       key: "files",       imageSrc: "/icons/ico_dashboard_manual.png" },
  { id: "failures",    key: "failures",    imageSrc: "/icons/dash_warning.png" }
];

export default function DashboardGrid() {
  const { user, loading } = useUser();
  const { t, i18n } = useTranslation("dashboard");

  const shipId = user?.teamInfo?.assignedShip?.id;

  // ⚠️ Always call all hooks before returning!
  const { data, error } = useSWR(
    shipId ? ["dashboardSummary", shipId, user?.id] : null,
    ([_, shipId, userId]) => fetchDashboardSummary(shipId, userId),
    { refreshInterval: 30000 }
  );

  // After all hooks are called → returns are now safe
  if (loading) return <div>Loading...</div>;
  if (!user) return null;
  if (!i18n?.isInitialized) return null;

  const counters = data?.counters || {};
  const last     = data?.last || {};

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full h-full pb-8">
      {categories.map((cat) => (
        <DashboardCard
          key={cat.id}
          id={cat.id}
          title={t(cat.key)}
          imageSrc={cat.imageSrc}
          counter={counters[cat.key] ?? 0}
          lastItems={last[cat.key] ?? []}
          loading={!data && !error}
        />
      ))}
    </div>
  );
}

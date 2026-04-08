// src/app/dashboard/spare/[category]/page.js
import DashboardHeader from "@/components/header/DashboardHeader";
import Breadcrumbs from "@/components/dashboard/Breadcrumbs";
import SpareTable from "@/components/spare/SpareTable";

export default function SparePage({ params }) {

  return (
    <div className="flex flex-col h-screen bg-[#001c38] text-white p-4">
      <DashboardHeader />
      <div className="flex w-full mt-4 items-center">
        <Breadcrumbs />
      </div>
      <div className="flex-1 rounded-lg">
        <SpareTable />
      </div>
    </div>
  );
}


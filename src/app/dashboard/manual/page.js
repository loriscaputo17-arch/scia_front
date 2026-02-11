"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardHeader from "@/components/header/DashboardHeader";
import Breadcrumbs from "@/components/dashboard/Breadcrumbs";
import ManualInterface from "@/components/manual/ManualInterface";

export default function ManualPage() {
  const params = useParams();
  const category = params?.category;

  return (
    <div className="flex flex-col h-screen bg-[#001c38] text-white p-4">
      <DashboardHeader />

      <div className="flex w-full mt-4 items-center">
        <Breadcrumbs />
      </div>

      <div className="flex-1 rounded-lg">
        <ManualInterface />
      </div>
    </div>
  );
}

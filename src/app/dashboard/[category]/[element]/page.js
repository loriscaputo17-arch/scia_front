"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { fetchElementData } from '@/api/elements';
import InfoCard from '@/components/element/InfoCard';
import MaintenanceStatus from '@/components/element/MaintenanceStatus';
import SparePartsStatus from '@/components/element/SparePartsStatus';
import DetailsPanel from '@/components/element/DetailsPanel';
import DashboardHeader from "@/components/header/DashboardHeader";
import Breadcrumbs from "@/components/dashboard/Breadcrumbs";
import Image from 'next/image';
import { useUser } from "@/context/UserContext";
import Link from "next/link";

export default function ElementPage() {
  const { element } = useParams();
  const [data, setData] = useState(null);
  const { user } = useUser();
  const shipId = user?.teamInfo?.assignedShip?.id;

  useEffect(() => {
    const getData = async () => {
      if (element) {
        const result = await fetchElementData(element, shipId);
        setData(result);
      }
    };
    getData();
  }, [element]);

  if (!data) {
    return <p>Elemento non trovato.</p>;
  }

  return (
    <div className="flex flex-col bg-[#001c38] text-white p-4">
      <DashboardHeader />

      <div className="flex w-full items-center mt-4">
        <Breadcrumbs />
      </div>

      <div className="flex items-center pt-2 pb-4">
        <h2 className="text-2xl font-bold">{data.element.name}</h2>

      {data.model.ElementModel_installation_drawing_link &&
        <Link href={data.model.ElementModel_installation_drawing_link}>
        <button
          type="submit"
          className="flex items-center ml-auto bg-[#789fd6] hover:bg-blue-500 text-white font-bold py-2 px-4 transition duration-200 cursor-pointer rounded-md"
        >
          <Image 
            src="/icons/download.svg"
            alt="download"
            width={15} 
            height={15}
          />
          &nbsp;
          Downloads
        </button>

        </Link>
      }
      </div>

      <div className="sm:flex block gap-4">
        <div className="sm:w-3/5 w-full space-y-4 bg-[#022a52] p-6 rounded-md sm:mb-0 mb-4">
          <InfoCard data={data} />
          <div className="sm:flex block px-2">
            <div className="sm:w-1/2 w-full">
              <MaintenanceStatus status={data.maintenanceStatus} />
            </div>
            <div className="sm:w-1/2 w-full">
              <SparePartsStatus status={data.sparePartsStatus} />
            </div>
          </div>
        </div>

        <div className="sm:w-2/5 w-full bg-[#022a52] p-4 rounded-md">
          <DetailsPanel details={data} />
        </div>
      </div>
    </div>
  );
}

"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import UserInfo from "@/components/header/UserInfo";
import QRCode from "@/components/icons/Qrcode";
import LastScan from "@/components/header/LastScan";
import MenuButton from "@/components/header/MenuButton";
import BackIcon from "@/components/icons/BackIcon";
import Link from "next/link";

export default function DashboardHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const isDashboard = pathname === "/dashboard";

  return (
    <div className="flex w-full h-[80px] items-center gap-4">
      <Link href="/dashboard" className="flex-[1] h-full flex items-center justify-center bg-[#fff] rounded-lg p-2">
        <div>
          <Image src="/logo.png" alt="Logo" width={120} height={60} className="object-contain h-full w-auto" />
        </div>
      </Link>

      {!isDashboard && (
        <div 
          className="flex-[1] h-full flex items-center justify-center bg-[#022a52] rounded-lg cursor-pointer"
          onClick={() => router.back()}
        >
          <BackIcon className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
        </div>
      )}

      <div className="sm:flex-[3] flex-[1] h-full flex items-center bg-[#022a52] rounded-lg p-3">
        <UserInfo />
      </div>

      <div className="flex-[1] h-full flex items-center justify-center bg-[#022a52] rounded-lg">
        <QRCode />
      </div>

      <div className="flex-[5] h-full flex items-center bg-[#022a52] rounded-lg py-3 px-6 hidden sm:block">
        <LastScan />
      </div>

      <div className="flex-[1] h-full flex items-center justify-center bg-[#022a52] rounded-lg">
        <MenuButton />
      </div>
    </div>
  );
}

"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import { useTranslation } from "@/app/i18n";
import { getAPIbackend } from "@/api/profile";
import { useUser } from "@/context/UserContext";

export default function DropdownMenu({ isOpen, onClose }) {
  const menuRef = useRef(null);
  const router = useRouter();
  const { t, i18n } = useTranslation("header");
  const [mounted, setMounted] = useState(false);
  const [BEVersion, setBEVersion] = useState([]);

  const { user, selectedShipId: shipId } = useUser();


  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  useEffect(() => {
            getAPIbackend().then((data) => {
              setBEVersion(data || []);
            });
        }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted || !i18n.isInitialized) return null;

  return (
    <div
      ref={menuRef}
      className="absolute z-2 right-0 mt-2 w-48 bg-[#022a52] text-white shadow-md rounded-md py-2"
    >
      <ul className="text-sm">
        <li>
          <Link href="/dashboard" className="flex items-center px-4 py-2 hover:bg-[#033d75] cursor-pointer">
              <Image
                                                    src="/icons/homeico.svg"
                                                    alt="back"
                                                    className="mr-2 invert"
                                                    width={14}
                                                    height={14}
                                                  />
              Dashboard
          </Link>
        </li>
        <li>
          <div onClick={() => router.push(`/dashboard/impianti`)} className="flex items-center px-4 py-2 hover:bg-[#033d75] cursor-pointer">
          <Image
                                                    src="/icons/facilitiesico.svg"
                                                    alt="back"
                                                    className="mr-2 invert"
                                                    width={14}
                                                    height={14}
                                                  />               {t("facilities")}
          </div>
        </li>
        <li>
          <Link href="/dashboard/cart" className="flex items-center px-4 py-2 hover:bg-[#033d75] cursor-pointer">
          <Image
                                                    src="/icons/cartico.svg"
                                                    alt="back"
                                                    className="mr-2 invert"
                                                    width={14}
                                                    height={14}
                                                  />
                                                                {t("cart")}
          </Link>
        </li>
        {/*<li>
          <Link href="/warehouse_management" className="flex items-center px-4 py-2 hover:bg-[#033d75] cursor-pointer">
          <Image
                                                    src="/icons/storageico.svg"
                                                    alt="back"
                                                    className="mr-2 invert"
                                                    width={14}
                                                    height={14}
                                                  />
               {t("manage_warehouse")}
          </Link>
        </li>*/}
        <li>
          <Link href="/dashboard/remoteAssistance" className="flex items-center px-4 py-2 hover:bg-[#033d75] cursor-pointer">
          <Image
                                                    src="/icons/remoteassico.svg"
                                                    alt="back"
                                                    className="mr-2 invert"
                                                    width={14}
                                                    height={14}
                                                  />            {t("remote_assistance")}
          </Link>
        </li>
        <li>
          <Link href="/dashboard/settings" className="flex items-center px-4 py-2 hover:bg-[#033d75] cursor-pointer">
          <Image
                                                    src="/icons/settingsico.svg"
                                                    alt="back"
                                                    className="mr-2 invert"
                                                    width={14}
                                                    height={14}
                                                  />              {t("settings")}
          </Link>
        </li>

        {user?.type == "Comando" &&
          <li>
            <Link href="/dashboard/overview" className="flex items-center px-4 py-2 hover:bg-[#033d75] cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="#ffffff" width={"14px"} height={"14px"} viewBox="0 0 512 512"><path d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm320 96c0-26.9-16.5-49.9-40-59.3L280 88c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 204.7c-23.5 9.5-40 32.5-40 59.3c0 35.3 28.7 64 64 64s64-28.7 64-64zM144 176a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm-16 80a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm288 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM400 144a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg>             
                &nbsp; &nbsp; Overview
            </Link>
          </li>
        }

        <li >
          <div className="px-4 py-2">
            <p className="text-[#aeaeae] text-[12px]">FE: 1.0.0</p>
            <p className="text-[#aeaeae] text-[12px]">BE: {BEVersion.version}</p>
            <Link href="/logpage"className="text-[#aeaeae] text-[12px]">Log page</Link>
          </div>
        </li>
      </ul>
    </div>
  );
}


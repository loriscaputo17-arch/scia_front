"use client";

import { useEffect, useState } from "react";
import InfoCard from "@/components/profile/InfoCard";
import Link from "next/link";
import Image from 'next/image';
import { useTranslation } from "@/app/i18n";
import { loginCareAr } from "@/api/assistance";

export default function RemoteAssistance() {

    const { t, i18n } = useTranslation("remote_assistance");
    const [mounted, setMounted] = useState(false);

    const handleButtonStartDevice = async () => {
      try {
        const email = "tuo@email.it";
        const password = "tuapassword";
        const result = await loginCareAr({ email, password });
        
      } catch (error) {
        console.error("Errore login:", error);
      }
    }; 

    const handleButtonStartViewer = () => {
    
    };

    useEffect(() => {
      setMounted(true);
    }, []);
      
    if (!mounted || !i18n.isInitialized) return null;
    
  return (
    <div className="flex flex-col text-white">
      <div className="flex gap-4">
        <div className="w-full space-y-4 bg-[#022A52] py-4 px-6 rounded-md">
            <div className="text-center justify-center py-24">
                <div className="w-[fit-content] ml-auto mr-auto">
                    <Image 
                        src="/icons/assistance_icon.png"
                        alt="Logout"
                        width={100} 
                        height={100}
                        className=""
                    />
                </div>

                    <p className="w-70 ml-auto mr-auto my-6">{t("remote_assistance_title")}</p>

                    <div className="w-[fit-content] sm:flex block items-center gap-6 ml-auto mr-auto">
                        <button
                            type="submit"
                            onClick={() => handleButtonStartDevice()}
                            className={`rounded-sm mt-6 w-70 bg-[#ffffff10] hover:bg-blue-500 text-white font-bold py-4 px-4 transition duration-200 cursor-pointer`}>
                              {t("remote_assistance_button1")}
                        </button>
                        <button
                            type="submit"
                            onClick={() => handleButtonStartViewer()}
                            className={`rounded-sm mt-6 w-70 bg-[#789fd6] hover:bg-blue-500 text-white font-bold py-4 px-4 transition duration-200 cursor-pointer`}>
                              {t("remote_assistance_button2")}
                        </button>
                    </div>
            </div>
        </div>
      </div>
    </div>
  );
}
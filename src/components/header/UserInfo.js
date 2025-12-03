"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProfileData, getRanks } from "@/api/profile";
import { useTranslation } from "@/app/i18n";
import Image from "next/image";

export default function UserInfo() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [militaryRanks, setMilitaryRanks] = useState([]);
  const [userRank, setUserRank] = useState(null);

  const { t, i18n } = useTranslation("header");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
      setMounted(true);
    }, []);

  useEffect(() => {
      async function loadData() {
        const result = await getProfileData();
        setUser(result);
      }
      loadData();
    }, []);

    const [profileImage, setProfileImage] = useState("/icons/profile-default.svg");

    useEffect(() => {
      if (user?.profileImage) {
        
        setProfileImage(user.profileImage);
      }
    }, [user]);

    useEffect(() => {
      async function fetchRanks() {
        const ranks = await getRanks();
        setMilitaryRanks(ranks);
      }
      fetchRanks();
    }, []);
  
    useEffect(() => {
      if (user && militaryRanks.length > 0) {
        const foundRank = militaryRanks.find((r) => r.id === Number(user.rank));
        setUserRank(foundRank);
      }
    }, [user, militaryRanks]);

    const translateRank = (rank) => {
      const key = `${rank}`; 
      const translated = t(key);

      // se i18n non trova la traduzione, fallback al testo originale
      return translated === key ? rank : translated;
    };

  if (!mounted || !i18n.isInitialized) return null;

  return (
    <div
      className="flex items-center gap-4 p-3 rounded-lg cursor-pointer transition"
      onClick={() => router.push("/dashboard/profile")}
    >
      <Image
          src={profileImage || "/icons/profile-default.svg"}
          alt="Profile Picture"
          width={40}
          height={40}
          className="w-14 h-14 rounded-full object-cover"
        /> 

      <div className="overflow-hidden hidden sm:block">
        {user ? (
          <> 
           <p className="text-sm text-[#789fd6]">

            {userRank ? (
              translateRank(userRank.grado).length > 25
                ? translateRank(userRank.grado).substring(0, 25) + "..."
                : translateRank(userRank.grado)
            ) : (
              t("rankNotFound")
            )}
          </p>
            <p className="text-lg font-semibold whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[150px] sm:max-w-[200px]">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-sm text-[#ffffffa6] whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[150px] sm:max-w-[200px] capitalize">
              {t(`${user.type}`)}
            </p>

          </>
        ) : (
          <p className="text-white text-sm">{t("not_logged")}</p>
        )}
      </div>
    </div>
  );
}


  
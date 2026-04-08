"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { usePathname } from "next/navigation";

export default function AlghoWidget() {
  const { user } = useUser();
  const pathname = usePathname();

  const hiddenPaths = [
    "/login",
    "/login-pin", 
    "/forgot-password",
    "/reset-password",
  ];

  const isHidden = hiddenPaths.includes(pathname);

  useEffect(() => {
    // Aspetta che user sia disponibile
    if (isHidden || !user) return;

    const lang = localStorage.getItem("i18nextLng") || "it";

    const botId =
      lang === "it" ? user.botIds?.ita :
      lang === "es" ? user.botIds?.esp :
      user.botIds?.ing;
    if (!botId) return;


    // Evita duplicati
    if (document.getElementById("algho-viewer-module")) return;

    const tag = document.createElement("algho-viewer");
    tag.setAttribute("bot-id", botId);
    tag.setAttribute("widget", "true");
    tag.setAttribute("audio", "true");
    tag.setAttribute("voice", "true");
    tag.setAttribute("open", "false");
    tag.setAttribute("z-index", "9999");
    document.body.appendChild(tag);

    const script = document.createElement("script");
    script.setAttribute("id", "algho-viewer-module");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("defer", "defer");
    script.setAttribute("charset", "UTF-8");
    script.setAttribute("src", "https://virtualassistant.alghoncloud.com/algho-viewer.min.js");
    document.body.appendChild(script);

  }, [user, isHidden]); // ← dipende da user, si riesegue quando arriva

  return null;
}
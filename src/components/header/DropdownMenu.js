"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/app/i18n";
import { getAPIbackend } from "@/api/profile";
import { useUser } from "@/context/UserContext";

const NAVY = "#022a52";
const ACCENT = "#789fd6";

export default function DropdownMenu({ isOpen, onClose }) {
  const menuRef = useRef(null);
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

  // chiudi anche con ESC
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    getAPIbackend().then((data) => setBEVersion(data || []));
  }, []);

  useEffect(() => { setMounted(true); }, []);

  if (!isOpen || !mounted || !i18n.isInitialized) return null;

  // voce di menu riutilizzabile
  const MenuItem = ({ href, icon, label }) => (
    <li>
      <Link
        href={href}
        onClick={onClose}
        className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[#022a52] transition-colors hover:bg-[#789fd6]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#789fd6]/40"
      >
        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#022a52]/5 transition-colors group-hover:bg-[#789fd6]/15">
          {icon}
        </span>
        <span className="text-sm font-medium">{label}</span>
      </Link>
    </li>
  );

  return (
    <div
      ref={menuRef}
      role="menu"
      className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-[#022a52]/10 bg-white shadow-xl shadow-[#022a52]/10"
    >
      {/* intestazione */}
      <div className="flex items-center justify-between bg-gradient-to-r from-[#022a52] to-[#0a3a6b] px-4 py-3">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Menu</span>
        {user?.type === "Comando" && (
          <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium text-white">Comando</span>
        )}
      </div>

      {/* voci */}
      <ul className="px-2 py-2">
        <MenuItem
          href="/dashboard"
          label="Dashboard"
          icon={<Image src="/icons/homeico.svg" alt="" width={15} height={15} />}
        />
        <MenuItem
          href="/dashboard/impianti"
          label={t("facilities")}
          icon={<Image src="/icons/facilitiesico.svg" alt="" width={15} height={15} />}
        />
        <MenuItem
          href="/dashboard/cart"
          label={t("cart")}
          icon={<Image src="/icons/cartico.svg" alt="" width={15} height={15} />}
        />
        <MenuItem
          href="/dashboard/remoteAssistance"
          label={t("remote_assistance")}
          icon={<Image src="/icons/remoteassico.svg" alt="" width={15} height={15} />}
        />
        <MenuItem
          href="/dashboard/settings"
          label={t("settings")}
          icon={<Image src="/icons/settingsico.svg" alt="" width={15} height={15} />}
        />
        {user?.type === "Comando" && (
          <MenuItem
            href="/dashboard/overview"
            label="Overview"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill={NAVY} width="14" height="14" viewBox="0 0 512 512">
                <path d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm320 96c0-26.9-16.5-49.9-40-59.3L280 88c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 204.7c-23.5 9.5-40 32.5-40 59.3c0 35.3 28.7 64 64 64s64-28.7 64-64zM144 176a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm-16 80a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm288 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM400 144a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" />
              </svg>
            }
          />
        )}
      </ul>

      {/* CREDITS / CERTIFICAZIONI */}
      <div className="border-t border-[#022a52]/10 bg-[#f6f8fb] px-4 py-3">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#022a52]/40">
          Certificazioni
        </p>
        <div className="flex items-center justify-center gap-4">
          <div className="flex flex-col items-center gap-1">
            <Image
              src="/logos/rina_logo.png"
              alt="RINA"
              width={90}
              height={50}
              className="h-12 w-auto object-contain"
            />
            <span className="text-[9px] leading-none text-[#022a52]/50">Type Approval</span>
          </div>
          <div className="h-8 w-px bg-[#022a52]/10" />
          <div className="flex flex-col items-center gap-1">
            <Image
              src="/logos/abs.svg"
              alt="ABS"
              width={72}
              height={32}
              className="h-18 w-auto object-contain"
            />
            <span className="text-[9px] leading-none text-[#022a52]/50">PDA</span>
          </div>
        </div>
      </div>

      {/* versione */}
      <div className="flex items-center justify-between border-t border-[#022a52]/10 px-4 py-2.5 text-[11px] text-[#022a52]/40">
        <span>FE 1.0.0 · BE {BEVersion.version}</span>
        <Link href="/logpage" onClick={onClose} className="transition-colors hover:text-[#789fd6]">
          Log
        </Link>
      </div>
    </div>
  );
}
"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import { useTranslation } from "@/app/i18n";
import { useEffect, useState } from "react";
import { fetchMaintenanceJob } from "@/api/maintenance";
import { useUser } from "@/context/UserContext";

export default function Breadcrumbs({ title, position }) {
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);
  const lastSegment = paths.at(-1);
  const { selectedShipId: shipId } = useUser();

  const [label, setLabel] = useState(null);
  const { t } = useTranslation("breadcrumbs");

  const isNumeric = (value) => /^\d+$/.test(value);

  // 🔹 Fetch nome leggibile se l'ultimo segmento è un ID numerico
  useEffect(() => {
    if (!isNumeric(lastSegment)) return;

    fetchMaintenanceJob(lastSegment, shipId).then((result) => {
      if (result) setLabel(result[0]?.maintenance_list?.name);
    });
  }, [lastSegment]);

  const capitalize = (string) =>
    string
      .replace(/%20/g, " ")
      .toLowerCase()
      .replace(/^\w/, (c) => c.toUpperCase());

  useEffect(() => {
    if (!isNumeric(lastSegment)) return;

    fetchMaintenanceJob(lastSegment, shipId).then((result) => {
      const name = result?.[0]?.maintenance_list?.name;
      if (name) {
        setLabel(
          name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
        );
      }
    });
  }, [lastSegment]);

  const getLabel = (segment) => {
    const finalLabel = segment === lastSegment && label ? label : segment;
    const translated = t(finalLabel.toLowerCase());

    if (translated === finalLabel.toLowerCase()) {
      return capitalize(finalLabel);
    }

    // Capitalizza anche le traduzioni
    return translated.charAt(0).toUpperCase() + translated.slice(1).toLowerCase();
  };

  return (
    <nav className="text-sm text-gray-300">
      <ul className="flex gap-2">
        {paths.map((path, index) => (
          <li key={index} className="flex items-center">
            {index === 0 && (
              <Image 
                src="/icons/breadcrumbHome.svg"
                alt={t("home")}
                width={16}
                height={16}
                className="mr-2"
              />
            )}

            <span className="text-white">
              {index === paths.length - 1 && position === "last"
                ? label || title || getLabel(path)
                : getLabel(path)}
            </span>

            {index < paths.length - 1 && <span className="mx-2">›</span>}
          </li>
        ))}
      </ul>
    </nav>
  );
}

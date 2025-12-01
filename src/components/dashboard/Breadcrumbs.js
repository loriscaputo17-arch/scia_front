"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import { useTranslation } from "@/app/i18n";
import { useEffect, useState } from "react";
import { fetchMaintenanceJob } from "@/api/maintenance";

export default function Breadcrumbs({ title, position }) {
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);
  const lastSegment = paths.at(-1);

  const [label, setLabel] = useState(null);
  const { t } = useTranslation("breadcrumbs");

  const isNumeric = (value) => /^\d+$/.test(value);

  // 🔹 Fetch nome leggibile se l'ultimo segmento è un ID numerico
  useEffect(() => {
    if (!isNumeric(lastSegment)) return;

    fetchMaintenanceJob(lastSegment).then((result) => {
      if (result) setLabel(result[0]?.maintenance_list?.name);
    });
  }, [lastSegment]);

  const capitalize = (string) =>
    string.replace(/%20/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const getLabel = (segment) => {
    const finalLabel = segment === lastSegment && label ? label : segment;

    const translated = t(finalLabel.toLowerCase());

    // Se NON esiste traduzione → capitalizza
    return translated === finalLabel.toLowerCase()
      ? capitalize(finalLabel)
      : translated;
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

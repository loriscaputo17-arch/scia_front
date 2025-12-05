// useSafeTranslation.js
"use client";
import { useTranslation } from "@/app/i18n";

export function useSafeTranslation(ns) {
  const result = useTranslation(ns);

  // Non far cambiare ordine agli hook nel componente chiamante
  const ready =
    typeof window === "undefined" ? true : result?.i18n?.isInitialized;

  return { ...result, ready };
}

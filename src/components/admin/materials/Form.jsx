"use client";

import Input from "@/components/admin/materials/Input";
import CountrySelect from "@/components/admin/materials/CountrySelect";
import AddressForm from "@/components/admin/materials/AddressForm";
import { useEffect } from "react";

export default function Form({
  data,
  onChange,
  hasNCAGE,
  setHasNCAGE,
}) {
  const handleField = (field, value) => {
    onChange((prev) => ({ ...prev, [field]: value }));
  };

  // Precompilazione da NCAGE
  useEffect(() => {
    if (hasNCAGE && data.organizationCompanyNCAGE) {
      const nc = data.organizationCompanyNCAGE;

      onChange((prev) => ({
        ...prev,
        country: prev.country || nc.Country || "",
        address: prev.address || nc.Street_Line_1 || "",
        city: prev.city || nc.City || "",
        postalCode: prev.postalCode || nc.Postal_code || "",
      }));
    }
  }, [hasNCAGE]);

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-900">Dati Cantiere</h4>

      <Input
        label="Nome Azienda"
        value={data.companyName}
        onChange={(v) => handleField("companyName", v)}
      />

      <CountrySelect
        value={data.country}
        onChange={(v) => handleField("country", v)}
      />

      <AddressForm
        address={data.address}
        city={data.city}
        postalCode={data.postalCode}
        onChange={onChange}
      />

      <div className="flex items-center gap-3 pt-2">
        <input
          type="checkbox"
          checked={hasNCAGE}
          onChange={(e) => setHasNCAGE(e.target.checked)}
          className="accent-blue-600"
        />
        <span className="text-sm font-medium text-gray-900">
          Associa codice NCAGE
        </span>
      </div>
    </div>
  );
}

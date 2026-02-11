"use client";

import Input from "@/components/admin/materials/Input";
import Select from "@/components/admin/materials/Select";
import { COUNTRIES } from "@/constants/countries";

export default function OwnerForm({ data, onChange, hasNCAGE, setHasNCAGE }) {
  const handleField = (field, value) => {
    onChange((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-900">Dati Owner</h4>

      <Input
        label="Nome Azienda"
        value={data.companyName}
        onChange={(v) => handleField("companyName", v)}
      />

      <Input
        label="Organizzazione"
        value={data.Organisation_name}
        onChange={(v) => handleField("Organisation_name", v)}
      />

      <Input
        label="Indirizzo"
        value={data.address}
        onChange={(v) => handleField("address", v)}
      />

      <Select
        label="Paese"
        value={data.country}
        onChange={(v) => handleField("country", v)}
        options={COUNTRIES}
      />

      <Select
        label="Forze Armate"
        value={data.armedForces}
        onChange={(v) => handleField("armedForces", v)}
        options={["Sì", "No"]}
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

"use client";

import Input from "@/components/admin/materials/Input";
import Select from "@/components/admin/materials/Select";
import { COUNTRIES } from "@/constants/countries";

export default function ProducerForm({ data, onChange, hasNCAGE, setHasNCAGE }) {
  const updateField = (field, value) => {
    onChange((prev) => ({
      ...prev,
      [field]: value ?? "",
    }));
  };

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-900">
        Dati Organizzazione
      </h4>

      {/* 🔹 ORGANIZATION NAME */}
      <Input
        label="Nome Azienda"
        value={data.Organization_name ?? ""}
        onChange={(v) => updateField("Organization_name", v)}
        placeholder="Es. SCIA SRL"
      />

      {/* 🔹 CITY */}
      <Input
        label="Città"
        value={data.City ?? ""}
        onChange={(v) => updateField("City", v)}
        placeholder="Es. Milano"
      />

      {/* 🔹 COUNTRY */}
      <Select
        label="Paese"
        value={data.Country ?? ""}
        onChange={(v) =>
          updateField("Country", typeof v === "string" ? v : v?.value)
        }
        options={COUNTRIES}
      />

      {/* 🔹 STREET */}
      <Input
        label="Indirizzo"
        value={data.Street_Line_1 ?? ""}
        onChange={(v) => updateField("Street_Line_1", v)}
        placeholder="Via Roma 10"
      />

      {/* 🔹 POSTAL CODE */}
      <Input
        label="CAP"
        value={data.Postal_code ?? ""}
        onChange={(v) => updateField("Postal_code", v)}
        placeholder="20100"
      />

      {/* 🔹 ARM FORCES */}
      <Select
        label="Forze Armate"
        value={data.armedForces ?? ""}
        onChange={(v) => updateField("armedForces", v)}
        options={["Sì", "No"]}
      />

      {/* 🔹 TOGGLE NCAGE */}
      <div className="flex items-center gap-3 pt-4">
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

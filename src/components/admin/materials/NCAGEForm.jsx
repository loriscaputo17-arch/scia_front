"use client";

import Input from "@/components/admin/materials/Input";

export default function NCAGEForm({ data, onChange }) {
  if (!data) return null;

  const handleField = (field, value) => {
    onChange((prev) => ({
      ...prev,
      [field]: value ?? "",
    }));
  };

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-900">
        Dati NCAGE
      </h4>

      <Input
        label="NCAGE Code"
        value={data.NCAGE_Code ?? ""}
        onChange={(v) => handleField("NCAGE_Code", v)}
      />

      <Input
        label="Organization Name"
        value={data.Organization_name ?? ""}
        onChange={(v) => handleField("Organization_name", v)}
      />

      <Input
        label="Country"
        value={data.Country ?? ""}
        onChange={(v) => handleField("Country", v)}
      />

      <Input
        label="City"
        value={data.City ?? ""}
        onChange={(v) => handleField("City", v)}
      />

      <Input
        label="Status"
        value={data.Status ?? ""}
        onChange={(v) => handleField("Status", v)}
      />

      <Input
        label="Street Line 1"
        value={data.Street_Line_1 ?? ""}
        onChange={(v) => handleField("Street_Line_1", v)}
      />

      <Input
        label="Street Line 2"
        value={data.Street_Line_2 ?? ""}
        onChange={(v) => handleField("Street_Line_2", v)}
      />

      <Input
        label="Postal Code"
        value={data.Postal_code ?? ""}
        onChange={(v) => handleField("Postal_code", v)}
      />

      <Input
        label="Website"
        value={data.Website ?? ""}
        onChange={(v) => handleField("Website", v)}
      />

      <Input
        label="Phone Number"
        value={data.Phone_number ?? ""}
        onChange={(v) => handleField("Phone_number", v)}
      />

      <Input
        label="Fax Number"
        value={data.Fax_number ?? ""}
        onChange={(v) => handleField("Fax_number", v)}
      />
    </div>
  );
}

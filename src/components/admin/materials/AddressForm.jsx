"use client";

import Input from "./Input";

export default function AddressForm({ address, city, postalCode, onChange }) {
  const update = (field, value) => {
    onChange((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-3">
      <Input
        label="Via / Indirizzo"
        value={address}
        onChange={(v) => update("address", v)}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Città"
          value={city}
          onChange={(v) => update("city", v)}
        />

        <Input
          label="CAP"
          value={postalCode}
          onChange={(v) => update("postalCode", v)}
        />
      </div>
    </div>
  );
}

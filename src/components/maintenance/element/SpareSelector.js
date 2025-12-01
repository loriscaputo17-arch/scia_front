"use client";

import { useState } from "react";

export default function SpareSelector({ spares = [], onSelectChange }) {
  const [selected, setSelected] = useState([]);

  const toggleSelect = (item) => {
    const alreadySelected = selected.some((s) => s.ID === item.ID);
    const updated = alreadySelected
      ? selected.filter((s) => s.ID !== item.ID)
      : [...selected, item];

    setSelected(updated);
    onSelectChange(updated.map((s) => s.ID)); 
  };

  return (
    <div
      className="flex gap-4 overflow-x-auto mt-3 pb-3"
      style={{ scrollSnapType: "x mandatory" }}
    >
      {spares.map((spare) => {
        const isSelected = selected.some((s) => s.ID === spare.ID);

        return (
          <div
            key={spare.ID}
            onClick={() => toggleSelect(spare)}
            className={`min-w-[160px] cursor-pointer p-3 rounded-md border transition scroll-snap-align-start
              ${isSelected ? "border-[#789fd6] bg-[#ffffff1a]" : "border-[#ffffff20] bg-[#00000020]"}
            `}
          >

            <p className="text-white text-sm font-semibold truncate">
              {spare.Part_name}
            </p>

            <p className="text-[#63c7ff] text-xs mt-1">
              Qty: {spare.quantity || 0}
            </p>
          </div>
        );
      })}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/app/i18n";

export default function MoveProductTable({ data, scanning, setScanning, onDataChange, setActiveField }) {
  const initialLocations = (
    Array.isArray(data.locationData)
      ? data.locationData
      : data.locationData ? [data.locationData] : []
  ).filter(Boolean);

  const quantityList = typeof data.quantity === "string"
    ? data.quantity.split(",").map((q) => parseFloat(q.trim()))
    : [data.quantity];

  const [locations, setLocations] = useState(() => {
    // se non esistono ubicazioni, parti con UNA riga vuota per lo spostamento
    if (!initialLocations.length) {
      return [{
        warehouse: data?.warehouse || "",
        location: "",
        quantity: quantityList[0] ?? 0,
        stock: "",
        newLocation: "",
      }];
    }
    return initialLocations.map((location, index) => ({
      ...location,
      location: typeof location.location === "object" ? location.location?.location : location.location,
      quantity: quantityList[index] ?? 0,
    }));
  });

  const handleChange = (index, field, value) => {
    const updatedLocations = [...locations];
    const updatedLocation = { ...updatedLocations[index] };

    if (field === "stock") {
      const stockValue = /^\d*$/.test(value) ? parseInt(value, 10) : 0;
      updatedLocation[field] = stockValue;

      if (value === "" || value === null) {
        updatedLocation.quantity = quantityList[index] ?? 0;
      } else {
        const quantityLocation = updatedLocation.quantity || quantityList[index];
        updatedLocation.quantity = quantityLocation - stockValue;
      }

      updatedLocations[index] = updatedLocation;
    } else {
      updatedLocation[field] = value;
      updatedLocations[index] = updatedLocation;
    }

    setLocations(updatedLocations);
  };

  useEffect(() => {
    onDataChange({
      ...data,
      locationData: locations,
    });
  }, [locations]);

  const { t, i18n } = useTranslation("maintenance");
  if (!i18n.isInitialized) return null;

  return (
    <div>
      {locations.map((row, index) => (
        <div key={index} className="grid sm:grid-cols-5 gap-4 items-center mb-4">
          {/* Magazzino */}
          <div>
            <label className="text-[14px] text-[#789fd6] block mb-2">{t("warehouse")}</label>
            <input
              value={row.warehouse || data?.warehouseData?.name || ""}
              disabled
              className="bg-transparent border border-gray-400 focus:border-[#e2d52d] focus:outline-none rounded px-3 py-2 w-full"
            />
          </div>

          {/* Ubicazione attuale */}
          <div>
            <label className="text-[14px] text-[#789fd6] block mb-2">{t("current_location")}</label>
            <div className="flex items-center gap-2 relative">
              <input
                value={row.location || ""}
                onChange={(e) => handleChange(index, "location", e.target.value)}
                className="bg-transparent border border-gray-400 focus:border-[#e2d52d] focus:outline-none rounded px-3 py-2 w-full"
              />
              <span className="text-white absolute cursor-pointer" style={{ right: "10%" }} onClick={() => setScanning(true)}>
                {/* icona scanner */}
              </span>
            </div>
          </div>

          {/* Quantità */}
          <div>
            <label className="text-[14px] text-[#789fd6] block mb-2">{t("quantity")}</label>
            <input
              value={row.quantity}
              onFocus={() => setActiveField("")}
              onChange={(e) => handleChange(index, "quantity", e.target.value)}
              className="bg-transparent border border-gray-400 focus:border-[#e2d52d] focus:outline-none rounded px-3 py-2 w-full"
            />
          </div>

          {/* Stock */}
          <div>
            <label className="text-[14px] text-[#789fd6] block mb-2">Stock</label>
            <input
              value={row.stock || ""}
              onFocus={() => setActiveField("stock")}
              onChange={(e) => handleChange(index, "stock", e.target.value)}
              className="bg-transparent border border-gray-400 focus:border-[#e2d52d] focus:outline-none rounded px-3 py-2 w-full"
            />
          </div>

          <div>
            <label className="text-[14px] text-[#789fd6] block mb-2">{t("new_location")}</label>
            <input
              type="text"
              value={row.newLocation || ""}
              onFocus={() => setActiveField("newLocation")}
              onChange={(e) => handleChange(index, "newLocation", e.target.value)}
              className="bg-transparent border border-gray-400 focus:border-[#e2d52d] focus:outline-none rounded px-3 py-2 w-full"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

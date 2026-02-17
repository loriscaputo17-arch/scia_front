"use client";

import { useState } from "react";

type Column<T> = {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
};

type GenericTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchFn: (row: T, search: string) => boolean;
  EditModal?: React.ComponentType<{
    item: T;
    onSave: (item: T) => void;
    onCancel: () => void;
  }>;
  onUpdate?: (item: T) => void;
  emptyLabel?: string;
};

export default function GenericTable<T>({
  data,
  columns,
  searchPlaceholder = "Cerca...",
  searchFn,
  EditModal,
  onUpdate,
  emptyLabel = "Nessun risultato trovato",
}: GenericTableProps<T>) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<T | null>(null);

  const filtered = data.filter((row) => searchFn(row, search));

  const handleSave = (updated: T) => {
    onUpdate?.(updated);
    setSelected(null);
  };

  return (
    <div className="space-y-4">
      {/* 🔎 Search */}
      <div className="bg-white shadow-md rounded-xl p-4 border border-gray-100">
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border text-black border-gray-200 rounded-lg px-4 py-2 text-sm w-full sm:w-80"
        />
      </div>

      {/* 📋 Table */}
      <div className="overflow-x-auto bg-gray-50 shadow-xl rounded-xl">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100 text-gray-600 uppercase text-sm font-semibold">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-6 py-4 text-left">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="text-sm text-gray-700">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-6 text-gray-400"
                >
                  {emptyLabel}
                </td>
              </tr>
            ) : (
              filtered.map((row, idx) => (
                <tr
                  key={idx}
                  onClick={() => EditModal && setSelected(row)}
                  className={`cursor-pointer hover:bg-blue-50 ${
                    idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4">
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🧱 Edit Modal */}
      {EditModal && selected && (
        <EditModal
          item={selected}
          onSave={handleSave}
          onCancel={() => setSelected(null)}
        />
      )}
    </div>
  );
}

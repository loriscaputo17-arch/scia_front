"use client";

export default function ProjectsFilters({ filters, setFilters }) {
  const inputClass =
    "px-3 py-2 rounded-full bg-gray-50 text-gray-900 border border-gray-300 placeholder-gray-400 text-sm transition-all duration-200 hover:bg-gray-100 focus:outline-none";

  return (
    <div className="flex flex-wrap gap-3 mb-6 w-full">
      {/* 🔍 Nome commessa */}
      
      <div className="bg-white shadow-md w-full rounded-xl p-4 flex flex-wrap gap-3 items-center border border-gray-100">
        <input
          type="text"
          placeholder="Cerca per nome commessa..."
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-200 focus:outline-none w-full sm:w-64"
        />
      </div>
    </div>
  );
}

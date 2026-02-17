"use client";

export default function MaintenancesTable({ projects, onRowClick }) {
  return (
<div className="overflow-x-auto bg-gray-50 shadow-xl rounded-xl relative">
      <table className="min-w-full rounded-xl divide-y divide-gray-200">
        <thead className="bg-gray-100 text-gray-600 uppercase text-sm font-semibold tracking-wide">
          <tr>
            <th className="px-6 py-4 text-left rounded-tl-lg">ID</th>
            <th className="px-6 py-4 text-left">Manutenzione</th>
            <th className="px-6 py-4 text-left">Responsabile</th>
            <th className="px-6 py-4 text-left">Data Inizio</th>
            <th className="px-6 py-4 text-left">Data Fine</th>
            <th className="px-6 py-4 text-left rounded-tr-lg">Stato</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 text-sm">
          {projects?.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-6 text-gray-400">
                Nessuna commessa trovata
              </td>
            </tr>
          ) : (
            projects?.map((c, idx) => (
              <tr
                key={c.id}
                onClick={() => onRowClick?.(c)}
                className={`transition-all duration-300 transform hover:bg-blue-50 hover:shadow-lg cursor-pointer ${
                  idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <td className="px-6 py-4">{c.id}</td>
                <td className="px-6 py-4">{c.name}</td>
                <td className="px-6 py-4">{c.manager}</td>
                <td className="px-6 py-4">{c.startDate}</td>
                <td className="px-6 py-4">{c.endDate}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                      c.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {c.active ? "Attiva" : "Inattiva"}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

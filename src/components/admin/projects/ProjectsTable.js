"use client";

import { useRouter } from "next/navigation";

export default function ProjectsTable({ projects }) {
  const router = useRouter();

  return (
    <div className="overflow-x-auto bg-gray-50 shadow-xl rounded-xl relative">
      <table className="min-w-full rounded-xl divide-y divide-gray-200">
        <thead className="bg-gray-100 text-gray-600 uppercase text-sm font-semibold tracking-wide">
          <tr>
            <th className="px-6 py-4 text-left">ID</th>
            <th className="px-6 py-4 text-left">Nome Commesa</th>
            <th className="px-6 py-4 text-left">Descrizione</th>
            <th className="px-6 py-4 text-left">Stato</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 text-sm">
          {projects.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-6 text-gray-400">
                Nessuna commessa trovata
              </td>
            </tr>
          ) : (
            projects.map((proj, idx) => (
              <tr
                key={proj.id}
                onClick={() => router.push(`/admin/projects/${proj.id}`)}
                className={`transition-all duration-300 transform hover:bg-blue-50 hover:shadow-lg cursor-pointer ${
                  idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <td className="px-6 py-4">{proj.id}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{proj.name}</td>
                <td className="px-6 py-4">{proj.description || "-"}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                      proj.active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {proj.active ? "Attiva" : "Disattiva"}
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

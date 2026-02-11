"use client";

import { useState } from "react";
import EditTeamModal from "@/components/admin/teams/EditTeamModal";

export default function TeamsTable({ teams, onTeamUpdated }) {
  const [selectedTeam, setSelectedTeam] = useState(null);

  const handleRowClick = (team) => {
    setSelectedTeam(team);
  };

  const handleSave = (updated) => {
    setSelectedTeam(null);
    if (onTeamUpdated) onTeamUpdated(updated);
  };

  const displayedTeams = teams.slice(0, 5);

  return (
    <div className="overflow-x-auto bg-gray-50 shadow-xl rounded-xl relative">
      <table className="min-w-full rounded-xl divide-y divide-gray-200">
        <thead className="bg-gray-100 text-gray-600 uppercase text-sm font-semibold tracking-wide">
          <tr>
            <th className="px-6 py-4 text-left rounded-tl-xl">ID</th>
            <th className="px-6 py-4 text-left">Nome</th>
            <th className="px-6 py-4 text-left">Leader</th>
            <th className="px-6 py-4 text-left">Email</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 text-sm">
          {displayedTeams.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-6 text-gray-400">
                Nessuna squadra trovata
              </td>
            </tr>
          ) : (
            displayedTeams.map((team, idx) => (
              <tr
                key={team.id}
                onClick={() => handleRowClick(team)}
                className={`transition-all duration-300 hover:bg-blue-50 cursor-pointer ${
                  idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <td className="px-6 py-4">{team.id}</td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {team.name}
                </td>
                <td className="px-6 py-4">{team.leader.first_name} {team.leader.last_name}</td>
                <td className="px-6 py-4">{team.leader.login.email}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {selectedTeam && (
        <EditTeamModal
          team={selectedTeam}
          onCancel={() => setSelectedTeam(null)}
          onSave={handleSave}
        />
      )}


      {/* 🔹 Mostra un messaggio se ci sono altri utenti */}
      {teams.length > 5 && (
        <div className="text-center py-3 text-gray-500 text-sm italic">
          Mostrati solo i primi 5 team
        </div>
      )}
    </div>
  );
}

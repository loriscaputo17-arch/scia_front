"use client";

import { useEffect, useState } from "react";
import { getTeams } from "@/api/admin/teams";
import TeamsTable from "@/components/admin/teams/TeamsTable";
import TeamsFilters from "@/components/admin/teams/TeamsFilters";
import AddTeamsButton from "@/components/admin/teams/AddTeamsButton";
import AddTeamsModal from "@/components/admin/teams/AddTeamsModal";

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    role: "",
    status: "",
  });
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const data = await getTeams();
        setTeams(data);
      } catch (err) {
        console.error("Errore nel fetch squadre:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

const filteredTeams = teams.filter((team) => {
  const search = filters.search.toLowerCase();

  const matchSearch =
    !search ||
    team.name.toLowerCase().includes(search) ||
    team.leader?.first_name?.toLowerCase().includes(search) ||
    team.leader?.last_name?.toLowerCase().includes(search) ||
    team.leader?.login?.email?.toLowerCase().includes(search);

  const matchRole =
    !filters.role ||
    (team.role && team.role.toLowerCase() === filters.role.toLowerCase());

  const matchStatus =
    !filters.status ||
    (filters.status === "attivo" ? team.active : !team.active);

  return matchSearch && matchRole && matchStatus;
});


  return (
    <div>
      <h2 className="text-3xl font-semibold mb-6 text-gray-900">Gestione Squadre</h2>

      <TeamsFilters filters={filters} setFilters={setFilters} />

      {loading ? (
        <p className="text-gray-500">Caricamento squadre...</p>
      ) : (
        <TeamsTable teams={filteredTeams} />
      )}

      <AddTeamsButton onClick={() => setModalOpen(true)} />

      {modalOpen && <AddTeamsModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}

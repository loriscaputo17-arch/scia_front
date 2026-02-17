"use client";

import { useState, useEffect } from "react";
import { X, Plus, Save, Settings } from "lucide-react";
import { getUsers } from "@/api/admin/users";
import { createTeams } from "@/api/admin/teams";

export default function AddTeamsModal({ onClose }) {
  const [teams, setTeams] = useState([
    { name: "", leader_id: "", leader_email: "" },
  ]);
  const [activeTab, setActiveTab] = useState(0);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  /* 🔹 Load users */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsers();
        setUsers(res);
      } catch (err) {
        console.error("Errore caricamento utenti:", err);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (index, field, value) => {
    setTeams((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleLeaderSelect = (index, userId) => {
    const user = users.find((u) => u.id === Number(userId));
    setTeams((prev) => {
      const updated = [...prev];
      updated[index].leader_id = userId;
      updated[index].leader_email = user?.email || "";
      return updated;
    });
  };

  const addTeam = () =>
    setTeams([...teams, { name: "", leader_id: "", leader_email: "" }]);

  const submitTeams = async () => {
    try {
      await createTeams(
        teams.map(t => ({
          name: t.name,
          leader_id: t.leader_id,
        }))
      );
      onClose();
      window.location.reload();
    } catch (err) {
      if (err.response?.status === 409) {
        alert(err.response.data.message);
      } else {
        alert("Errore durante la creazione delle squadre");
      }
    }
  };

  const removeTeam = (index) => {
    setTeams(teams.filter((_, i) => i !== index));
    setActiveTab((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const tabButton = (idx) => (
    <button
      key={idx}
      onClick={() => setActiveTab(idx)}
      className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
        activeTab === idx
          ? "bg-blue-100 text-blue-600 shadow"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <Settings size={16} />
      Squadra {idx + 1}
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-6 relative text-gray-900">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={22} />
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-gray-900">
          Aggiungi Nuove Squadre
        </h2>

        {/* Tabs */}
        <div className="flex gap-3 mb-6 border-b border-gray-200 pb-2 overflow-x-auto">
          {teams.map((_, idx) => tabButton(idx))}
        </div>

        {/* Content */}
        {teams.map(
          (team, idx) =>
            activeTab === idx && (
              <div key={idx} className="space-y-4">
                {/* Nome squadra */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nome Squadra
                  </label>
                  <input
                    type="text"
                    value={team.name}
                    onChange={(e) =>
                      handleChange(idx, "name", e.target.value)
                    }
                    className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
                  />
                </div>

                {/* Leader */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Leader Squadra
                  </label>
                  <select
                    value={team.leader_id}
                    onChange={(e) =>
                      handleLeaderSelect(idx, e.target.value)
                    }
                    disabled={loadingUsers}
                    className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none"
                  >
                    <option value="">
                      {loadingUsers
                        ? "Caricamento utenti..."
                        : "Seleziona leader"}
                    </option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.first_name} {u.last_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Email leader (auto) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email Leader
                  </label>
                  <input
                    type="email"
                    value={team.leader_email}
                    disabled
                    className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-100 text-gray-600"
                  />
                </div>

                {teams.length > 1 && (
                  <button
                    onClick={() => removeTeam(idx)}
                    className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-1"
                  >
                    <X size={14} /> Rimuovi Squadra
                  </button>
                )}
              </div>
            )
        )}

        {/* Actions */}
        <div className="flex justify-between mt-8">
          <button
            onClick={addTeam}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-blue-600 bg-blue-100 hover:bg-blue-200 transition"
          >
            Aggiungi Squadra
          </button>

          <button
            onClick={submitTeams}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition"
          >
            Salva Tutte
          </button>
        </div>
      </div>
    </div>
  );
}

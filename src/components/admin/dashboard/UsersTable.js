"use client";

import { useState } from "react";
import EditUserModal from "@/components/admin/users/EditUserModal"; 

export default function UsersTable({ users, onUserUpdated }) {
  const [selectedUser, setSelectedUser] = useState(null);

  const handleRowClick = (user) => {
    setSelectedUser(user);
  };

  const handleSave = (updatedUser) => {
    setSelectedUser(null);
    if (onUserUpdated) onUserUpdated(updatedUser);
  };

  // 🔹 Mostra solo i primi 5 utenti
  const displayedUsers = users.slice(0, 5);

  return (
    <div className="overflow-x-auto bg-gray-50 shadow-xl rounded-xl relative">
      <table className="min-w-full rounded-xl divide-y divide-gray-200">
        <thead className="bg-gray-100 text-gray-600 uppercase text-sm font-semibold tracking-wide">
          <tr>
            <th className="px-6 py-4 text-left">Nome</th>
            <th className="px-6 py-4 text-left">Cognome</th>
            <th className="px-6 py-4 text-left">Ruolo</th>
            <th className="px-6 py-4 text-left rounded-tr-lg">Stato</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 text-sm">
          {displayedUsers.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-6 text-gray-400">
                Nessun utente trovato
              </td>
            </tr>
          ) : (
            displayedUsers.map((user, idx) => (
              <tr
                key={user.id}
                onClick={() => handleRowClick(user)}
                className={`transition-all duration-300 transform hover:bg-blue-50 hover:shadow-lg cursor-pointer ${
                  idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <td className="px-6 py-4">{user.first_name}</td>
                <td className="px-6 py-4">{user.last_name}</td>
                <td className="px-6 py-4">{user.role || "-"}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                      user.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.active ? "Attivo" : "Disattivo"}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 👇 Modale di modifica utente */}
      {selectedUser && (
        <EditUserModal
          user={selectedUser}
          onCancel={() => setSelectedUser(null)}
          onSave={handleSave}
        />
      )}

      {/* 🔹 Mostra un messaggio se ci sono altri utenti */}
      {users.length > 5 && (
        <div className="text-center py-3 text-gray-500 text-sm italic">
          Mostrati solo i primi 5 utenti
        </div>
      )}
    </div>
  );
}

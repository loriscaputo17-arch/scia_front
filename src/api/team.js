// api/team.js  (aggiungi al tuo layer API frontend)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL_DEV;

const authHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
};

export async function createUser(payload) {
  const res = await fetch(`${BASE_URL}/api/team/createUser`, {
    method: "POST", headers: authHeaders(), body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Errore creazione utente");
  return data; // { userId, email, password }
}

export async function removeMember(teamId, userId) {
  const res = await fetch(`${BASE_URL}/api/team/${teamId}/member/${userId}`, {
    method: "DELETE", headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Errore rimozione membro");
  return res.json();
}

export async function assignRole(userId, roleType) {
  const res = await fetch(`${BASE_URL}/api/team/${userId}/role`, {
    method: "PUT", headers: authHeaders(), body: JSON.stringify({ roleType }),
  });
  if (!res.ok) throw new Error("Errore aggiornamento ruolo");
  return res.json();
}

export async function assignUserElements(userId, elements) {
  const res = await fetch(`${BASE_URL}/api/team/${userId}/elements`, {
    method: "PUT", headers: authHeaders(), body: JSON.stringify({ elements }),
  });
  if (!res.ok) throw new Error("Errore aggiornamento impianti");
  return res.json();
}

export async function getTeamModules(teamId, shipId) {
  const res = await fetch(`${BASE_URL}/api/team/${teamId}/${shipId}/modules`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Errore lettura moduli team");
  return res.json();
}

export async function setTeamModules(teamId, shipId, modules) {
  const res = await fetch(`${BASE_URL}/api/team/${teamId}/${shipId}/modules`, {
    method: "PUT", headers: authHeaders(), body: JSON.stringify({ modules }),
  });
  if (!res.ok) throw new Error("Errore salvataggio moduli team");
  return res.json();
}
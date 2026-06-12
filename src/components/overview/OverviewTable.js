"use client";

import { useState, useEffect } from "react";
import { getTeamUsers, updateUserElements } from "@/api/profile";
import {
  createUser, removeMember, assignRole,
  getTeamModules, setTeamModules,
} from "@/api/team";
import { useUser } from "@/context/UserContext";
import { useTranslation } from "@/app/i18n";

const ELEMENTS_OPTIONS = ["111", "221", "331", "441", "551", "661", "771", "881", "991"];

const ROLE_OPTIONS = [
  { value: "machine_maintainer", label: "Machine Maintainer" },
  { value: "chief_engineer",     label: "Chief Engineer" },
  { value: "comand",             label: "Comand" },
  { value: "admin",              label: "Admin" },
  { value: "owner",              label: "Owner" },
];

// ─── Modal: crea utente (password mostrata a schermo) ─────────────────────────
function CreateUserModal({ teamId, onClose, onCreated }) {
  const { t } = useTranslation("team");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [roleType, setRoleType] = useState("operator");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [credentials, setCredentials] = useState(null); // { email, password }

  const handleCreate = async () => {
    setError("");
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setError("Compila nome, cognome ed email.");
      return;
    }
    setLoading(true);
    try {
      const data = await createUser({ firstName, lastName, email, teamId, roleType });
      setCredentials({ email: data.email, password: data.password });
      onCreated();
    } catch (e) {
      setError(e.message || "Errore durante la creazione.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#000000ab] z-20">
      <div className="bg-[#022a52] w-[90%] sm:w-[480px] p-6 rounded-lg text-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">{t("create_user") || "Crea utente"}</h3>
          <button onClick={onClose} className="text-white/60 hover:text-white text-2xl leading-none">&times;</button>
        </div>

        {credentials ? (
          // Schermata credenziali generate
          <div>
            <div className="bg-[#2DB64722] border border-[#2DB647] rounded-md p-4 mb-4">
              <p className="text-[#2DB647] text-sm mb-3 font-semibold">
                Utente creato. Comunica queste credenziali all'utente — la password non sarà più visibile dopo:
              </p>
              <div className="bg-[#00000040] rounded p-3 mb-2">
                <p className="text-xs text-white/50">Email</p>
                <p className="text-white font-mono select-all">{credentials.email}</p>
              </div>
              <div className="bg-[#00000040] rounded p-3">
                <p className="text-xs text-white/50">Password</p>
                <p className="text-white font-mono text-lg select-all">{credentials.password}</p>
              </div>
            </div>
            <button onClick={() => navigator.clipboard?.writeText(`Email: ${credentials.email}\nPassword: ${credentials.password}`)}
              className="w-full bg-[#ffffff10] hover:bg-[#ffffff18] p-3 rounded-md mb-2 text-sm">
              Copia credenziali
            </button>
            <button onClick={onClose} className="w-full bg-[#789fd6] p-3 rounded-md font-semibold">
              {t("close") || "Chiudi"}
            </button>
          </div>
        ) : (
          // Form creazione
          <div className="flex flex-col gap-3">
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[#789fd6] text-xs">{t("first_name") || "Nome"}</label>
                <input value={firstName} onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#ffffff10] rounded mt-1 focus:outline-none" />
              </div>
              <div>
                <label className="text-[#789fd6] text-xs">{t("last_name") || "Cognome"}</label>
                <input value={lastName} onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#ffffff10] rounded mt-1 focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="text-[#789fd6] text-xs">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-[#ffffff10] rounded mt-1 focus:outline-none" />
            </div>
            <div>
              <label className="text-[#789fd6] text-xs">{t("role") || "Ruolo"}</label>
              <select value={roleType} onChange={(e) => setRoleType(e.target.value)}
                className="w-full px-3 py-2 bg-white text-black rounded mt-1 focus:outline-none">
                <option value="operator">Operatore</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button onClick={handleCreate} disabled={loading}
              className="w-full bg-[#789fd6] p-3 rounded-md font-semibold mt-2 disabled:opacity-50">
              {loading ? "Creazione..." : (t("create") || "Crea utente")}
            </button>
            <p className="text-white/40 text-xs text-center">
              La password viene generata automaticamente e mostrata una sola volta.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Pannello permessi MODULI del team ────────────────────────────────────────
function TeamModulesPanel({ teamId, shipId }) {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!teamId || !shipId || !open) return;
    getTeamModules(teamId, shipId)
      .then(setModules)
      .catch(() => setModules([]))
      .finally(() => setLoading(false));
  }, [teamId, shipId, open]);

  const toggle = (moduleId, field) => {
    setModules((prev) => prev.map((m) =>
      m.id === moduleId ? { ...m, [field]: !m[field] } : m
    ));
  };

  const save = async () => {
    setSaving(true);
    try {
      await setTeamModules(teamId, shipId,
        modules.map((m) => ({ module_id: m.id, can_read: m.can_read, can_write: m.can_write })));
      alert("Permessi moduli aggiornati per il team.");
    } catch {
      alert("Errore salvataggio moduli.");
    } finally { setSaving(false); }
  };

  return (
    <div className="bg-[#022a52] rounded-lg mt-6 overflow-hidden">
      <button onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-[#ffffff08]">
        <span className="text-white font-semibold">Permessi moduli del team</span>
        <span className="text-white/50">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="p-4 pt-0">
          <p className="text-white/40 text-xs mb-4">
            Questi permessi valgono per tutti i membri del team su questa nave.
          </p>
          {loading ? (
            <p className="text-white/50 text-sm">Caricamento...</p>
          ) : modules.length === 0 ? (
            <p className="text-white/50 text-sm">Nessun modulo disponibile.</p>
          ) : (
            <>
              <div className="grid grid-cols-[2fr_1fr_1fr] gap-2 text-white/50 text-xs uppercase mb-2">
                <span>Modulo</span><span className="text-center">Lettura</span><span className="text-center">Scrittura</span>
              </div>
              {modules.map((m) => (
                <div key={m.id} className="grid grid-cols-[2fr_1fr_1fr] gap-2 items-center py-2 border-b border-[#ffffff10]">
                  <span className="text-white text-sm">{m.label || m.code}</span>
                  <div className="flex justify-center">
                    <input type="checkbox" checked={m.can_read} onChange={() => toggle(m.id, "can_read")}
                      className="w-4 h-4 accent-[#789fd6]" />
                  </div>
                  <div className="flex justify-center">
                    <input type="checkbox" checked={m.can_write} onChange={() => toggle(m.id, "can_write")}
                      className="w-4 h-4 accent-[#789fd6]" />
                  </div>
                </div>
              ))}
              <button onClick={save} disabled={saving}
                className="mt-4 bg-[#789fd6] px-4 py-2 rounded-md text-sm font-semibold disabled:opacity-50">
                {saving ? "Salvataggio..." : "Salva permessi moduli"}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Tabella principale ───────────────────────────────────────────────────────
const OverviewTable = () => {
  const [teamUsers, setTeamUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editedElements, setEditedElements] = useState({});
  const [createOpen, setCreateOpen] = useState(false);

  const { user } = useUser();
  const teamId = user?.teamInfo?.teamId;
  const shipId = user?.teamInfo?.assignedShip?.id;

  const { t, i18n } = useTranslation("team");
  const [mounted, setMounted] = useState(false);

  const getTeamUsersData = async () => {
    try {
      setLoading(true);
      const users = await getTeamUsers(teamId);
      setTeamUsers(users || []);
    } catch (err) {
      setError("Errore nel recupero degli utenti del team");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    if (teamId) getTeamUsersData();
    else setLoading(false);
  }, [user, teamId]);

  useEffect(() => { setMounted(true); }, []);

  const handleSaveElements = async (userId) => {
    const elements = editedElements[userId] || [];
    try {
      await updateUserElements(userId, elements);
      alert("Impianti aggiornati!");
      getTeamUsersData();
    } catch (err) {
      console.error(err);
      alert("Errore durante l'aggiornamento!");
    }
  };

  const handleRoleChange = async (userId, roleType) => {
    try {
      await assignRole(userId, roleType);
      getTeamUsersData();
    } catch {
      alert("Errore aggiornamento ruolo.");
    }
  };

  const handleRemove = async (userId) => {
    if (!confirm("Rimuovere questo membro dal team?")) return;
    try {
      await removeMember(teamId, userId);
      getTeamUsersData();
    } catch {
      alert("Errore rimozione membro.");
    }
  };

  if (loading) return <div className="text-white p-4">Loading...</div>;
  if (error) return <div className="text-red-400 p-4">{error}</div>;
  if (!mounted || !i18n.isInitialized) return null;

  return (
    <div className="w-full mx-auto rounded-lg">
      <div className="flex items-center mb-4">
        <h2 className="text-white text-2xl font-semibold py-2">{t("team_members")}</h2>
        <button onClick={() => setCreateOpen(true)}
          className="ml-auto bg-[#789fd6] hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-md transition">
          + {t("create_user") || "Crea utente"}
        </button>
      </div>

      {/* DESKTOP HEADER */}
      <div className="hidden sm:grid grid-cols-[1.2fr_1fr_1fr_2fr_0.6fr] text-black/70 bg-white rounded-t-lg font-semibold">
        <p className="border border-[#022a52] p-3">{t("name")}</p>
        <p className="border border-[#022a52] p-3 text-center">{t("role")}</p>
        <p className="border border-[#022a52] p-3 text-center">{t("ship")}</p>
        <p className="border border-[#022a52] p-3 text-center">{t("system")}</p>
        <p className="border border-[#022a52] p-3 text-center">{t("actions") || "Azioni"}</p>
      </div>

      {/* DESKTOP ROWS */}
      {teamUsers.map((member) => (
        <div key={member.id} className="hidden sm:grid grid-cols-[1.2fr_1fr_1fr_2fr_0.6fr] text-white bg-[#022a52]">
          <p className="border border-[#001c38] p-3 flex items-center">{member.first_name} {member.last_name}</p>

          {/* Ruolo editabile */}
          <div className="border border-[#001c38] p-3 flex items-center justify-center">
            <select
              value={member.role?.type || "machine_maintainer"}
              onChange={(e) => handleRoleChange(member.id, e.target.value)}
              className="bg-[#ffffff10] text-white rounded px-2 py-1 focus:outline-none">
              {ROLE_OPTIONS.map((r) => (
                <option key={r.value} value={r.value} className="text-black">
                  {t(`roles.${r.value}`) || r.label}
                </option>
              ))}
            </select>
          </div>

          <p className="border border-[#001c38] p-3 text-center flex items-center justify-center">{member.ship?.model_code || "-"}</p>

          {/* Impianti utente */}
          <div className="border border-[#001c38] p-4 text-center">
            <div className="flex flex-wrap gap-2 mb-2 justify-center">
              {(editedElements[member.id] || member.role?.Elements?.split(",").filter(Boolean) || []).map((el) => (
                <span key={el} className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full flex items-center">
                  {el}
                  <button onClick={() => {
                    const cur = editedElements[member.id] || member.role?.Elements?.split(",").filter(Boolean) || [];
                    setEditedElements((prev) => ({ ...prev, [member.id]: cur.filter((x) => x !== el) }));
                  }} className="ml-1 text-blue-600 hover:text-blue-900">&times;</button>
                </span>
              ))}
            </div>
            <div className="flex items-center mt-4 mb-4 gap-4">
              <select
                onChange={(e) => {
                  const val = e.target.value;
                  const cur = editedElements[member.id] || member.role?.Elements?.split(",").filter(Boolean) || [];
                  if (val && !cur.includes(val)) setEditedElements((prev) => ({ ...prev, [member.id]: [...cur, val] }));
                  e.target.selectedIndex = 0;
                }}
                className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-black focus:outline-none">
                <option value="" disabled>+ {t("add_plant")}</option>
                {ELEMENTS_OPTIONS.filter((opt) => !(editedElements[member.id] || member.role?.Elements?.split(",").filter(Boolean) || []).includes(opt)).map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              <button onClick={() => handleSaveElements(member.id)}
                className="w-full bg-[#789fd6] hover:bg-blue-500 text-white font-bold py-2 px-2 rounded-md transition">
                {t("save")}
              </button>
            </div>
          </div>

          {/* Azioni */}
          <div className="border border-[#001c38] p-3 flex items-center justify-center">
            <button onClick={() => handleRemove(member.id)} title="Rimuovi dal team"
              className="text-red-400 hover:text-red-300 transition">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 448 512">
                <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C311.9 6.8 300.4 0 287.7 0L160.3 0c-12.7 0-24.2 6.8-30.5 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/>
              </svg>
            </button>
          </div>
        </div>
      ))}

      {/* MOBILE CARDS */}
      <div className="flex flex-col sm:hidden gap-4">
        {teamUsers.map((member) => (
          <div key={member.id} className="bg-[#022a52] text-white rounded-lg p-4 shadow-md">
            <div className="flex justify-between items-start">
              <p className="mb-2"><strong>{member.first_name} {member.last_name}</strong></p>
              <button onClick={() => handleRemove(member.id)} className="text-red-400">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 448 512">
                  <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C311.9 6.8 300.4 0 287.7 0L160.3 0c-12.7 0-24.2 6.8-30.5 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/>
                </svg>
              </button>
            </div>
            <div className="mb-2">
              <strong>{t("role")}:</strong>{" "}
              <select value={member.role?.type || "operator"} onChange={(e) => handleRoleChange(member.id, e.target.value)}
                className="bg-[#ffffff10] text-white rounded px-2 py-1 ml-2">
                <option value="operator" className="text-black">Operatore</option>
                <option value="admin" className="text-black">Admin</option>
              </select>
            </div>
            <p className="mb-2"><strong>{t("ship")}:</strong> {member.ship?.model_code || "-"}</p>
            <div className="mb-2">
              <strong>{t("plants")}:</strong>
              <div className="flex flex-wrap gap-2 mt-2">
                {(editedElements[member.id] || member.role?.Elements?.split(",").filter(Boolean) || []).map((el) => (
                  <span key={el} className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full flex items-center">
                    {el}
                    <button onClick={() => {
                      const cur = editedElements[member.id] || member.role?.Elements?.split(",").filter(Boolean) || [];
                      setEditedElements((prev) => ({ ...prev, [member.id]: cur.filter((x) => x !== el) }));
                    }} className="ml-1 text-blue-600 hover:text-blue-900">&times;</button>
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <select
                onChange={(e) => {
                  const val = e.target.value;
                  const cur = editedElements[member.id] || member.role?.Elements?.split(",").filter(Boolean) || [];
                  if (val && !cur.includes(val)) setEditedElements((prev) => ({ ...prev, [member.id]: [...cur, val] }));
                  e.target.selectedIndex = 0;
                }}
                className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-black">
                <option value="" disabled>+ {t("add_plant")}</option>
                {ELEMENTS_OPTIONS.filter((opt) => !(editedElements[member.id] || member.role?.Elements?.split(",").filter(Boolean) || []).includes(opt)).map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              <button onClick={() => handleSaveElements(member.id)}
                className="w-full bg-[#789fd6] hover:bg-blue-500 text-white font-bold py-2 px-2 rounded-md transition">
                {t("save")}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pannello moduli team */}
      {teamId && shipId && <TeamModulesPanel teamId={teamId} shipId={shipId} />}

      {/* Modal crea utente */}
      {createOpen && (
        <CreateUserModal
          teamId={teamId}
          onClose={() => setCreateOpen(false)}
          onCreated={getTeamUsersData}
        />
      )}
    </div>
  );
};

export default OverviewTable;
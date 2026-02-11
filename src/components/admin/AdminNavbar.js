"use client";

import { usePathname } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  LogOut,
  Settings as SettingsIcon,
  User as UserIcon,
  Building2,
  Users,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getProjects } from "@/api/admin/projects";

export default function AdminNavbar() {
  const pathname = usePathname();
  const { user } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [companiesOpen, setCompaniesOpen] = useState(false);
  const [usersOpen, setUsersOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const router = useRouter();
  const dropdownRef = useRef(null);
  const projectsRef = useRef(null);
  const companiesRef = useRef(null);
  const usersRef = useRef(null);
  const configRef = useRef(null);
  const [selectedProject, setSelectedProject] = useState(null);

  // --- Fetch delle commesse ---
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data || []);
      } catch (err) {
        console.error("Errore nel fetch progetti:", err);
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchProjects();
  }, []);

  // --- Chiudi dropdown cliccando fuori ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        projectsRef.current &&
        !projectsRef.current.contains(event.target) &&
        companiesRef.current &&
        !companiesRef.current.contains(event.target) &&
        usersRef.current &&
        !usersRef.current.contains(event.target) &&
        configRef.current &&
        !configRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
        setProjectsOpen(false);
        setCompaniesOpen(false);
        setUsersOpen(false);
        setConfigOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL_DEV;

  const handleLogout = async () => {
    try {
      await fetch(`${BASE_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            typeof window !== "undefined"
              ? `Bearer ${localStorage.getItem("token")}`
              : "",
        },
      });
    } catch (error) {
      console.error("Errore durante il logout:", error);
    } finally {
      localStorage.removeItem("token");
      router.push("/adminLogin");
    }
  };

  const navItemStyle =
    "text-gray-300 cursor-pointer hover:text-white px-3 py-2 text-sm font-medium transition-colors";
  const menuItemStyle =
    "flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-200";

  return (
    <header className="h-20 bg-gray-900 shadow-md flex items-center justify-between px-6 relative">
      {/* --- LOGO + NAV MENU --- */}
      <div className="flex items-center gap-8 ml-6">
        <Link href="/admin">
          <img
            src="https://www.sciaservices.com/wp-content/uploads/logo-chiaro.svg"
            alt="Logo"
            className="h-10 w-auto hover:opacity-80 transition-opacity"
          />
        </Link>

        {/* --- NAVIGATION MENU --- */}
        <nav className="flex items-center gap-4 ml-12">

          {/* --- Aziende Dropdown --- */}
          <div className="relative" ref={companiesRef}>
            <button
              onClick={() => setCompaniesOpen(!companiesOpen)}
              className={`${navItemStyle} flex items-center gap-1`}
            >
              Aziende
              <ChevronDown
                size={16}
                className={`transition-transform ${
                  companiesOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {companiesOpen && (
              <div className="absolute left-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50 py-2">
                <Link
                  href="/admin/sites"
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition"
                  onClick={() => setCompaniesOpen(false)}
                >
                  Cantieri
                </Link>
                <Link
                  href="/admin/owners"
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition"
                  onClick={() => setCompaniesOpen(false)}
                >
                  Proprietari
                </Link>
                <Link
                  href="/admin/producers"
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition"
                  onClick={() => setCompaniesOpen(false)}
                >
                  Produttori
                </Link>

                 <Link
                  href="/admin/suppliers"
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition"
                  onClick={() => setCompaniesOpen(false)}
                >
                  Distributori
                </Link>
              </div>
            )}
          </div>

          {/* --- Utenti Dropdown --- */}
          <div className="relative" ref={usersRef}>
            <button
              onClick={() => setUsersOpen(!usersOpen)}
              className={`${navItemStyle} flex items-center gap-1`}
            >
              Utenti
              <ChevronDown
                size={16}
                className={`transition-transform ${
                  usersOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {usersOpen && (
              <div className="absolute left-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50 py-2">
                <Link
                  href="/admin/users"
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition"
                  onClick={() => setUsersOpen(false)}
                >
                  Gestisci Utenti
                </Link>
                <Link
                  href="/admin/teams"
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition"
                  onClick={() => setUsersOpen(false)}
                >
                  Gestisci Squadre
                </Link>
              </div>
            )}
          </div>

          <div className="relative" ref={configRef}>
            <button
              onClick={() => setConfigOpen(!configOpen)}
              className={`${navItemStyle} flex items-center gap-1`}
            >
              Configurazione
              <ChevronDown
                size={16}
                className={`transition-transform ${
                  configOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {configOpen && (
              <div className="absolute left-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50 py-2">
                
                <Link
                  href="/admin/recurrency_type"
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition"
                  onClick={() => setUsersOpen(false)}
                >
                  Tipi di frequenze
                </Link>
                <Link
                  href="/admin/maintenanceLevel"
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition"
                  onClick={() => setUsersOpen(false)}
                >
                  Livelli manutenzioni
                </Link>
                <Link
                  href="/admin/ranks"
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition"
                  onClick={() => setUsersOpen(false)}
                >
                  Ranghi
                </Link>
                
              </div>
            )}
          </div>

          {/* --- Commesse --- */}
          <Link href="/admin/projects" className={navItemStyle}>
            Commesse
          </Link>

          {/* --- Dropdown Seleziona commessa --- */}
          <div className="relative" ref={projectsRef}>
            <button
              onClick={() => setProjectsOpen(!projectsOpen)}
              className={`${navItemStyle} flex items-center gap-1`}
            >
              {selectedProject?.name || "Seleziona commessa"}
              <ChevronDown
                size={16}
                className={`transition-transform ${projectsOpen ? "rotate-180" : ""}`}
              />
            </button>

            {projectsOpen && (
              <div className="absolute left-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50 py-2">
                {loadingProjects ? (
                  <p className="text-center text-gray-400 text-sm py-2">
                    Caricamento...
                  </p>
                ) : projects.length === 0 ? (
                  <p className="text-center text-gray-400 text-sm py-2">
                    Nessuna commessa
                  </p>
                ) : (
                  projects.map((proj) => (
                    <Link
                      key={proj.id}
                      href={`/admin/projects/${proj.id}`}
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition"
                      onClick={() => {
                        setSelectedProject(proj);
                        setProjectsOpen(false);
                      }}
                    >
                      {proj.name || `Commessa ${proj.id}`}
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* --- BLOCCO UTENTE --- */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-3 focus:outline-none group cursor-pointer"
        >
          <div className="flex flex-col items-end">
            <span className="text-gray-300 font-medium group-hover:text-white transition-colors">
              {user?.firstName} {user?.lastName}
            </span>
            <span className="text-gray-400 text-xs">{user?.email}</span>
          </div>
          <img
            src={user?.profileImage || "/icons/profile-default.svg"}
            alt="avatar"
            className="w-10 h-10 rounded-full border-2 border-gray-700 hover:border-blue-500 transition-all duration-300"
          />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-3 w-52 bg-gray-800 rounded-xl shadow-lg py-2 border border-gray-700 z-50 animate-fadeIn overflow-hidden">
            <Link href="/admin/profile" className={menuItemStyle}>
              <UserIcon size={18} /> Profilo
            </Link>
            <Link href="/admin/settings" className={menuItemStyle}>
              <SettingsIcon size={18} /> Impostazioni
            </Link>
            <button onClick={handleLogout} className={menuItemStyle}>
              <LogOut size={18} /> Logout
            </button>

            <div className="mt-4 text-left pl-4 pb-2 text-xs opacity-70">
              &copy; {new Date().getFullYear()} Scia Services <br />
              Versione 1.0.0
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

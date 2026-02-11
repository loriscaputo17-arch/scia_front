"use client";

import { useEffect, useState } from "react";
import { getProjects, createProject } from "@/api/admin/projects";
import ProjectsTable from "@/components/admin/projects/ProjectsTable";
import ProjectsFilters from "@/components/admin/projects/ProjectsFilters";
import AddProjectsButton from "@/components/admin/projects/AddProjectsButton";
import AddProjectsModal from "@/components/admin/projects/AddProjectsModal";
import SelectShipModal from "@/components/admin/projects/SelectShipModal";
import ESWBSModal from "@/components/admin/projects/ESWBSModal";
import ProjectDetailsModal from "@/components/admin/projects/ProjectDetailsModal";
 
export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: "", manager: "", status: "" });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectShipModalOpen, setSelectShipModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [eswbsModal, setESWBSModal] = useState(false);
  const [assignedShipId, setAssignedShipId] = useState(null);
  const [detailsModalProject, setDetailsModalProject] = useState(null);

  // Fetch progetti
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (err) {
        console.error("Errore nel fetch progetti:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // 🔍 Filtri applicati
  const filteredProjects = projects.filter((p) => {
    const nameMatch = p.name?.toLowerCase().includes(filters.name.toLowerCase());
    const managerMatch =
      !filters.manager ||
      p.manager?.toLowerCase().includes(filters.manager.toLowerCase());
    const statusMatch =
      !filters.status ||
      (filters.status === "active" ? p.active : !p.active);

    return nameMatch && managerMatch && statusMatch;
  });

  const handleAddProjectSave = async (projectData) => {
    try {
      const saved = await createProject(projectData);

      setProjects((prev) => [...prev, saved]);
      setModalOpen(false);

      setCurrentProject(saved);
      setSelectShipModalOpen(true);

    } catch (err) {
      console.error("Errore salvando commessa:", err);
      alert("Errore durante il salvataggio della commessa");
    }
  };


  return (
    <div>
      <h2 className="text-3xl font-semibold mb-6 text-gray-900">
        Gestione Commesse
      </h2>

      {/* 🔍 Filtri */}
      <ProjectsFilters filters={filters} setFilters={setFilters} />

      {/* 🧱 Tabella */}
      {loading ? (
        <p className="text-gray-500">Caricamento commesse...</p>
      ) : (
        <ProjectsTable
          projects={filteredProjects}
          onRowClick={(project) => setDetailsModalProject(project)}
        />
      )}

      {/* ➕ Aggiungi Commesse */}
      <AddProjectsButton onClick={() => setModalOpen(true)} />

      {modalOpen && (
        <AddProjectsModal
          onClose={() => setModalOpen(false)}
          onSave={handleAddProjectSave}
        />
      )}

      {selectShipModalOpen && currentProject && (
        <SelectShipModal
          project={currentProject}
          onClose={() => setSelectShipModalOpen(false)}
          onShipAssigned={(shipId) => {
            setAssignedShipId(shipId);
            setSelectShipModalOpen(false);
            setESWBSModal(true);
          }}
        />
      )}

      {eswbsModal && (
        <ESWBSModal
          shipId={assignedShipId}
          onClose={() => setESWBSModal(false)}
        />
      )}

      {detailsModalProject && (
        <ProjectDetailsModal
          project={detailsModalProject}
          onClose={() => setDetailsModalProject(null)}
        />
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getProjectById } from "@/api/admin/projects";
import Link from "next/link";

import ProjectGeneralTab from "@/components/admin/projects/project/ProjectGeneralTab";
import ProjectElementsTab from "@/components/admin/projects/project/ProjectElementsTab";
import ProjectRuntimeTab from "@/components/admin/projects/project/ProjectRuntimeTab";
import ProjectReportTab from "@/components/admin/projects/project/ProjectReportTab";

export default function ProjectDetailsPage() {
  const pathname = usePathname();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("generali");

  const match = pathname.match(/\/admin\/projects\/(\d+)/);
  const projectId = match ? match[1] : null;

  const matchShipId = pathname.match(/(\d+)(?!.*\d)/);
  const shipId = matchShipId ? matchShipId[0] : null;

  const matchShipModelId = pathname.match(/\/ship\/(\d+)/)?.[1] || null;
  const shipModelId = matchShipModelId ? matchShipModelId[0] : null;

  useEffect(() => {
    if (!projectId) return;

    const fetchProject = async () => {
      try {
        const data = await getProjectById(projectId);
        setProject(data);
      } catch (err) {
        console.error("Errore nel caricamento della commessa:", err);
        setError("Errore nel caricamento della commessa");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  if (loading)
    return <p className="text-gray-500 text-center mt-10">Caricamento...</p>;
  if (error)
    return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!project)
    return <p className="text-gray-500 text-center mt-10">Commessa non trovata</p>;

  const tabClass = (tab) =>
    `px-4 py-2 cursor-pointer text-sm font-medium rounded-t-lg border-b-2 transition-colors duration-200 ${
      activeTab === tab
        ? "border-blue-500 text-blue-600 bg-gray-50"
        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
    }`;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <Link href={`/admin/projects/${projectId}`} className="text-gray-800 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="black" width="18px" height="18px" viewBox="0 0 640 640">
          <path d="M169.4 297.4C156.9 309.9 156.9 330.2 169.4 342.7L361.4 534.7C373.9 547.2 394.2 547.2 406.7 534.7C419.2 522.2 419.2 501.9 406.7 489.4L237.3 320L406.6 150.6C419.1 138.1 419.1 117.8 406.6 105.3C394.1 92.8 373.8 92.8 361.3 105.3L169.3 297.3z" />
        </svg>
        Torna ai progetti
      </Link>

      <div className="border-b border-gray-200 mb-6 flex gap-4 mt-4">
        <button onClick={() => setActiveTab("generali")} className={tabClass("generali")}>
          Generali
        </button>
        <button onClick={() => setActiveTab("elements")} className={tabClass("elements")}>
          Elements
        </button>
        <button onClick={() => setActiveTab("runtime")} className={tabClass("runtime")}>
          Runtime
        </button>
        <button onClick={() => setActiveTab("report")} className={tabClass("report")}>
          Report
        </button>
      </div>

      {/* TAB CONTENUTO */}
      {activeTab === "generali" && <ProjectGeneralTab project={project} />}
      {activeTab === "elements" && <ProjectElementsTab projectId={shipModelId} />}
      {activeTab === "runtime" && <ProjectRuntimeTab project={project} shipId={shipId} shipModelId={shipModelId} />}
      {activeTab === "report" && <ProjectReportTab project={project} />}
    </div>
  );
}

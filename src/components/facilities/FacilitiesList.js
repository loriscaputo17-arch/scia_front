"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { fetchElements } from "@/api/elements";
import { useUser } from "@/context/UserContext";

const iconMap = {
  1: "/icons/Ico1.svg",
  2: "/icons/Ico2.svg",
  3: "/icons/Ico3.svg",
  4: "/icons/Ico4.svg",
  5: "/icons/Ico5.svg",
  6: "/icons/Ico6.svg",
  7: "/icons/Ico7.svg",
  8: "/icons/Ico8.svg",
  9: "/icons/Ico9.svg",
};

export default function ImpiantiList({ search, modal, eswbsCode }) {
  const [impiantiData, setImpiantiData] = useState([]);
  const [openNodes, setOpenNodes] = useState({});
  const [selectedCode, setSelectedCode] = useState(null);
  const { user } = useUser();
  const router = useRouter();

  const shipId = user?.teamInfo?.assignedShip?.id;
  const teamId = user?.teamInfo?.teamId;

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      try {
        const result = await fetchElements(shipId, user.id, teamId);
        setImpiantiData(result);

        if (eswbsCode) {
          const chain = findParentChain(result, eswbsCode);
          if (chain) {
            const expanded = {};
            chain.forEach((id) => (expanded[id] = true));
            setOpenNodes(expanded);
            setSelectedCode(eswbsCode);
          }
        }
      } catch (error) {
        console.error("Errore durante il fetch degli elementi:", error);
      }
    };

    fetchData();
  }, [user]);

  const filterNodesAndExpand = (nodes, searchText) => {
    const expanded = {};

    const filter = (nodes, path = []) => {
      return nodes
        .map((node) => {
          const currentPath = [...path, node.id];
          const children = node.children ? filter(node.children, currentPath) : [];
          const isMatch = node.name.toLowerCase().includes(searchText.toLowerCase());

          if (isMatch || children.length > 0) {
            path.forEach((id) => (expanded[id] = true));
            return { ...node, children };
          }

          return null;
        })
        .filter(Boolean);
    };

    const filtered = filter(nodes);
    return { filtered, expanded };
  };

  const { filtered, expanded } = filterNodesAndExpand(impiantiData, search);

  useEffect(() => {
    setOpenNodes((prev) => ({ ...prev, ...expanded }));
  }, [search]);

  const toggleNode = (id) => {
    setOpenNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const findParentChain = (nodes, code, path = []) => {
    for (const node of nodes) {
      const currentPath = [...path, node.id];
      if (node.code === code) return currentPath;
      if (node.children) {
        const result = findParentChain(node.children, code, currentPath);
        if (result) return result;
      }
    }
    return null;
  };

  const renderTree = (nodes, level = 0) =>
    nodes.map((node) => {
      const firstDigit = node.code?.charAt(0);
      const icon = iconMap[firstDigit] || null;

      console.log(node)

      return (
        <div key={node.id} className="flex flex-col">
          <div
            className="flex items-center justify-between px-2 py-4 cursor-pointer border-b border-[#ffffff20]"
            onClick={() => toggleNode(node.id)}
          >
            <div className="flex items-center space-x-4">
              {node.children?.length > 0 && (
                <svg
                  className="transition-transform"
                  style={{ transform: openNodes[node.id] ? "rotate(90deg)" : "rotate(0deg)" }}
                  width="16"
                  height="16"
                  fill="white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                >
                  <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
                </svg>
              )}

              {/* Mostra icona solo al primo livello */}
              {level === 0 && icon && (
                <Image
                  src={icon}
                  alt="icon"
                  width={24}
                  height={24}
                  className="w-6 h-6 opacity-60"
                />
              )}

              <span>
                {node.code}&nbsp; - &nbsp;{node.name}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                checked={node.code === selectedCode}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedCode(node.code);
                  } else {
                    setSelectedCode(null);
                  }
                }}
                className="mr-2 cursor-pointer w-[20px] h-[20px] appearance-none border-2 border-[#ffffff20] bg-transparent rounded-sm transition-all duration-200 checked:bg-[#789fd6] checked:border-[#789fd6] hover:opacity-80 focus:outline-none"
              />

              <svg
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/dashboard/impianti/${node.code}`);
                }}
                className="cursor-pointer"
                width="16"
                height="16"
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
              >
                <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
              </svg>
            </div>
          </div>

          {node.children && openNodes[node.id] && (
            <div className="ml-4">{renderTree(node.children, level + 1)}</div>
          )}
        </div>
      );
    });

  return (
    <div
      style={
        modal === "yes"
          ? { overflowY: "scroll", height: "45vh" }
          : {}
      }
    >
      {renderTree(filtered)}
    </div>
  );
}
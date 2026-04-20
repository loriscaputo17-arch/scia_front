"use client";

import { useEffect, useState, useRef } from "react";
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

const isStructuralNode = (eswbs_code) => {
  if (!eswbs_code) return false;
  return /0+$/.test(eswbs_code);
};

function sortTree(nodes) {
  return [...nodes]
    .sort((a, b) => (a.eswbs_code || "").localeCompare(b.eswbs_code || ""))
    .map(n => ({ ...n, children: sortTree(n.children || []) }));
}

export default function ImpiantiList({ search, modal, eswbsCode, onSelect, close }) {
  const [impiantiData, setImpiantiData] = useState([]);
  const [openNodes, setOpenNodes] = useState({});
  const [selectedCode, setSelectedCode] = useState(null);
  const router = useRouter();

  const { user, selectedShipId: shipId } = useUser();
  const teamId = user?.teamInfo?.teamId;

  const selectedRef = useRef(null);

  const findNodeByEswbs = (nodes, code) => {
    for (const node of nodes) {
      if (String(node.eswbs_code) === String(code)) return node;
      if (node.children) {
        const result = findNodeByEswbs(node.children, code);
        if (result) return result;
      }
    }
    return null;
  };

  useEffect(() => {
    if (selectedCode && selectedRef.current) {
      setTimeout(() => {
        selectedRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 150); 
    }
  }, [selectedCode]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      try {
        const result = await fetchElements(shipId, user.id, teamId);
        const sorted = sortTree(result);
        setImpiantiData(sorted);

        if (eswbsCode) {
          const chain = findParentChain(sorted, eswbsCode);
          if (chain) {
            const expanded = {};
            chain.forEach((id) => (expanded[id] = true));
            setOpenNodes(expanded);
          }
          // ← Trova il nodo con quell'eswbs_code e selezionalo
          const targetNode = findNodeByEswbs(sorted, eswbsCode);
          if (targetNode) {
            setSelectedCode(targetNode.id);
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
          const searchLower = searchText.toLowerCase();
          const isMatch =
            node.name?.toLowerCase().includes(searchLower) ||
            node.eswbs_code?.toLowerCase().includes(searchLower);

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
      if (node.eswbs_code === code) return currentPath;
      if (node.children) {
        const result = findParentChain(node.children, code, currentPath);
        if (result) return result;
      }
    }
    return null;
  };

  const renderTree = (nodes, level = 0) =>
    nodes.map((node) => {
      const hasChildren = node.children?.length > 0;
      const isOpen = openNodes[node.id];
      const firstDigit = node.eswbs_code?.charAt(0);
      const icon = level === 0 ? (iconMap[firstDigit] || null) : null;
      const isSelected = node.id === selectedCode;

      const isStructural = isStructuralNode(node.eswbs_code);

      return (
        <div key={node.id} 
          className="flex flex-col"
          ref={isSelected ? selectedRef : null}
        >
          <div
            className="flex items-center justify-between py-3 cursor-pointer border-b border-[#ffffff10] hover:bg-[#ffffff06]"
            style={{ paddingLeft: `${8 + level * 20}px`, paddingRight: "8px" }}
            onClick={() => toggleNode(node.id)}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">

              <div className="w-4 flex-shrink-0 flex items-center justify-center">
                {hasChildren ? (
                  <svg
                    className="transition-transform duration-150 flex-shrink-0"
                    style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}
                    width="10" height="10" fill="white"
                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"
                  >
                    <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
                  </svg>
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                )}
              </div>

              {icon && (
                <Image src={icon} alt="icon" width={20} height={20} className="flex-shrink-0 opacity-60" />
              )}

              <div className="flex items-center gap-2 min-w-0"
              
              onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/dashboard/impianti/${node.id}`);
                }}
              >
                <span className={`flex-shrink-0 text-xs font-mono ${
                    isStructural ? "text-white/20" : "text-white/50"
                  }`}>
                    {node.eswbs_code}
                  </span>
                <span className={`truncate ${
                  isStructural
                    ? "text-white/30 italic text-xs"  // nodi strutturali: grigi e in corsivo
                    : level === 0
                      ? "text-white font-semibold"
                      : level === 1
                        ? "text-white/90 text-sm"
                        : "text-white/70 text-sm"
                }`}>
                  {node.name}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <input
                type="checkbox"
                checked={node.id === selectedCode}
                onChange={(e) => {
                  e.stopPropagation();
                  if (e.target.checked) {
                    setSelectedCode(node.id);
                    if (onSelect) onSelect(node);
                    if (close) close();
                  } else {
                    setSelectedCode(null);
                    if (onSelect) onSelect(null);
                  }
                }}
                className="cursor-pointer w-5 h-5 appearance-none border-2 border-[#ffffff20] bg-transparent rounded-sm checked:bg-[#789fd6] checked:border-[#789fd6]"
              />

              <svg
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/dashboard/impianti/${node.id}`);
                }}
                className="cursor-pointer opacity-50 hover:opacity-100"
                width="14" height="14" fill="white"
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"
              >
                <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
              </svg>
            </div>
          </div>

          {hasChildren && isOpen && (
            <div className="border-l-2 border-[#789fd620] ml-6">
              {renderTree(node.children, level + 1)}
            </div>
          )}
        </div>
      );
    });

  return (
    <div style={modal === "yes" ? { overflowY: "scroll", height: "45vh" } : {}}>
      {filtered.length === 0 ? (
        <p className="text-white/40 text-sm p-4 text-center">Nessun risultato</p>
      ) : (
        renderTree(filtered)
      )}
    </div>
  );
}
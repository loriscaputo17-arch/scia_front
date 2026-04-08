"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export default function SelectShipPage() {
  const router = useRouter();
  const [ships, setShips] = useState([]);
  const [selected, setSelected] = useState(null);
  const [entering, setEntering] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    try {
      const decoded = jwtDecode(token);
      if (!decoded.ships || decoded.ships.length === 0) {
        router.replace("/login");
        return;
      }
      /*if (decoded.ships.length === 1) {
        localStorage.setItem("selectedShipId", decoded.ships[0].shipId);
        router.replace("/dashboard");
        return;
      }*/
      setShips(decoded.ships);
    } catch {
      localStorage.removeItem("token");
      router.replace("/login");
    }
  }, [router]);

  const handleSelect = (ship) => {
    if (entering) return;
    setSelected(ship.shipId);
    setEntering(true);
    setTimeout(() => {
      localStorage.setItem("selectedShipId", ship.shipId);
      router.push("/dashboard");
    }, 600);
  };

  if (ships.length === 0) return null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#001c38]">
      <div className="w-full max-w-md p-8 rounded-lg">

        <h2 className="text-2xl font-semibold text-white text-center mb-2">
          Seleziona unità navale
        </h2>
        <p className="text-[#789fd6] text-center text-sm mb-8">
          Scegli la nave a cui vuoi accedere
        </p>

        <div className="flex flex-col gap-3">
          {ships.map((ship) => (
            <button
              key={ship.shipId}
              onClick={() => handleSelect(ship)}
              disabled={entering}
              className={`w-full text-left px-5 py-4 rounded-md border transition duration-200 cursor-pointer
                ${selected === ship.shipId
                  ? "bg-[#789fd6] border-[#789fd6] text-white"
                  : "bg-[#1E2A3D] border-transparent text-white hover:border-[#789fd6]"
                }
                ${entering && selected !== ship.shipId ? "opacity-40" : ""}
              `}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-base leading-tight">
                    {ship.shipName}
                  </p>
                  <p className="text-xs mt-1 opacity-60 font-mono">
                    ID {String(ship.shipId).padStart(4, "0")}
                  </p>
                </div>
                <svg
                  className={`w-5 h-5 transition-opacity ${selected === ship.shipId ? "opacity-100" : "opacity-30"}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {Object.keys(ship.modules || {}).length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {Object.entries(ship.modules).map(([mod, perm]) => (
                    <span
                      key={mod}
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-sm uppercase tracking-wide
                        ${selected === ship.shipId
                          ? "bg-white/20 text-white"
                          : perm.write
                            ? "bg-[#789fd6]/20 text-[#789fd6]"
                            : "bg-white/5 text-white/40"
                        }`}
                    >
                      {mod}
                    </span>
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>

        <button
          className="mt-6 w-full text-white/50 text-sm hover:text-white transition text-center cursor-pointer"
          onClick={() => {
            localStorage.removeItem("token");
            router.push("/login");
          }}
        >
          ← Torna al login
        </button>

      </div>
    </div>
  );
}
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getProfileData } from "../api/profile";
import { jwtDecode } from "jwt-decode";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const [failureNotes, setFailureNotes] = useState({});

  const addNote = (failureId, type, content) => {
    setFailureNotes((prev) => {
      const prevFailure = prev[failureId] || { text: [], photo: [], vocal: [] };
      return {
        ...prev,
        [failureId]: {
          ...prevFailure,
          [type]: [...(prevFailure[type] || []), content],
        },
      };
    });
  };
  
  const getNotes = (failureId) => failureNotes[failureId] || { text: [], photo: [], vocal: [] };
  const clearNotes = (failureId) => {
    setFailureNotes((prev) => {
      const updated = { ...prev };
      delete updated[failureId];
      return updated;
    });
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const authInProgress = localStorage.getItem("auth_in_progress");
    if (authInProgress) {
      setLoading(true);
      const wait = setTimeout(() => setLoading(false), 1000);
      return () => clearTimeout(wait);
    }

    const token = localStorage.getItem("token");
    const isAuthPage =
      pathname.startsWith("/login") ||
      pathname.startsWith("/login-pin") ||
      pathname.startsWith("/adminLogin") ||
      pathname.startsWith("/reset-password") ||
      pathname.startsWith("/forgot-password");

    if (isAuthPage && token) {
      try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;
        if (decoded.exp && decoded.exp > now) {
          router.replace("/dashboard");
          return;
        }
      } catch {
        localStorage.removeItem("token");
      }
    }

    if (!isAuthPage) {
      if (!token || token === "undefined") {
        setLoading(false);
        router.replace("/login");
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;
        if (decoded.exp && decoded.exp < now) {
          localStorage.removeItem("token");
          setLoading(false);
          router.replace("/login");
          return;
        }
      } catch {
        localStorage.removeItem("token");
        setLoading(false);
        router.replace("/login");
        return;
      }

      const loadUser = async () => {
        const result = await getProfileData();
        if (result) {
          setUser(result);
          setLoading(false);
        } else {
          setTimeout(async () => {
            const retry = await getProfileData();
            if (retry) {
              setUser(retry);
              setLoading(false);
            } else {
              localStorage.removeItem("token");
              setLoading(false);
             router.replace("/login");
            }
          }, 500);
        }
      };

      loadUser();
    } else {
      setLoading(false);
    }
  }, [pathname, router]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loading,
        addNote,
        getNotes,
        clearNotes,
      }}
    >
      {loading ? (
        <div className="flex items-center justify-center min-h-screen text-white">
          Caricamento...
        </div>
      ) : (
        children
      )}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser deve essere usato all'interno di un UserProvider");
  }
  return context;
}

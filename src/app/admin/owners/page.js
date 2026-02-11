"use client";

import { useEffect, useState } from "react";
import { getOwners } from "@/api/admin/owners";
import OwnersTable from "@/components/admin/owners/OwnersTable";
import OwnersFilters from "@/components/admin/owners/OwnersFilters";
import AddOwnerButton from "@/components/admin/owners/AddOwnerButton";
import AddOwnerModal from "@/components/admin/owners/AddOwnerModal";

export default function OwnersPage() {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: "", email: "", status: "" });
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const data = await getOwners();
        setOwners(data);
      } catch (err) {
        console.error("Errore nel fetch owners:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOwners();
  }, []);

  const filteredOwners = owners.filter((o) => {
    const matchName =
      o.companyName?.toLowerCase().includes(filters.name.toLowerCase()) ?? false;

    const matchEmail =
      !filters.email ||
      (o.email && o.email.toLowerCase().includes(filters.email.toLowerCase()));

    const matchStatus =
      !filters.status ||
      (filters.status === "attivo" ? o.active === true : o.active === false);

    return matchName && matchEmail && matchStatus;
  });


  return (
    <div>
      <h2 className="text-3xl font-semibold mb-6 text-gray-900">Gestione Proprietari</h2>

      {/* Tabella */}
      {loading ? (
        <p className="text-gray-500">Caricamento owners...</p>
      ) : (
        <OwnersTable owners={filteredOwners} />
      )}

      {/* Pulsante aggiungi */}
      <AddOwnerButton onClick={() => setModalOpen(true)} />

      {modalOpen && <AddOwnerModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}

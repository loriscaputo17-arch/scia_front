"use client";

import GenericListPage from "@/components/admin/GenericListPage";
import { getOwners } from "@/api/admin/owners";
import OwnersTable from "@/components/admin/owners/OwnersTable";
import AddOwnerButton from "@/components/admin/owners/AddOwnerButton";
import AddOwnerModal from "@/components/admin/owners/AddOwnerModal";

export default function OwnersPage() {
  return (
    <GenericListPage
      title="Gestione Proprietari"
      fetcher={getOwners}
      initialFilters={{ name: "", email: "", status: "" }}
      filterFn={(o, f) =>
        o.companyName?.toLowerCase().includes(f.name.toLowerCase()) &&
        (!f.email || o.email?.toLowerCase().includes(f.email.toLowerCase())) &&
        (!f.status ||
          (f.status === "attivo" ? o.active : !o.active))
      }
      TableComponent={({ data }) => <OwnersTable owners={data} />}
      AddButton={AddOwnerButton}
      AddModal={AddOwnerModal}
    />
  );
}

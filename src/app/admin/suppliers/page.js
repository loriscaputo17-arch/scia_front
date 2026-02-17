"use client";

import { getSuppliers } from "@/api/admin/organizations";
import SupplierTable from "@/components/admin/suppliers/SupplierTable";
import AddOwnerButton from "@/components/admin/owners/AddOwnerButton";
import AddSupplierModal from "@/components/admin/suppliers/AddSupplierModal";
import GenericListPage from "@/components/admin/GenericListPage";

export default function SuppliersPage() {
  return (
    <GenericListPage
      title="Gestione Distributori"
      fetcher={getSuppliers}
      initialFilters={{ name: "" }}
      filterFn={(o, f) =>
        o.Organization_name
          ?.toLowerCase()
          .includes(f.name.toLowerCase())
      }
      TableComponent={({ data }) => <SupplierTable owners={data} />}
      AddButton={AddOwnerButton}
      AddModal={AddSupplierModal}
    />
  );
}

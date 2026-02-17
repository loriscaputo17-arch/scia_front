"use client";

import { getShipyards } from "@/api/admin/shipyards";
import SitesTable from "@/components/admin/sites/SitesTable";
import AddOwnerButton from "@/components/admin/owners/AddOwnerButton";
import AddSiteModal from "@/components/admin/sites/AddSitesModal";
import GenericListPage from "@/components/admin/GenericListPage";

export default function SitesPage() {
  return (
    <GenericListPage
      title="Gestione Cantieri"
      fetcher={getShipyards}
      initialFilters={{ companyName: "" }}
      filterFn={(s, f) =>
        s.companyName
          ?.toLowerCase()
          .includes(f.companyName.toLowerCase())
      }
      TableComponent={({ data }) => (
        <SitesTable sites={data} />
      )}
      AddButton={AddOwnerButton}
      AddModal={AddSiteModal}
    />
  );
}

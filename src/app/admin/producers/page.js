"use client";

import { getProducers } from "@/api/admin/organizations";
import ProducersTable from "@/components/admin/producers/ProducersTable";
import AddOwnerButton from "@/components/admin/owners/AddOwnerButton";
import AddProducersModal from "@/components/admin/producers/AddProducersModal";
import GenericListPage from "@/components/admin/GenericListPage";

export default function ProducersPage() {
  return (
    <GenericListPage
      title="Gestione Produttori"
      fetcher={getProducers}
      TableComponent={({ data }) => <ProducersTable owners={data} />}
      AddButton={AddOwnerButton}
      AddModal={AddProducersModal}
    />
  );
}

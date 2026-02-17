"use client";

import GenericAddEntityModal from "@/components/admin/modals/GenericAddEntityModal";
import ProducersTabs from "@/components/admin/materials/ProducersTabs";
import OwnerCreateForm from "@/components/admin/materials/OwnerCreateForm";
import { createProducer } from "@/api/admin/organizations";

export default function AddProducersModal(props) {
  return (
    <GenericAddEntityModal
      {...props}
      title="Aggiungi Produttori"
      entity="Producer"
      emptyItem={{
        companyName: "",
        Organisation_name: "",
        address: "",
        country: "Italia",
        armedForces: "",
        organizationCompanyNCAGE: {},
      }}
      Tabs={ProducersTabs}
      MainForm={OwnerCreateForm}
      saveFn={(p) => createProducer(p)}
      labels={{ singular: "Produttore", plural: "Produttori" }}
    />
  );
}


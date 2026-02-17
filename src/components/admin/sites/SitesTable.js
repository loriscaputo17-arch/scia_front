import GenericTable from "@/components/admin/GenericTable";
import EditSiteModal from "./EditSiteModal";

export default function SitesTable({ sites, onUpdate }) {
  console.log(sites)
  return (
    <GenericTable
      data={sites}
      searchPlaceholder="Cerca cantiere..."
      searchFn={(s, search) =>
        s.companyName?.toLowerCase().includes(search.toLowerCase())
      }
      columns={[
        {
          key: "company",
          header: "Nome Azienda",
          render: (s) => s.companyName,
        },
        { key: "address", header: "Indirizzo", render: (s) => s.address },
        { key: "country", header: "Paese", render: (s) => s.country },
        {
          key: "ncage",
          header: "NCAGE",
          render: (s) =>
            s.organizationCompanyNCAGE?.NCAGE_Code || "—",
        },
      ]}
      EditModal={({ item, onSave, onCancel }) => (
        <EditSiteModal
          site={item}
          onSave={onSave}
          onCancel={onCancel}
        />
      )}
      onUpdate={onUpdate}
    />
  );
}

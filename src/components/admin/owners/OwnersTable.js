import GenericTable from "@/components/admin/GenericTable";
import EditOwnerModal from "./EditOwnerModal";

export default function OwnersTable({ owners, onUpdate }) {
  return (
    <GenericTable
      data={owners}
      searchPlaceholder="Cerca owner..."
      searchFn={(o, s) =>
        o.companyName?.toLowerCase().includes(s.toLowerCase()) ||
        o.Organisation_name?.toLowerCase().includes(s.toLowerCase())
      }
      columns={[
        { key: "id", header: "ID", render: (o) => o.ID },
        { key: "name", header: "Nome", render: (o) => o.companyName },
        {
          key: "org",
          header: "Organizzazione",
          render: (o) => o.Organisation_name,
        },
        { key: "addr", header: "Indirizzo", render: (o) => o.address },
        { key: "country", header: "Paese", render: (o) => o.country },
        {
          key: "ncage",
          header: "NCAGE",
          render: (o) =>
            o.organizationCompany?.NCAGE_Code ||
            o.organizationCompany?.NCAGE ||
            "—",
        },
      ]}
      EditModal={({ item, onSave, onCancel }) => (
        <EditOwnerModal
          owner={item}
          onSave={onSave}
          onCancel={onCancel}
        />
      )}
      onUpdate={onUpdate}
    />
  );
}

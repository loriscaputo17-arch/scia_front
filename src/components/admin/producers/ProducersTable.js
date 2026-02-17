import GenericTable from "@/components/admin/GenericTable";
import EditProducersModal from "./EditProducersModal";

export default function ProducersTable({ owners, onUpdate }) {
  return (
    <GenericTable
      data={owners}
      emptyLabel="Nessun produttore trovato"
      searchPlaceholder="Cerca produttore..."
      searchFn={(o, s) =>
        o.Organization_name?.toLowerCase().includes(s.toLowerCase()) ||
        o.NCAGE_Code?.toLowerCase().includes(s.toLowerCase())
      }
      columns={[
        { key: "id", header: "ID", render: (o) => o.ID },
        {
          key: "name",
          header: "Organizzazione",
          render: (o) => o.Organization_name || "-",
        },
        { key: "city", header: "Città", render: (o) => o.City || "-" },
        { key: "country", header: "Paese", render: (o) => o.Country || "-" },
        { key: "ncage", header: "NCAGE", render: (o) => o.NCAGE_Code || "—" },
      ]}
      EditModal={({ item, onSave, onCancel }) => (
        <EditProducersModal
          owner={item}
          onSave={onSave}
          onCancel={onCancel}
        />
      )}
      onUpdate={onUpdate}
    />
  );
}

"use client";

import { useEffect, useState } from "react";

type GenericListPageProps<T> = {
  title: string;
  fetcher: () => Promise<T[]>;
  TableComponent: React.ComponentType<{ data: T[] }>;
  AddButton: React.ComponentType<{ onClick: () => void }>;
  AddModal: React.ComponentType<{ onClose: () => void }>;
};

export default function GenericListPage<T>({
  title,
  fetcher,
  TableComponent,
  AddButton,
  AddModal,
}: GenericListPageProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetcher()
      .then(setData)
      .finally(() => setLoading(false));
  }, [fetcher]);

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-6 text-gray-900">{title}</h2>

      {loading ? (
        <p className="text-gray-500">Caricamento...</p>
      ) : (
        <TableComponent data={data} />
      )}

      <AddButton onClick={() => setModalOpen(true)} />

      {modalOpen && <AddModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}

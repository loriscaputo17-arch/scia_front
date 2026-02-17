"use client";

export default function ProjectGeneralTab({ project }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">
        Dati Generali della Nave
      </h1>

      <div className="">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              ID Progetto
            </label>
            <p className="mt-1 px-4 py-2 bg-gray-50 rounded-md text-gray-900 border border-gray-200">
              {project.id || "—"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Stato
            </label>
            <p className="mt-1">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  project.status === "active"
                    ? "bg-green-100 text-green-700"
                    : project.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {project.status || "Sconosciuto"}
              </span>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nome Commessa
            </label>
            <p className="mt-1 px-4 py-2 bg-gray-50 rounded-md text-gray-900 border border-gray-200">
              {project.name || "—"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cantiere Costruttore
            </label>
            <p className="mt-1 px-4 py-2 bg-gray-50 rounded-md text-gray-900 border border-gray-200">
              {project.shipyard?.companyName || "—"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Data Ordine
            </label>
            <p className="mt-1 px-4 py-2 bg-gray-50 rounded-md text-gray-900 border border-gray-200">
              {project.date_order
                ? new Date(project.date_order).toLocaleDateString("it-IT")
                : "—"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Data Consegna
            </label>
            <p className="mt-1 px-4 py-2 bg-gray-50 rounded-md text-gray-900 border border-gray-200">
              {project.date_delivery
                ? new Date(project.date_delivery).toLocaleDateString("it-IT")
                : "—"}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700">
            Descrizione
          </label>
          <p className="mt-1 px-4 py-3 bg-gray-50 rounded-md text-gray-900 border border-gray-200 whitespace-pre-wrap">
            {project.description || "—"}
          </p>
        </div>
      </div>

      {project.ships?.length > 0 && (
        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Navi Associate
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm divide-y divide-gray-200">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-medium">
                <tr>
                  <th className="px-6 py-3 text-left">Unit Name</th>
                  <th className="px-6 py-3 text-left">Unit Code</th>
                  <th className="px-6 py-3 text-left">Model Code</th>
                  <th className="px-6 py-3 text-left">Side Ship #</th>
                  <th className="px-6 py-3 text-left">Launch Date</th>
                  <th className="px-6 py-3 text-left">Delivery Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {project.ships.map((ship) => (
                  <tr
                    key={ship.id}
                    className="hover:bg-gray-50 transition duration-150"
                  >
                    <td className="px-6 py-3 font-medium text-gray-800">
                      {ship.unit_name}
                    </td>
                    <td className="px-6 py-3 text-gray-700">
                      {ship.unit_code || "—"}
                    </td>
                    <td className="px-6 py-3 text-gray-700">
                      {ship.model_code || "—"}
                    </td>
                    <td className="px-6 py-3 text-gray-700">
                      {ship.Side_ship_number || "—"}
                    </td>
                    <td className="px-6 py-3 text-gray-700">
                      {ship.launch_date
                        ? new Date(ship.launch_date).toLocaleDateString("it-IT")
                        : "—"}
                    </td>
                    <td className="px-6 py-3 text-gray-700">
                      {ship.delivery_date
                        ? new Date(ship.delivery_date).toLocaleDateString("it-IT")
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

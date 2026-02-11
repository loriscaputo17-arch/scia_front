"use client";

export default function OwnersTabs({ owners, activeTab, setActiveTab }) {
  return (
    <div className="flex gap-2 mb-4 overflow-x-auto">
      {owners.map((_, idx) => (
        <button
          key={idx}
          onClick={() => setActiveTab(idx)}
          className={`px-4 py-2 text-sm font-medium rounded-full transition ${
            activeTab === idx
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Distributore {idx + 1}
        </button>
      ))}
    </div>
  );
}

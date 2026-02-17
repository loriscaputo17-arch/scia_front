"use client";

export default function ProducersTabs({ items, activeTab, setActiveTab, label }) {
  if (items.length <= 1) return null;

  return (
    <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
      {items.map((_, idx) => (
        <button
          key={idx}
          onClick={() => setActiveTab(idx)}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            activeTab === idx
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          {label} {idx + 1}
        </button>
      ))}
    </div>
  );
}

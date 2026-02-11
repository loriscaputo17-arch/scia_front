"use client";

export default function Input({
  label, value, onChange
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-900">
        {label}
      </label>
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1 border border-gray-400 rounded-lg px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-300 focus:outline-none"
      />
    </div>
  );
}


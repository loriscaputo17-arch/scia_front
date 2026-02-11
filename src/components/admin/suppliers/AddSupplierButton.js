"use client";
import { Plus } from "lucide-react";

export default function AddOwnerButton({ onClick }) {
  return (
    <button
      className="fixed bottom-10 right-10 bg-blue-600 hover:bg-blue-700 text-white w-16 h-16 rounded-full shadow-xl flex items-center justify-center text-3xl transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      <Plus size={32} />
    </button>
  );
}

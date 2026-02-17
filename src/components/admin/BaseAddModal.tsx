"use client";

export default function BaseAddModal({
  title,
  children,
  onClose,
  footer,
}) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-black ">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6">
          {children}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white p-4 flex justify-between rounded-xl">
          {footer}
        </div>
      </div>
    </div>
  );
}

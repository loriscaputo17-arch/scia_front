export default function FileList({ items, onDelete }) {
  return (
    <div className="space-y-2">
      {items.map((file) => (
        <div
          key={file.id}
          className="flex justify-between items-center bg-white p-3 shadow-sm rounded-lg hover:bg-blue-50/60 bg-white"
        >
          <a
            href={file.url}
            target="_blank"
            className="text-blue-600 hover:underline"
          >
            {file.name}
          </a>

          <button
            onClick={() => onDelete(file.id)}
            className="cursor-pointer text-red-500 hover:text-red-700"
          >
            Rimuovi
          </button>
        </div>
      ))}
    </div>
  );
}

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function DashboardCard({
  id,
  title,
  imageSrc,
  counter = 0,
  lastItems = []
}) {
  const router = useRouter();

  // Format extraction (mantengo lo stile identico)
  const formatItem = (item) => {
    const text =
      item?.title ||
      item?.task_name ||
      item?.Part_name ||
      item?.file_name ||
      item?.description ||
      item?.maintenance_list?.name;

    if (!text) return null;

    const cleaned = text.trim();
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
  };

  // Prepara le ultime due
  const formatted = lastItems.map(formatItem).filter(Boolean);
  const visible = formatted.slice(0, 2);
  const remaining = counter > 2 ? counter - 2 : 0;

  return (
    <div
      className="relative bg-[#022a52] p-6 rounded-lg text-white flex flex-col justify-between w-full h-full cursor-pointer hover:bg-[#033366] transition"
      onClick={() =>
        router.push(`/dashboard/${id.toLowerCase().replace(/\s+/g, "")}`)
      }
    >
      {/* HEADER ICON + RED BADGE */}
      <div className="flex gap-3">
        <Image
          src={imageSrc}
          alt={title}
          width="0"
          height="0"
          sizes="100vw"
          style={{ width: "3rem", height: "auto", marginBottom: '1rem' }}
        />

        {counter > 0 && (
          <div className="ml-auto flex items-start">
            <div
              className="
                bg-[#ff0000]
                rounded-full
                w-7 h-7
                flex items-center justify-center
                text-[11px]
                font-semibold
                leading-none
              "
            >
              {counter > 999 ? "999+" : counter}
            </div>
          </div>
        )}
      </div>

      {/* LOWER AREA */}
      <div className="mt-auto">
        {counter > 0 && (
          <p className="text-[14px] text-[#789fd6] font-semibold sm:mt-0 mt-4">
            {title}
          </p>
        )}

        {counter > 0 && (
          <div className="mt-1 text-[#ffffff60] text-[14px]">
            {visible.map((t, index) => (
              <p key={index} className="truncate">
                {t}
              </p>
            ))}

            {remaining > 0 && (
              <p className="text-[#ffffffa5] font-medium">+ altri {remaining}</p>
            )}
          </div>
        )}

        <h3 className="text-3xl font-semibold mt-1">{title}</h3>
      </div>
    </div>
  );
}

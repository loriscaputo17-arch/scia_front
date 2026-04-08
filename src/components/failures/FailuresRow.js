import { useState, useEffect, useRef } from "react";
import StatusBadge from "./StatusBadge";
import Icons from "./Icons";
import NotesModal from "./NotesModal";
import { useRouter } from "next/navigation";

const areaIcons = {
  "A bordo": "/icons/shape.png",
  "In banchina": "/icons/dock.png",
  "In bacino": "/icons/drydock.png",
  "Esterno": "/icons/external.png",
};

const statusColors = {
  good: "text-white",
  not_good: "text-orange-500",
  bad: "text-red-600",
  default: "text-white opacity-20",
};

const calculateStatus = (expirationDate) => {
  if (!expirationDate) return "sconosciuto";

  const today = new Date();
  const dueDate = new Date(expirationDate);
  const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "scaduto";
  if (diffDays <= 7) return "in_scadenza";
  return "ok";
};

const getStatusColor = (gravity) => {
  if (gravity == "critica") {
    return "rgb(208,2,27)";
  } else if (gravity == "alta") {
    return "rgb(244,114,22)"; 
  } else if (gravity == "media") {
    return "rgb(255,191,37)";
  } else if (gravity == "bassa") {
    return "rgb(45,182,71)";
  }
  return "#CCCCCC";
};

const MaintenanceRow = ({ data }) => {
  const status = calculateStatus(data.data_recovery_expiration);
  const today = new Date();
  const dueDate = new Date(data.data_recovery_expiration);
  const dueDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

  const [isOpen, setIsOpen] = useState(false);

  const cameraStatus = data.img ? data.img_status || "good" : "default";
  const micStatus = data.audio ? data.audio_status || "good" : "default";
  const docStatus = data.note ? data.note_status || "good" : "default";

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionClick = (option) => {
    setIsDropdownOpen(false); 
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const router = useRouter();

  const handleRowClick = () => {
    router.push(`/dashboard/failures/${data.id}`);
  };

  return (
    <div>

    <div
      className="hidden sm:grid grid-cols-[3fr_1fr_1fr_1fr] items-center border-b border-[#001c38] bg-[#022a52] cursor-pointer"
      style={{ borderLeft: `8px solid ${getStatusColor(data.gravity?.toLowerCase())}` }}
    >
      <div onClick={handleRowClick} className="border border-[#001c38] p-3 flex flex-col justify-center min-h-[60px]" style={{ height: "-webkit-fill-available" }}>
        <p className="text-white text-[18px] font-semibold truncate">{data.title}</p>
        <p className="text-white/60 text-[16px] text-sm truncate">
          {data.partNumber}
        </p>
      </div>
      <div className="border border-[#001c38] p-3 flex items-center justify-center cursor-pointer" onClick={() => setIsOpen(true)} style={{ height: "-webkit-fill-available" }}>
        <div className="flex gap-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 576 512"
            fill="currentColor"
            className={`w-6 h-6 ${statusColors[cameraStatus]}`}
          >
            <path d="M288 144a128 128 0 1 0 0 256 128 128 0 1 0 0-256zm0 208a80 80 0 1 1 0-160 80 80 0 1 1 0 160zm288-80c0 106-86 192-192 192H192C86 464 0 378 0 272V240c0-35 29-64 64-64h48l29-58c6-12 18-20 32-20h192c14 0 26 8 32 20l29 58h48c35 0 64 29 64 64v32z"/>
          </svg>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            fill="currentColor"
            className={`w-6 h-6 ${statusColors[micStatus]}`}
          >
            <path d="M192 352a80 80 0 0 0 80-80V80a80 80 0 1 0-160 0v192a80 80 0 0 0 80 80zm128-128a16 16 0 1 0-32 0v48a96 96 0 1 1-192 0v-48a16 16 0 1 0-32 0v48c0 64 40 118 96 138v50h-40a16 16 0 1 0 0 32h128a16 16 0 1 0 0-32h-40v-50c56-20 96-74 96-138v-48z"/>
          </svg>

          <svg fill="currentColor" className={`w-6 h-6 ${statusColors[docStatus]}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-288-128 0c-17.7 0-32-14.3-32-32L224 0 64 0zM256 0l0 128 128 0L256 0zM112 256l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z"/></svg>
        </div>
      </div>
        <div className="border border-[#001c38] p-3 flex items-center justify-center" style={{ height: "-webkit-fill-available" }}>
          {data.userExecutionData?.first_name && 
            <span>{data.userExecutionData.first_name} {data.userExecutionData.last_name}</span>
          }

        </div>
      
      <div className="border border-[#001c38]" style={{ height: "-webkit-fill-available" }}>
        <StatusBadge date={data.date} gravity={data.gravity} />
      </div>
    </div>

     <div
  className="flex sm:hidden flex-col pl-4 mb-4 rounded-md border-b border-[#001c38] bg-[#022a52] cursor-pointer"
  style={{ borderLeft: `8px solid ${getStatusColor(data.gravity?.toLowerCase())}` }}
>
  <div onClick={handleRowClick} className="pt-3 flex flex-col justify-center min-h-[60px]">
    <div className="mb-2">
      <StatusBadge date={data.date} gravity={data.gravity} />
    </div>

    <p className="text-white text-[18px] font-semibold truncate">{data.title}</p>
    <p className="text-white/60 text-[16px] text-sm truncate">{data.partNumber}</p>
  </div>

  <div className="flex items-center mt-3">
    <div
      className="pb-3 pt-3 pr-3 flex items-center justify-center cursor-pointer"
      onClick={() => setIsOpen(true)}
    >
      <div className="flex gap-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 576 512"
          fill="currentColor"
          className={`w-6 h-6 ${statusColors[cameraStatus]}`}
        >
          <path d="M288 144a128 128 0 1 0 0 256 128 128 0 1 0 0-256zm0 208a80 80 0 1 1 0-160 80 80 0 1 1 0 160zm288-80c0 106-86 192-192 192H192C86 464 0 378 0 272V240c0-35 29-64 64-64h48l29-58c6-12 18-20 32-20h192c14 0 26 8 32 20l29 58h48c35 0 64 29 64 64v32z" />
        </svg>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 384 512"
          fill="currentColor"
          className={`w-6 h-6 ${statusColors[micStatus]}`}
        >
          <path d="M192 352a80 80 0 0 0 80-80V80a80 80 0 1 0-160 0v192a80 80 0 0 0 80 80zm128-128a16 16 0 1 0-32 0v48a96 96 0 1 1-192 0v-48a16 16 0 1 0-32 0v48c0 64 40 118 96 138v50h-40a16 16 0 1 0 0 32h128a16 16 0 1 0 0-32h-40v-50c56-20 96-74 96-138v-48z" />
        </svg>

        <svg
          fill="currentColor"
          className={`w-6 h-6 ${statusColors[docStatus]}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 384 512"
        >
          <path d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-288-128 0c-17.7 0-32-14.3-32-32L224 0 64 0zM256 0l0 128 128 0L256 0zM112 256l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z" />
        </svg>
      </div>
    </div>

      <div className="text-[#ffffff60] px-2">|</div>
      
        <div className="p-3 flex items-center justify-center text-white">
          {data.userExecutionData?.first_name && 
            <span>{data.userExecutionData.first_name} {data.userExecutionData.last_name}</span>
          }
        </div>
      
      </div>
    </div>

    <NotesModal isOpen={isOpen} onClose={() => setIsOpen(false)} data={data} />

    </div>
  );
};

export default MaintenanceRow;
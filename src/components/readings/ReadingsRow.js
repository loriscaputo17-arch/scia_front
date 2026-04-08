import { useState, useEffect, useRef } from "react";
import NotesModal from "./NotesModal";
import { useRouter } from "next/navigation";
import Image from 'next/image';

const statusColors = {
  good: "text-white",
  not_good: "text-orange-500",
  bad: "text-red-600",
  default: "text-white opacity-20",
};

const ReadingsRow = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tags, setTags] = useState([]);
  const dropdownRef = useRef(null);
  const router = useRouter();

  const cameraStatus = data.img ? data.img_status || "good" : "default";
  const micStatus = data.audio ? data.audio_status || "good" : "default";
  const docStatus = data.note ? data.note_status || "good" : "default";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {}
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (data?.tags) {
      const parsed = data.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      setTags(parsed);
    }
  }, [data]);

  const tagColors = [
    '#f78da7', '#a78bfa', '#60a5fa', '#34d399',
    '#fbbf24', '#f87171', '#38bdf8', '#c084fc',
  ];

  function truncate(text, maxLength) {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  }

  const getFacilityIcon = (code) => {
    if (!code) return null;
    const firstDigit = code.trim().charAt(0);
    if (!/^[0-9]$/.test(firstDigit)) return null;
    return `/icons/facilities/Ico${firstDigit}.svg`;
  };

  const eswbsCode = data?.element?.element_model?.ESWBS_code;
  const facilityIcon = getFacilityIcon(eswbsCode);
  const handleRowClick = () => router.push(`/dashboard/readings/${data.id}`);

  const NoteIcons = () => (
    <div className="flex gap-3" onClick={() => setIsOpen(true)}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentColor" className={`w-5 h-5 ${statusColors[cameraStatus]}`}>
        <path d="M288 144a128 128 0 1 0 0 256 128 128 0 1 0 0-256zm0 208a80 80 0 1 1 0-160 80 80 0 1 1 0 160zm288-80c0 106-86 192-192 192H192C86 464 0 378 0 272V240c0-35 29-64 64-64h48l29-58c6-12 18-20 32-20h192c14 0 26 8 32 20l29 58h48c35 0 64 29 64 64v32z"/>
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor" className={`w-5 h-5 ${statusColors[micStatus]}`}>
        <path d="M192 352a80 80 0 0 0 80-80V80a80 80 0 1 0-160 0v192a80 80 0 0 0 80 80zm128-128a16 16 0 1 0-32 0v48a96 96 0 1 1-192 0v-48a16 16 0 1 0-32 0v48c0 64 40 118 96 138v50h-40a16 16 0 1 0 0 32h128a16 16 0 1 0 0-32h-40v-50c56-20 96-74 96-138v-48z"/>
      </svg>
      <svg fill="currentColor" className={`w-5 h-5 ${statusColors[docStatus]}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
        <path d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-288-128 0c-17.7 0-32-14.3-32-32L224 0 64 0zM256 0l0 128 128 0L256 0zM112 256l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z"/>
      </svg>
    </div>
  );

  return (
    <div>
      {/* ── DESKTOP ── */}
      <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr] items-stretch border-b border-[#001c38] bg-[#022a52]">
        <div onClick={handleRowClick} className="border border-[#001c38] p-3 flex flex-col justify-center min-h-[60px] cursor-pointer">
          <div className="flex items-center gap-2">
            <p className="text-white text-[18px] font-semibold">
              {truncate(data?.element?.name || data?.task_name, 28)}
            </p>
            <div className="flex items-center gap-1 flex-wrap ml-auto">
              {tags.map((tag, index) => (
                <span key={index} style={{ backgroundColor: tagColors[index % tagColors.length] }}
                  className="text-white px-2 py-0.5 rounded-full text-xs">
                  {truncate(tag, 14)}
                </span>
              ))}
            </div>
          </div>
          <p className="text-white/60 text-sm truncate flex items-center gap-1 mt-1">
            {facilityIcon && <Image src={facilityIcon} alt="" width={14} height={14} />}
            {eswbsCode && <span className="text-white/40 font-mono text-xs">{eswbsCode}</span>}
            {truncate(data?.element?.name, 28)}
          </p>
        </div>

        <div onClick={handleRowClick} className="border border-[#001c38] px-3 text-center text-white flex flex-col items-center justify-center cursor-pointer">
          <p className="text-[18px]">{data.recurrence}h</p>
        </div>

        <div className="border border-[#001c38] px-3 flex items-center justify-center cursor-pointer">
          <NoteIcons />
        </div>

        <div className="border border-[#001c38] p-3 flex items-center justify-center gap-2">
          <span className="text-[13px] text-white/60">{data.unit}</span>
          <span className="text-[24px] text-white font-bold">
            {data.value ?? <span className="text-white/30 text-base">—</span>}
          </span>
        </div>
      </div>

      {/* ── MOBILE ── */}
      <div className="flex sm:hidden flex-col mb-3 rounded-lg bg-[#022a52] overflow-hidden">
        
        {/* Header card */}
        <div onClick={handleRowClick} className="px-4 pt-4 pb-2 cursor-pointer">
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {tags.map((tag, index) => (
                <span key={index} style={{ backgroundColor: tagColors[index % tagColors.length] }}
                  className="text-white px-2 py-0.5 rounded-full text-xs">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <p className="text-white font-semibold text-base leading-tight">{data.task_name}</p>
          {data?.element?.name && (
            <p className="text-white/50 text-xs mt-1 flex items-center gap-1">
              {facilityIcon && <Image src={facilityIcon} alt="" width={12} height={12} />}
              {eswbsCode && <span className="font-mono">{eswbsCode}</span>}
              <span className="truncate">{data.element.name}</span>
            </p>
          )}
        </div>

        {/* Footer card */}
        <div className="flex items-center px-4 pb-4 pt-2 gap-3 border-t border-[#ffffff08]">
          
          {/* Ricorrenza */}
          <div onClick={handleRowClick} className="cursor-pointer">
            <span className="text-white text-sm font-semibold">{data.recurrence}h</span>
          </div>

          {/* Note icons */}
          <div className="cursor-pointer">
            <NoteIcons />
          </div>

          {/* Valore */}
          <div className="ml-auto flex items-center gap-1">
            {data.value ? (
              <>
                <span className="text-[22px] text-white font-bold">{data.value}</span>
                <span className="text-xs text-white/60">{data.unit}</span>
              </>
            ) : (
              <span className="text-white/30 text-sm">— {data.unit || ''}</span>
            )}
          </div>
        </div>
      </div>

      <NotesModal isOpen={isOpen} onClose={() => setIsOpen(false)} data={data} />
    </div>
  );
};

export default ReadingsRow;
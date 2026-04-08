"use client";

import { useState, useEffect } from "react";
import Image from 'next/image';
import SpareModal from "./SpareModal";
import Istructions from "./Istructions";
import { updateReading } from "@/api/readings";
import { useTranslation } from "@/app/i18n";
import { useRouter } from "next/navigation";

const ReadingsInfo = ({ details }) => {
  const [showIstructions, setShowIstructions] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);
  const readingId = details?.[0]?.id;
  const router = useRouter();

  useEffect(() => {
    if (details?.[0]?.tags) {
      setTags(details[0].tags.split(',').map(tag => tag.trim()));
    }
  }, [details]);

  const handleRemoveTag = (indexToRemove) => {
    const updatedTags = tags.filter((_, i) => i !== indexToRemove);
    setTags(updatedTags);

    updateReading(readingId, { tags: updatedTags.join(',') });
  };

  const handleAddTag = () => {
    if (newTag.trim() !== '') {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      setNewTag('');
      setShowTagInput(false);

      updateReading(readingId, { tags: updatedTags.join(',') });
    }
  };

  const tagColors = [
    '#f78da7',
    '#a78bfa', 
    '#60a5fa', 
    '#34d399', 
    '#fbbf24', 
    '#f87171', 
    '#38bdf8', 
    '#c084fc', 
  ];

  const { t, i18n } = useTranslation("maintenance");
  if (!i18n.isInitialized) return null;

  return (
    <div className="p-2">
      <h2 className="text-lg text-[#789fd6] mb-2">{t("description")}</h2>

      <p
        className={`text-white ${
          showFull
            ? ""
            : "line-clamp-2 overflow-hidden text-ellipsis whitespace-normal"
        }`}
        style={{
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: showFull ? "unset" : 2,
          overflow: "hidden",
        }}
      >
        {details?.[0]?.description || 'Caricamento...'}
      </p>

       {details[0]?.documentFileUrl &&
          <button
            className="text-sm text-[#fff] w-fit cursor-pointer bg-[#ffffff1a] py-1 px-4 rounded mt-2"
            onClick={() => {
                  if (details[0].documentFileUrl) {
                    const pdfUrl = `${details[0].documentFileUrl}#page=${details[0]?.maintenance_list?.page}`;
                    window.open(pdfUrl, "_blank");
                  } else {
                    alert("Nessun documento trovato per questo ricambio");
                  }
                }}
          >
            {t("see_files")}
          </button>
        }

      <div className="mb-6">
        <div className="flex items-center mb-2 mt-4">
          <h2 className="text-lg text-[#789fd6] flex items-center w-full">
            Tag
            <div className="ml-auto cursor-pointer" onClick={() => setShowTagInput(prev => !prev)}>
              <svg fill="#fff" width="18px" height="18px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"/></svg>  
            </div>
          </h2>
        </div>

        {showTagInput && (
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="bg-[#ffffff1a] text-white px-2 py-1 rounded text-sm flex-grow outline-none"
              placeholder="Nuovo tag"
            />
            <button onClick={handleAddTag} className="bg-[#789fd6] text-white px-3 py-1 rounded text-sm">
              {t("add")}
            </button>
          </div>
        )}

        <div className="flex items-center gap-2 cursor-pointer flex-wrap">
          {tags.map((tag, index) => (
            <span
              key={index}
              style={{ backgroundColor: tagColors[index % tagColors.length] }}
              className="text-white px-3 py-1 rounded-full text-xs flex items-center"
            >
              {tag.trim()}
              <span
                onClick={() => handleRemoveTag(index)}
                className="ml-2 cursor-pointer text-white font-bold"
              >
                <svg fill="#fff" width="12px" height="12px"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/></svg>
              </span>
            </span>
          ))}
        </div>

      </div>

      <div className="mb-6">

        <div className="flex items-center mb-2 mt-4">
          <h2 className="text-lg text-[#789fd6]">{t("system")}/{t("component")}</h2>
        </div>

        <div className="flex items-center gap-4 cursor-pointer" 
         onClick={(e) => { e.stopPropagation();
            router.push(`/dashboard/impianti/${details[0]?.element?.id}`);
          }}
        >
          <Image 
                    src="/motor.jpg"
                    alt="Motore"
                    width={25} 
                    height={25} 
                    className=""
                  />
          <div>
            <h2 className="text-md text-[#fff]">
              {details?.[0]?.element?.element_model?.ESWBS_code} {details?.[0]?.element?.name}
            </h2>
          </div>
        
          <div className="ml-auto mr-8">
                <svg fill="white" width="16px" height="16px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg>
              </div>
        </div>
      </div>

      <div className="mb-6">

        <div className="flex items-center mb-2 mt-4">
          <h2 className="text-lg text-[#789fd6]">{t("anniversary")}</h2>
        </div>

        <div className="flex items-center gap-4 cursor-pointer">
          <p>{details?.[0]?.recurrence ? `ogni ${details?.[0]?.recurrence}h` : 'Caricamento...'}</p>
        </div>

      </div>

      <div className="mb-6">
        <div className="flex items-center mb-2 mt-4">
          <h2 className="text-lg text-[#789fd6]">{t("assignment_team")}</h2>
        </div>
      
        <div className="flex items-center gap-4 cursor-pointer">
          <p>{details?.[0]?.team || 'Non assegnato'}</p>
        </div>
      </div>

      {showIstructions &&
        <Istructions istructions={""} onClose={() => setShowIstructions(false)} />
      } 

    </div>
  );
};

export default ReadingsInfo;
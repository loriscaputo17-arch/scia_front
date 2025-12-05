import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/app/i18n";
import StatusBadge from "./StatusBadge";
import NotesModal from "./NotesModal";
import { updateMaintenanceJobStatus } from "@/api/maintenance";
import { computeExpiryDate, diffInDaysFromToday, getStatusColor } from "@/utils/maintenanceDates";
import { getDeadlineVisuals } from "@/utils/maintenanceThresholds";

const areaIcons = {
  "IV - BACINO": "/icons/shape.png",
  "In banchina": "/icons/dock.png",
  "In bacino": "/icons/drydock.png",
  "Esterno": "/icons/external.png",
};

const NoteIcons = ({ hasPhoto, hasAudio, hasText, onOpen, rowColor }) => {
  const Icon = ({ path, active }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 576 512"
      fill={active ? rowColor : "rgba(255,255,255,0.2)"}
      className="w-6 h-6"
    >
      <path d={path} />
    </svg>
  );

  const PHOTO_PATH =
    "M288 144a128 128 0 1 0 0 256 128 128 0 1 0 0-256zm0 208a80 80 0 1 1 0-160 80 80 0 1 1 0 160zm288-80c0 106-86 192-192 192H192C86 464 0 378 0 272V240c0-35 29-64 64-64h48l29-58c6-12 18-20 32-20h192c14 0 26 8 32 20l29 58h48c35 0 64 29 64 64v32z";

  const MIC_PATH =
    "M192 352a80 80 0 0 0 80-80V80a80 80 0 1 0-160 0v192a80 80 0 0 0 80 80zm128-128a16 16 0 1 0-32 0v48a96 96 0 1 1-192 0v-48a16 16 0 1 0-32 0v48c0 64 40 118 96 138v50h-40a16 16 0 1 0 0 32h128a16 16 0 1 0 0-32h-40v-50c56-20 96-74 96-138v-48z";

  const TEXT_PATH =
    "M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-288-128 0c-17.7 0-32-14.3-32-32L224 0 64 0zM256 0l0 128 128 0L256 0zM112 256l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z";

  return (
    <div className="flex gap-4" onClick={onOpen}>
      <Icon path={PHOTO_PATH} active={hasPhoto} />
      <Icon path={MIC_PATH} active={hasAudio} />
      <Icon path={TEXT_PATH} active={hasText} />
    </div>
  );
};

const LegendItem = ({ icon, label }) => (
  <div className="flex items-center gap-3">
    <Image src={icon} alt="icon" width={16} height={16} />
  </div>
);

const ActionsMenu = ({ onPause, onResume, onDetails }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const toggle = () => setOpen((v) => !v);
  return (
    <div className="p-3 flex items-center justify-center w-8 relative" ref={ref}>
      <svg onClick={toggle} className="cursor-pointer" fill="white" width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 512">
        <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
      </svg>
      {open && (
        <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-lg z-20">
          <button className="block px-4 py-2 text-black hover:bg-gray-200 w-full text-left" onClick={() => { onPause(); setOpen(false); }}>Pausa</button>
          <button className="block px-4 py-2 text-black hover:bg-gray-200 w-full text-left" onClick={() => { onResume(); setOpen(false); }}>Riprendi</button>
          <button className="block px-4 py-2 text-black hover:bg-gray-200 w-full text-left" onClick={() => { onDetails(); setOpen(false); }}>Dettagli</button>
        </div>
      )}
    </div>
  );
};

const TitleCell = ({ jobName, elementName, onClick, eswbsCode }) => {
  const getFacilityIcon = (code) => {
    if (!code) return null;
    const firstDigit = code.trim().charAt(0);
    if (!/^[0-9]$/.test(firstDigit)) return null;
    return `/icons/facilities/Ico${firstDigit}.svg`;
  };

  function truncate(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  }


  const icon = getFacilityIcon(eswbsCode);

  return (
    <div onClick={onClick} className="border border-[#001c38] p-3 flex flex-col justify-center min-h-[60px]" style={{ height: "-webkit-fill-available" }}>
      <div className="flex items-center gap-2">

        <p className="text-white text-[18px] font-semibold">
          {jobName ? truncate(jobName, 35) : ""}
        </p>

      </div>

      <p className="text-white/60 text-[16px] text-sm truncate flex items-center gap-2">
        {icon && (
          <Image src={icon} alt="facility icon" width={16} height={16} />
        )}

        {elementName ? elementName.charAt(0).toUpperCase() + elementName.slice(1) : ""}
      </p>
    </div>
  );
};

const RecurrencyCell = ({ recurrencyLabel, levelMMI, onClick }) => (
  <div onClick={onClick} className="border border-[#001c38] p-3 text-center text-white flex flex-col items-center gap-2" style={{ height: "-webkit-fill-available" }}>
    <p className="text-[18px] text-white">{recurrencyLabel}</p>
    <div className="flex items-center gap-2">
      {areaIcons[levelMMI] && <img src={areaIcons[levelMMI]} alt={levelMMI} className="w-4 h-4" />}
      <p className="text-[16px] text-[#67c2ae]">{levelMMI} level</p>
    </div>
  </div>
);

export default function MaintenanceRow({ data }) {
  const router = useRouter();
  const { t, i18n } = useTranslation("maintenance");
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted || !i18n.isInitialized) return null;

  const recurrency = data.maintenance_list?.recurrency_type?.name;
  const earlyThreshold = data.maintenance_list?.recurrency_type?.early_threshold;
  const dueThreshold = data.maintenance_list?.recurrency_type?.due_threshold;
  const delayThreshold = data.maintenance_list?.recurrency_type?.delay_threshold;

  const expiryDate = computeExpiryDate({
    executionDate: data.execution_date,       
    endingDate: data.ending_date, 
    startingDate: data.starting_date,             
    recurrency,
    maintenanceList: data.job?.maintenance_list,
  });

  const { bgColor: rowColor } = getDeadlineVisuals({
    dueDate: expiryDate,
    earlyThreshold: data.maintenance_list?.recurrency_type?.early_threshold,
    dueThreshold: data.maintenance_list?.recurrency_type?.due_threshold,
    delayThreshold: data.maintenance_list?.recurrency_type?.delay_threshold,
  });

  const dueDays = diffInDaysFromToday(expiryDate);
  const hasNotes = (data.photographicNotes?.length || 0) + (data.vocalNotes?.length || 0) + (data.textNotes?.length || 0) > 0;

  const handleRowClick = () => router.push(`/dashboard/maintenance/${data.id}`);
  const handleOptionClick = async (opt) => { await updateMaintenanceJobStatus(data.id, opt); router.refresh(); };

  return (
    <div>
      <div
        className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] items-center border-b border-[#001c38] bg-[#022a52] cursor-pointer"
        style={{ borderLeft: `8px solid ${rowColor}` }}
      >

        <TitleCell 
          jobName={data.maintenance_list?.name}
          elementName={`${data.Element?.element_model?.ESWBS_code} ${data.Element?.name}`}
          eswbsCode={data.Element?.element_model?.ESWBS_code}
          onClick={handleRowClick}
        />

        <RecurrencyCell
          recurrencyLabel={recurrency || t("unknown")}
          levelMMI={data.maintenance_list?.maintenance_level?.Level_MMI}
          onClick={handleRowClick}
        />

        <div
          className="border border-[#001c38] p-3 flex items-center justify-center"
          style={{ height: "-webkit-fill-available" }}
        >
          <NoteIcons
            hasPhoto={(data.photographicNotes || []).length > 0}
            hasAudio={(data.vocalNotes || []).length > 0}
            hasText={(data.textNotes || []).length > 0}
            onOpen={hasNotes ? () => setIsOpen(true) : undefined}
            rowColor={rowColor}
          />
        </div> 

        <div
          className="border border-[#001c38] p-3 flex items-center justify-center gap-4"
          style={{ height: "-webkit-fill-available" }}
        >
          {expiryDate && (
            <LegendItem icon="/icons/Shape-2.png" label={t("items.time_deadline")} />
          )}

          {(data.status?.id === 2 || data.execution_state === 2) && (
            <LegendItem icon="/icons/Path.png" label={t("items.planned_stop")} />
          )}

          {Array.isArray(data.spares) && data.spares.length > 0 && (
            <LegendItem icon="/icons/Shape-9.png" label={t("items.spares_required")} />
          )}
        </div>

        <div className="border border-[#001c38]" style={{ height: "-webkit-fill-available", background: rowColor }}>
          
          <StatusBadge 
            dueDate={expiryDate?.toISOString?.() || expiryDate}
            dueDays={dueDays ?? undefined}
            earlyThreshold={data.maintenance_list?.recurrency_type?.early_threshold}
            dueThreshold={data.maintenance_list?.recurrency_type?.due_threshold}
            delayThreshold={data.maintenance_list?.recurrency_type?.delay_threshold}
          />

        </div>

        <ActionsMenu
          onPause={() => handleOptionClick(3)}
          onResume={() => handleOptionClick(1)}
          onDetails={handleRowClick}
        />
      </div>

      <div
        className="flex sm:hidden flex-col bg-[#022a52] border-b border-[#001c38] rounded-md px-4 py-3 mb-4"
        style={{ borderLeft: `8px solid ${rowColor}` }}
      >
        <div className="flex items-start justify-between">
          <StatusBadge 
            dueDate={expiryDate?.toISOString?.() || expiryDate}
            dueDays={dueDays ?? undefined}
            earlyThreshold={data.maintenance_list?.recurrency_type?.early_threshold}
            dueThreshold={data.maintenance_list?.recurrency_type?.due_threshold}
            delayThreshold={data.maintenance_list?.recurrency_type?.delay_threshold}
          />
          <ActionsMenu
            onPause={() => handleOptionClick(2)}
            onResume={() => handleOptionClick(1)}
            onDetails={handleRowClick}
          />
        </div>

        <div className="mt-4" onClick={handleRowClick}>
          <p className="text-white text-base font-semibold truncate">{data.job?.name}</p>
          <p className="text-white/60 text-sm truncate">{data.Element?.element_model?.LCN_name}</p>
        </div>

        <div className="mt-3 flex flex-wrap gap-3 items-center">
          {expiryDate && <LegendItem icon="/icons/Shape-2.png" label={t("items.time_deadline")} />}
          {(data.status?.id === 2 || data.execution_state === 2) && <LegendItem icon="/icons/Path.png" label={t("items.planned_stop")} />}
        </div>

        {hasNotes && (
          <div className="mt-4">
            <NoteIcons
              hasPhoto={(data.photographicNotes || []).length > 0}
              hasAudio={(data.vocalNotes || []).length > 0}
              hasText={(data.textNotes || []).length > 0}
              onOpen={hasNotes ? () => setIsOpen(true) : undefined}
              rowColor={rowColor}
            />
          </div>
        )}
      </div>

      <NotesModal isOpen={isOpen} onClose={() => setIsOpen(false)} data={data} />
    </div>
  );
}

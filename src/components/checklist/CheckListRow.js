import { useState, useEffect, useRef } from "react";
import StatusBadge from "./StatusBadge";
import Icons from "./Icons";
import NotesModal from "./NotesModal";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import ElementIcon from "@/components/ElementIcon";
import { useTranslation } from "@/app/i18n";
import { markAs, markAsOk } from "@/api/maintenance";
import { addPhotographicNoteGeneral, addVocalNoteGeneral, addTextNoteGeneral } from "@/api/failures";
import { useUser } from "@/context/UserContext";

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

const getStatusColor = (dueDays) => {
  if (dueDays < -15) {
    return "rgb(208,2,27)";
  } else if (dueDays < 0) {
    return "rgb(244,114,22)"; 
  } else if (dueDays <= 3) {
    return "rgb(255,191,37)";
  } else if (dueDays > 15) {
    return "rgb(45,182,71)";
  }
  return "#CCCCCC";
};

const CheckListRow = ({ data }) => {

  const status = calculateStatus(data.data_recovery_expiration);
  const today = new Date();
  const dueDate = new Date(data.data_recovery_expiration);
  const dueDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

  const [isOpen, setIsOpen] = useState(false);

  const cameraStatus = data.photographicNotes.length > 0 ? "good" : "default";
  const micStatus = data.vocalNotes.length > 0 ? "good" : "default";
  const docStatus = data.textNotes.length > 0 ? "good" : "default";

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { t, i18n } = useTranslation("maintenance");

  console.log(data)

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
    router.push(`/dashboard/checklist/${data.id}`);
  };

  const { getNotes, clearNotes, user } = useUser();

  const uploadNotesToDb = async (status) => {
    const failureId = data?.id;
    const notes = getNotes(failureId);

    try {
      // FOTO
      for (const photoFile of notes.photo || []) {
        const formData = new FormData();
        formData.append("file", photoFile);
        formData.append("failureId", failureId);
        formData.append("authorId", user.id);
        formData.append("type", "maintenance");
        formData.append("status", status);
        await addPhotographicNoteGeneral(formData);
      }

      // AUDIO
      for (const audioFile of notes.vocal || []) {
        const formData = new FormData();
        formData.append("file", audioFile);
        formData.append("failureId", failureId);
        formData.append("authorId", user.id);
        formData.append("type", "maintenance");
        formData.append("status", status);
        await addVocalNoteGeneral(formData);
      }

      // TESTO
      for (const text of notes.text || []) {
        await addTextNoteGeneral({
          content: text,
          failureId,
          authorId: user.id,
          type: "maintenance",
          status
        });
      }

      clearNotes(failureId);

    } catch (err) {
      console.error("Errore upload note:", err);
    }
  };

  const handleOk = async () => {
    try {
      await uploadNotesToDb("ok");

      await markAsOk(data.id, {
        maintenanceList_id: data.id,
        userId: user?.id,
        userType: "User logged in",
        time: 0,
        level: null,
        spares: []
      });

      clearNotes(data.id);
      window.location.reload();
    } catch (err) {
      console.error("Errore handleOk()", err);
      alert("Errore durante il completamento OK.");
    }
  };

  const handleAnomaly = async () => {
    try {
      await uploadNotesToDb("anomaly");
      await markAs(data.id, 2);
      window.location.reload();
    } catch (err) {
      console.error("Errore anomaly:", err);
      alert("Errore impostando anomaly.");
    }
  };

  return (
    <div>
      <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] 
      items-center border-b border-[#001c38] 
      bg-[#022a52] cursor-pointer"
      >
        <div onClick={handleRowClick} className="border border-[#001c38] p-3 flex flex-col justify-center min-h-[60px]" style={{ height: "-webkit-fill-available" }}> 
          <p className="text-white text-[18px] font-semibold">
            {data.maintenance_list.name.length > 45 
              ? data.maintenance_list.name.substring(0, 45) + "..." 
              : data.maintenance_list.name}
          </p>
          <p className="text-white/60 text-[16px] text-sm truncate">
            <ElementIcon elementId={data.Element.progressive_code} /> {data.Element.name}
          </p>
        </div>
        <div onClick={handleRowClick} className="border border-[#001c38] p-3 text-center text-white justify-center flex flex-col items-center gap-2" style={{ height: "-webkit-fill-available" }}>
          <p className="text-[18px] text-white">{data?.maintenance_list?.recurrency_type?.name}</p>
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
        <div
          onClick={handleAnomaly}
          className={`border border-[#001c38] p-3 flex items-center justify-center ${
            data.execution_state === "2" ? "bg-[#FFBF25]" : ""
          }`}
          style={{ height: "-webkit-fill-available" }}
        >
          <Image 
            src="/icons/error2.svg"
            alt="Error"
            width={30} 
            height={30}
          />
        </div>
        <div
          onClick={handleOk}
          className={`border border-[#001c38] p-3 flex items-center justify-center ${
            data.execution_state === "1" ? "bg-[#2DB647]" : ""
          }`}
          style={{ height: "-webkit-fill-available" }}
        >          
          <Image 
            src="/icons/verified2.svg"
            alt="Verified"
            width={30} 
            height={30}
          />
        </div>
      </div>

      <div className="flex sm:hidden flex-col pl-4 mb-4 rounded-md bg-[#022a52] cursor-pointer h-[22vh]">
        <div
          onClick={handleRowClick}
          className="p-3 flex flex-col justify-center min-h-[60px] h-full"
        > 
          <p className="text-white text-[18px] font-semibold truncate">{data.maintenance_list.name}</p>
          <p className="text-white/60 text-[16px] truncate">
            <ElementIcon elementId={data.Element.progressive_code} /> {data.Element.name}
          </p>
        </div>

        <div className="flex items-center">
          <div
            onClick={handleRowClick}
            className="p-3 text-center text-white flex flex-col items-center gap-2 h-full"
          >
            <p className="text-[18px] text-white">{data?.maintenance_list?.recurrencyType?.name}</p>
          </div>

          <div
            className="p-3 flex items-center justify-center cursor-pointer h-full"
            onClick={
                data.photographicNotes.length > 0 || data.vocalNotes.length > 0 || data.textNotes.length > 0
                  ? () => setIsOpen(true)
                  : undefined
              } 
          >
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
        </div>

        <div className="flex items-center w-full">
          <div
            onClick={handleAnomaly}
            className={`p-3 flex items-center justify-center w-1/2 ${
              data.status_id === 2 ? "bg-[#FFBF25]" : ""
            }`}
          >
            <Image src="/icons/error2.svg" alt="Error" width={30} height={30} className="mr-2" />
            {t("anomaly")}
          </div>
          <div
            onClick={handleOk}
            className={`p-3 flex items-center justify-center w-1/2 ${
              data.status_id === 1 ? "bg-[#2DB647]" : ""
            }`}
          >
            <Image src="/icons/verified2.svg" alt="Verified" width={30} height={30} className="mr-2" />
            {t("ok")}
          </div>
        </div>
      </div>

      <NotesModal isOpen={isOpen} onClose={() => setIsOpen(false)} data={data} />
    </div>
  );
};

export default CheckListRow;

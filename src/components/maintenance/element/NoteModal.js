"use client";

import { useState } from "react";
import { useTranslation } from "@/app/i18n";
import { useUser } from "@/context/UserContext";

import {
  addPhotographicNoteGeneral,
  addVocalNoteGeneral,
  addTextNoteGeneral
} from "@/api/failures";

export default function NoteModal({ onClose, id }) {
  const { t } = useTranslation("failures");
  const { user } = useUser();

  const [selectedNoteType, setSelectedNoteType] = useState(null);
  const [textInput, setTextInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async (type, content) => {
    setLoading(true);

    try {
      if (type === "photo") {
        const formData = new FormData();
        formData.append("failureId", id);
        formData.append("authorId", user.id);
        formData.append("type", "maintenance");
        formData.append("file", content);

        await addPhotographicNoteGeneral(formData);
      }

      if (type === "vocal") {
        const formData = new FormData();
        formData.append("failureId", id);
        formData.append("authorId", user.id);
        formData.append("type", "maintenance");
        formData.append("file", content);

        await addVocalNoteGeneral(formData);
      }

      if (type === "text") {
        const payload = {
          failureId: id,
          authorId: user.id,
          type: "maintenance",
          content: content,
        };

        await addTextNoteGeneral(payload);
      }

      // reset UI
      setSelectedNoteType(null);
      setTextInput("");
      
      window.location.reload();

    } catch (error) {
      console.error(error);
      alert("❌ Errore durante l'upload");
    } finally {
      setLoading(false);
    }
  };

  const handleTextAdd = () => {
    if (textInput.trim()) handleUpload("text", textInput.trim());
  };

  const handleFileAdd = (e, type) => {
    const file = e.target.files[0];
    if (file) handleUpload(type, file);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#000000ab] z-10">
      <div className="bg-[#022a52] sm:w-[70%] w-full p-5 rounded-md shadow-lg text-white">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[26px] font-semibold">{t("add_note")}</h2>
          <button className="text-white text-xl cursor-pointer" onClick={onClose}>✕</button>
        </div>

        {!selectedNoteType && (
          <div className="grid sm:grid-cols-3 grid-cols-1 gap-4 mb-4">
            <NoteTypeButton icon="photo" label={t("photogtaphic_note")} onClick={() => setSelectedNoteType("photo")} />
            <NoteTypeButton icon="vocal" label={t("vocal_note")} onClick={() => setSelectedNoteType("vocal")} />
            <NoteTypeButton icon="text" label={t("text_note")} onClick={() => setSelectedNoteType("text")} />
          </div>
        )}

        {selectedNoteType === "photo" && (
          <input type="file" accept="image/*" onChange={(e) => handleFileAdd(e, "photo")} disabled={loading} />
        )}

        {selectedNoteType === "vocal" && (
          <input type="file" accept="audio/*" onChange={(e) => handleFileAdd(e, "vocal")} disabled={loading} />
        )}

        {selectedNoteType === "text" && (
          <>
            <textarea
              className="w-full bg-transparent border p-2 rounded-md"
              value={textInput}
              placeholder={t("add_note")}
              disabled={loading}
              onChange={(e) => setTextInput(e.target.value)}
            />
            <button onClick={handleTextAdd} disabled={loading} className="w-full bg-[#789fd6] mt-2 py-2 rounded-md">
              {loading ? t("loading") : t("add_note")}
            </button>
          </>
        )}

        {selectedNoteType && (
          <div className="flex justify-between mt-4 gap-4">
            <button className="bg-white text-black px-4 py-2 rounded-md w-1/2" onClick={() => setSelectedNoteType(null)}>
              {t("back")}
            </button>
            <button className="bg-[#789fd6] text-white px-4 py-2 rounded-md w-1/2" onClick={onClose}>
              {t("close_button")}
            </button>
          </div>
        )}

        {!selectedNoteType && (
          <button className="w-full bg-[#789fd6] px-3 py-4 rounded-md mt-4 text-white font-semibold" onClick={onClose}>
            {t("close_button")}
          </button>
        )}
      </div>
    </div>
  );
}

function NoteTypeButton({ icon, label, onClick }) { const icons = { photo: ( <svg fill="white" width="45px" height="45px" className="ml-auto mr-auto sm:mb-4" viewBox="0 0 512 512"> <path d="M149.1 64.8L138.7 96 64 96C28.7 96 0 124.7 0 160L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-256c0-35.3-28.7-64-64-64l-74.7 0L362.9 64.8C356.4 45.2 338.1 32 317.4 32L194.6 32c-20.7 0-39 13.2-45.5 32.8zM256 192a96 96 0 1 1 0 192 96 96 0 1 1 0-192z" /> </svg> ), vocal: ( <svg fill="white" width="45px" height="45px" className="ml-auto mr-auto sm:mb-4" viewBox="0 0 384 512"> <path d="M192 0C139 0 96 43 96 96v160c0 53 43 96 96 96s96-43 96-96V96c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24S16 202.7 16 216v40c0 89.1 66.2 162.7 152 174.4V464h-48c-13.3 0-24 10.7-24 24s10.7 24 24 24h144c13.3 0 24-10.7 24-24s-10.7-24-24-24h-48v-33.6c85.8-11.7 152-85.3 152-174.4v-40c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 70.7-57.3 128-128 128S64 326.7 64 256v-40z" /> </svg> ), text: ( <svg fill="white" width="45px" height="45px" className="ml-auto mr-auto sm:mb-4" viewBox="0 0 384 512"> <path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160L256 0H64zM256 0v128h128L256 0zM112 256h160c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64h160c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64h160c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16z" /> </svg> ), }; return ( <div className="bg-[#00000020] p-8 rounded-md cursor-pointer" onClick={onClick}> {icons[icon]} <p className="text-center sm:mt-0 mt-2">{label}</p> </div> ); }

"use client";

import { useState } from "react";
import { useTranslation } from "@/app/i18n";
import { useUser } from "@/context/UserContext";
import VocalRecorder from "./VocalRecorder";

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
        await addTextNoteGeneral({
          failureId: id,
          authorId: user.id,
          type: "maintenance",
          content,
        });
      }

      resetForm();
      window.location.reload();

    } catch (error) {
      console.error(error);
      alert("❌ Errore durante l'upload");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedNoteType(null);
    setTextInput("");
  };

  const handleTextAdd = () => {
    if (textInput.trim()) handleUpload("text", textInput.trim());
  };

  const handleFileAdd = (e, type) => {
    const file = e.target.files[0];
    if (file) handleUpload(type, file);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#000000bb] z-50">
      <div className="bg-[#022a52] sm:w-[60%] w-full p-6 rounded-lg shadow-lg text-white">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">{t("add_note")}</h2>
          <button onClick={onClose} className="cursor-pointer text-xl">✕</button>
        </div>

        {!selectedNoteType && (
          <div className="grid sm:grid-cols-3 grid-cols-1 gap-5 mb-6">
            <NoteTypeButton
              icon={photoIcon}
              label={t("photogtaphic_note")}
              onClick={() => setSelectedNoteType("photo")}
            />
            <NoteTypeButton
              icon={vocalIcon}
              label={t("vocal_note")}
              onClick={() => setSelectedNoteType("vocal")}
            />
            <NoteTypeButton
              icon={textIcon}
              label={t("text_note")}
              onClick={() => setSelectedNoteType("text")}
            />
          </div>
        )}

        {selectedNoteType === "photo" && (
          <div className="w-full">
            <label
              htmlFor="photoUpload"
              className="w-full h-56 flex flex-col items-center justify-center bg-[#ffffff15] 
                         border border-[#ffffff40] rounded-xl cursor-pointer 
                         hover:bg-[#ffffff25] transition text-center p-4"
            >
              {photoIcon(70)}
              <p className="mt-2 text-white opacity-80 text-sm">
                Trascina qui una foto oppure clicca per selezionarla
              </p>
              <p className="text-xs opacity-50 mt-1">
                JPG, PNG, HEIC supportati
              </p>
            </label>

            <input
              id="photoUpload"
              type="file"
              accept="image/*"
              className="hidden"
              disabled={loading}
              onChange={(e) => handleFileAdd(e, "photo")}
            />
          </div>
        )}

        {selectedNoteType === "vocal" && (
          <VocalRecorder
            onFile={(file) => handleUpload("vocal", file)}
            loading={loading}
          />
        )}

        {selectedNoteType === "text" && (
          <>
            <textarea
              className="w-full bg-[#ffffff15] border border-[#ffffff30] p-3 rounded-md"
              rows={4}
              placeholder={t("add_note")}
              value={textInput}
              disabled={loading}
              onChange={(e) => setTextInput(e.target.value)}
            />
            <button
              onClick={handleTextAdd}
              disabled={loading}
              className="cursor-pointer w-full bg-[#789fd6] mt-3 py-3 rounded-md font-semibold"
            >
              {loading ? t("loading") : t("add_note")}
            </button>
          </>
        )}

        {selectedNoteType && (
          <div className="flex justify-between mt-6 gap-4">
            <button
              className="cursor-pointer bg-white text-black px-4 py-2 rounded-md w-1/2"
              onClick={() => setSelectedNoteType(null)}
            >
              {t("back")}
            </button>

            <button
              className="cursor-pointer bg-[#789fd6] text-white px-4 py-2 rounded-md w-1/2"
              onClick={onClose}
            >
              {t("close_button")}
            </button>
          </div>
        )}

        {!selectedNoteType && (
          <button
            className="cursor-pointer w-full bg-[#789fd6] mt-6 py-3 rounded-md font-semibold"
            onClick={onClose}
          >
            {t("close_button")}
          </button>
        )}
      </div>
    </div>
  );
}

function NoteTypeButton({ icon, label, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-[#00000020] p-8 rounded-xl cursor-pointer hover:bg-[#00000035] transition"
    >
      <div className="flex justify-center mb-2">{icon(45)}</div>
      <p className="text-center">{label}</p>
    </div>
  );
}

function photoIcon(size = 45) {
  return (
    <svg fill="white" width={size} height={size} viewBox="0 0 512 512">
      <path d="M149.1 64.8L138.7 96H64C28.7 96 0 124.7 0 160v256c0 
      35.3 28.7 64 64 64h384c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64h-74.7
      L362.9 64.8C356.4 45.2 338.1 32 317.4 32H194.6c-20.7 
      0-39 13.2-45.5 32.8zM256 192a96 96 0 100 192 96 96 0 000-192z" />
    </svg>
  );
}

function vocalIcon(size = 45) {
  return (
    <svg fill="white" width={size} height={size} viewBox="0 0 384 512">
      <path d="M192 0c-53 0-96 43-96 96v160c0 53 43 96 96 96s96-43 
      96-96V96c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24S16 
      202.7 16 216v40c0 89.1 66.2 162.7 152 
      174.4V464h-48c-13.3 0-24 10.7-24 
      24s10.7 24 24 24h144c13.3 0 24-10.7 
      24-24s-10.7-24-24-24h-48v-33.6c85.8-11.7 
      152-85.3 152-174.4v-40c0-13.3-10.7-24-24-24s-24 
      10.7-24 24v40c0 70.7-57.3 128-128 
      128S64 326.7 64 256v-40z"/>
    </svg>
  );
}

function textIcon(size = 45) {
  return (
    <svg fill="white" width={size} height={size} viewBox="0 0 384 512">
      <path d="M64 0C28.7 0 0 28.7 0 
      64v384c0 35.3 28.7 64 64 
      64h256c35.3 0 64-28.7 64-64V160L256 
      0H64zm192 0v128h128L256 
      0zM112 256h160c8.8 0 16 7.2 16 
      16s-7.2 16-16 16H112c-8.8 
      0-16-7.2-16-16s7.2-16 16-16zm0 
      64h160c8.8 0 16 7.2 16 
      16s-7.2 16-16 16H112c-8.8 
      0-16-7.2-16-16s7.2-16 16-16zm0 
      64h160c8.8 0 16 7.2 16 
      16s-7.2 16-16 16H112c-8.8 
      0-16-7.2-16-16s7.2-16 16-16z" />
    </svg>
  );
}

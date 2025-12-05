"use client";

import { useState } from "react";
import { useTranslation } from "@/app/i18n";

export default function VocalRecorder({ onFile, loading }) {
  const { t } = useTranslation("failures");
  const [recording, setRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      let chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setRecordedBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    } catch (err) {
      console.error("Microphone error:", err);
      alert("⚠️ Errore: impossibile accedere al microfono.");
    }
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    setRecording(false);
  };

  const uploadRecording = () => {
    if (recordedBlob) onFile(recordedBlob);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) onFile(file);
  };

  return (
    <div className="w-full">
      <label className="block mb-2 opacity-80">{t("upload_audio")}</label>
      <input
        type="file"
        accept="audio/*"
        disabled={loading}
        onChange={handleFileUpload}
        className="w-full bg-[#ffffff15] p-3 border border-[#ffffff40] rounded-md cursor-pointer mb-6"
      />

      <h3 className="text-[16px] opacity-80 mb-2">{t("or_record_now")}</h3>

      {!recording && (
        <button
          onClick={startRecording}
          disabled={loading}
          className="cursor-pointer bg-green-600 w-full py-3 rounded-md text-white font-semibold mb-3"
        >
          {t("start_recording")}
        </button>
      )}

      {recording && (
        <button
          onClick={stopRecording}
          className="cursor-pointer bg-red-600 w-full py-3 rounded-md text-white font-semibold mb-3"
        >
          {t("stop_recording")}
        </button>
      )}

      {audioUrl && (
        <div className="mt-4">
          <p className="opacity-80 mb-2">{t("preview")}</p>

          <audio controls src={audioUrl} className="w-full mb-3" />

          <button
            onClick={uploadRecording}
            className="cursor-pointer bg-blue-500 w-full py-3 rounded-md text-white font-semibold"
          >
            {t("upload_recording")}
          </button>
        </div>
      )}
    </div>
  );
}
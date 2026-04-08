"use client";
import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { BrowserMultiFormatReader } from "@zxing/library";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { createScan } from "@/api/scan";

export default function ScanItem({ scan }) {
  const [result, setResult] = useState(null);
  const [scanning, setScanning] = useState(false);
  const webcamRef = useRef(null);
  const router = useRouter();
  const { user, selectedShipId: shipId } = useUser();

  const captureAndDecode = useCallback(async () => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    setScanning(true);

    const img = new Image();
    img.src = imageSrc;
    img.onload = async () => {
      const codeReader = new BrowserMultiFormatReader();
      try {
        const luminanceSource = codeReader.createLuminanceSourceFromImage(img);
        const binaryBitmap = codeReader.createBinaryBitmap(luminanceSource);
        const decoded = codeReader.decode(binaryBitmap);
        const url = decoded.getText();
        setResult(url);

        // ── Estrai element_id dall'URL scansionato ──
        // es. http://localhost:3000/dashboard/impianti/3391
        const match = url.match(/\/impianti\/(\d+)/);
        const elementId = match ? parseInt(match[1]) : null;

        if (elementId && shipId && user?.id) {
          // Salva scan nel DB
          await createScan(elementId, shipId, user.id);

          // Reindirizza alla pagina dell'impianto
          router.push(`/dashboard/impianti/${elementId}`);
        } else {
          // URL non riconosciuto — mostra comunque il risultato
          alert(`QR scansionato: ${url}`);
        }

      } catch (err) {
        // Nessun QR trovato nell'immagine
        console.log("Nessun QR rilevato");
      } finally {
        setScanning(false);
      }
    };
  }, [router, user, shipId]);

  return (
    <div className="p-3 bg-[#001c38] rounded-lg flex flex-col gap-4 justify-center items-center">
      <p className="font-semibold">{scan?.name}</p>
      <p className="text-sm text-[#ffffff60]">{scan?.details}</p>

      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/png"
        videoConstraints={{ facingMode: "environment" }}
        className="rounded-lg w-full"
      />

      <button
        onClick={captureAndDecode}
        disabled={scanning}
        className={`mt-3 px-4 py-2 rounded text-white w-full font-bold transition ${
          scanning ? "bg-gray-500 cursor-not-allowed" : "bg-[#789fd6] hover:bg-blue-500"
        }`}
      >
        {scanning ? "Scansione in corso..." : "Scansiona QR"}
      </button>

      {result && (
        <p className="mt-2 text-green-400 text-sm text-center break-all">
          ✓ {result}
        </p>
      )}
    </div>
  );
}
"use client";

import { useState, useEffect, useRef } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import Image from "next/image";
import LastScanPopup from "@/components/header/LastScanPopup";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { createScan } from "@/api/scan";

export default function Qrcode({ className = "", onScan }) {
  const [scanning, setScanning] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showLastScan, setShowLastScan] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const scannerRef = useRef(null);
  const scannerId = "reader";
  const router = useRouter();
  const { user, selectedShipId: shipId } = useUser();
  const hasScannedRef = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 640);
    }
  }, []);

  useEffect(() => {
    if (!scanning) return;
    hasScannedRef.current = false;

    const html5QrCode = new Html5Qrcode(scannerId);
    scannerRef.current = html5QrCode;

    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices.length === 0) throw new Error("Nessuna camera trovata");

        const config = {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          formatsToSupport: [
            Html5QrcodeSupportedFormats.QR_CODE,
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.CODE_128,
          ],
        };

        html5QrCode
          .start(
            { facingMode: "environment" },
            config,
            async (decodedText) => {
              if (hasScannedRef.current) return;
              hasScannedRef.current = true;
              stopScanner();

              const ean13Regex = /^\d{13}$/;
              if (ean13Regex.test(decodedText)) {
                router.push(`/product/${decodedText}`);
                return;
              }

              // ── URL valido ──────────────────────────────────────
              try {
                new URL(decodedText);

                // Controlla se è un link impianto SCIA
                const match = decodedText.match(/\/impianti\/(\d+)/);
                if (match) {
                  const elementId = parseInt(match[1]);

                  // Salva scan nel DB
                  if (user?.id && shipId) {
                    await createScan(elementId, shipId, user.id);
                  }

                  // Naviga alla pagina impianto
                  router.push(`/dashboard/impianti/${elementId}`);
                } else {
                  // Altro URL — naviga direttamente
                  window.location.href = decodedText;
                }
              } catch {
                // Non è un URL — callback generica
                if (onScan) onScan(decodedText);
              }
            },
            () => {} // ignore continuous scan errors
          )
          .catch((err) => {
            console.error("Errore avvio scanner:", err);
            stopScanner();
          });
      })
      .catch((err) => {
        console.error("Errore accesso camera:", err);
        stopScanner();
      });

    return () => {
      stopScanner();
    };
  }, [scanning, onScan, router, user, shipId]);

  const stopScanner = () => {
    setScanning(false);
  };

  const handleQrcodeClick = () => {
    if (isMobile) {
      setShowMenu(true);
    } else {
      setScanning(true);
    }
  };

  return (
    <div className={className}>
      <Image
        src="/icons/qrcode.svg"
        alt="Qrcode"
        width={40}
        height={40}
        onClick={handleQrcodeClick}
        className="cursor-pointer"
      />

      {showMenu && (
        <div
          className="absolute bg-white rounded-md shadow-md p-4 z-50 mt-2 w-48 text-black"
          style={{ right: "2rem" }}
        >
          <button
            className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded"
            onClick={() => { setShowMenu(false); setScanning(true); }}
          >
            Scansiona
          </button>
          <button
            className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded mt-2"
            onClick={() => { setShowMenu(false); setShowLastScan(true); }}
          >
            Ultime scansioni
          </button>
          <button
            className="block w-full text-left px-2 py-1 mt-2 text-black hover:text-red-700"
            onClick={() => setShowMenu(false)}
          >
            Chiudi
          </button>
        </div>
      )}

      {scanning && (
        <div className="fixed inset-0 bg-[#00000082] flex items-center justify-center z-50">
          <div className="relative bg-white p-4 rounded-md">
            <button
              onClick={stopScanner}
              className="absolute top-2 right-2 text-black font-bold text-lg"
            >
              ×
            </button>
            <div id={scannerId} className="w-[300px] h-[300px] bg-black" />
          </div>
        </div>
      )}

      {showLastScan && (
        <LastScanPopup onClose={() => setShowLastScan(false)} />
      )}
    </div>
  );
}
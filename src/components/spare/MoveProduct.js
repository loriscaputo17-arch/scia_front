"use client";

import { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { fetchSpareById, updateSpare } from "@/api/spare";
import { saveScan } from "@/api/scan";
import FacilitiesModal from "./FacilitiesModal";
import MoveProductTable from "./MoveProductTable";
import AddProduct from "./AddProduct";
import Image from "next/image";
import { useUser } from "@/context/UserContext";
import { useTranslation } from "@/app/i18n";

export default function MoveProduct({ isOpen, onClose, data }) {
  /** ---------------------------------------------------------
   * HOOKS (devono essere sempre allo stesso ordine)
   * --------------------------------------------------------- */
  const [ean13, setEan13] = useState("");
  const [partNumber, setPartNumber] = useState("");
  const [eswbsSearch, setEswbsSearch] = useState("");

  const [showEswbsPopup, setShowEswbsPopup] = useState(false);
  const [selectedEswbs, setSelectedEswbs] = useState("");

  const [scanning, setScanning] = useState(false);

  const [showResults, setShowResults] = useState(false);
  const [addSpare, setAddSpare] = useState(false);
  const [results, setResults] = useState(null);

  const scannerRef = useRef(null);

  const { user } = useUser();
  const shipId = user?.teamInfo?.assignedShip?.id;

  const { t, i18n } = useTranslation("maintenance");

  /** ---------------------------------------------------------
   * EFFECT: Gestione scanner
   * --------------------------------------------------------- */
  useEffect(() => {
    if (!scanning) return;

    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    });

    scanner.render(
      async (decodedText) => {
        setEan13(decodedText);
        setScanning(false);

        try {
          await saveScan({
            scannedData: decodedText,
            scannedAt: new Date().toISOString(),
            scanId: data?.id || null,
          });
        } catch (e) {}

      },
      (error) => {}
    );

    scannerRef.current = scanner;

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [scanning, data]);

  /** ---------------------------------------------------------
   * EARLY RETURN DOPO GLI HOOK
   * --------------------------------------------------------- */
  if (!i18n?.isInitialized) return null;
  if (!isOpen) return null;

  /** ---------------------------------------------------------
   * HANDLERS
   * --------------------------------------------------------- */
  const handleSearch = async () => {
    try {
      const response = await fetchSpareById(ean13, partNumber, eswbsSearch);

      if (response.length > 0) {
        setResults(response[0]);
        setShowResults(true);
      } else {
        setAddSpare(true);
      }
    } catch (error) {
      console.error("Errore nella ricerca:", error);
    }
  };

  const handleConfirm = async () => {
    if (!results) return;

    try {
      const updatedData = {
        ...results,
        updatedAt: new Date().toISOString(),
        scanId: data?.id || null,
      };

      await updateSpare(updatedData.ID, updatedData, shipId, user.id);
    } catch (error) {
      console.error("Errore durante la conferma:", error);
    }
  };

  const resetModal = () => {
    setShowResults(false);
    setAddSpare(false);
    onClose();
  };

  const isSearchEnabled = ean13 || partNumber || eswbsSearch || scanning;

  /** ---------------------------------------------------------
   * RENDER SAFE — UN SOLO RETURN
   * --------------------------------------------------------- */
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-10">
      <div className="bg-[#022a52] sm:w-[70%] w-full h-full sm:h-auto p-6 rounded-md shadow-lg text-white overflow-y-auto max-h-[95vh]">

        {/* --------------------- ADD NEW SPARE --------------------- */}
        {addSpare && (
          <AddProduct
            onClose={() => {
              setAddSpare(false);
              setScanning(true);
            }}
          />
        )}

        {/* --------------------- SEARCH MODE --------------------- */}
        {!addSpare && !showResults && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[22px] font-semibold">{t("move_or_add_spare")}</h2>

              <button className="text-white text-xl cursor-pointer" onClick={resetModal}>
                ✕
              </button>
            </div>

            <div
              className="px-4 py-4 rounded-lg flex items-center justify-between bg-[#e2d52d] gap-4 cursor-pointer"
              onClick={() => setScanning(true)}
            >
              <div className="flex items-center gap-2">
                <svg fill="#022a52" width="18px" height="18px" viewBox="0 0 448 512">
                  <path d="M32 32C14.3 32 0 46.3 0 64v96c0 17.7 14.3 32 32 32s32-14.3 32-32V96h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H32..." />
                </svg>
                <h2 className="text-[#022a52] font-semibold">{t("scan_barcode")}</h2>
              </div>
            </div>

            {scanning && <div id="reader" className="w-full flex justify-center mt-4" />}

            {/* SEARCH FIELDS */}
            <div className="my-6">
              <input
                type="text"
                className="w-full px-4 py-2 bg-[#ffffff10] text-white rounded-md mb-4"
                value={ean13}
                onChange={(e) => setEan13(e.target.value)}
                placeholder="EAN13"
              />

              <input
                type="text"
                className="w-full px-4 py-2 bg-[#ffffff10] text-white rounded-md mb-4"
                value={partNumber}
                onChange={(e) => setPartNumber(e.target.value)}
                placeholder="Part Number"
              />

              <div
                className="px-4 py-2 bg-[#ffffff10] text-white rounded-md cursor-pointer"
                onClick={() => setShowEswbsPopup(true)}
              >
                {selectedEswbs || t("choose_eswbs")}
              </div>
            </div>

            <button
              className="w-full bg-[#789fd6] p-3 text-white font-semibold rounded-md"
              disabled={!isSearchEnabled}
              onClick={handleSearch}
            >
              {t("start_search")}
            </button>

            <FacilitiesModal
              isOpen={showEswbsPopup}
              onClose2={() => setShowEswbsPopup(false)}
              onSelectCode={(code) => {
                setSelectedEswbs(code);
                setEswbsSearch(code);
                setShowEswbsPopup(false);
              }}
            />
          </>
        )}

        {/* --------------------- RESULTS MODE --------------------- */}
        {!addSpare && showResults && results && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[22px] font-semibold">{t("move_spare_part")}</h2>
              <button className="text-white text-xl cursor-pointer" onClick={resetModal}>
                ✕
              </button>
            </div>

            {/* PRODUCT INFO */}
            <div className="grid sm:grid-cols-3 gap-6 mb-4 mt-4">
              <Image src="/motor.jpg" width={160} height={160} alt="Motor" className="rounded-lg" />

              <div>
                <p className="text-[#789fd6] text-sm">Part Number</p>
                <p className="text-[18px] text-white">{results.Serial_number}</p>
              </div>

              <div>
                <p className="text-[#789fd6] text-sm">{t("part_name")}</p>
                <p className="text-[18px] text-white">{results.Part_name}</p>
              </div>
            </div>

            <MoveProductTable
              data={results}
              scanning={scanning}
              setScanning={setScanning}
              onDataChange={setResults}
              setActiveField={() => {}}
            />

            <button
              className="w-full bg-[#789fd6] p-3 text-white font-semibold mt-6 rounded-md"
              onClick={handleConfirm}
            >
              {t("confirm")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

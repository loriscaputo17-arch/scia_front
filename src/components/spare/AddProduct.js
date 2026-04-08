"use client";

import { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { saveScan } from "@/api/scan";
import Image from "next/image";
import FacilitiesModal from "./FacilitiesModal";
import { submitProduct, uploadProductImage } from "@/api/spare";
import { useUser } from "@/context/UserContext";
import { useTranslation } from "@/app/i18n";

export default function AddProduct({ onClose }) {
  const [scanning, setScanning] = useState(false);
  const [ean13, setEan13] = useState('');
  const [partNumber, setPartNumber] = useState('');
  const [originalName, setOriginalName] = useState('');
  const [plantComponent, setPlantComponent] = useState('');
  const [supplier, setSupplier] = useState('');
  const [supplierNcage, setSupplierNcage] = useState('');
  const [manufacturerNcage, setManufacturerNcage] = useState('');
  const [manufacturerPartNumber, setManufacturerPartNumber] = useState('');
  const [price, setPrice] = useState('');
  const [leadTime, setLeadTime] = useState('');
  const [description, setDescription] = useState('');
  const [warehouse, setWarehouse] = useState('');
  const [location, setLocation] = useState('');
  const [stock, setStock] = useState('1');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [facilitiesOpen, setFacilitiesOpen] = useState(false);

  const { user, selectedShipId: shipId } = useUser();

  const { t, i18n } = useTranslation("maintenance");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (scanning) {
      const scanner = new Html5QrcodeScanner("reader", {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      });

      scanner.render(
        async (decodedText) => {
          setLocation(decodedText);
          setScanning(false);
          alert(`Barcode scansionato: ${decodedText}`);

          try {
            await saveScan({
              scannedData: decodedText,
              scannedAt: new Date().toISOString(),
              scanId: null,
            });
          } catch (error) {
            console.error("Errore durante il salvataggio dello scan:", error);
          }
        },
        (error) => console.error("Errore scansione:", error)
      );

      return () => {
        scanner.clear().catch((error) => console.error("Errore nel pulire lo scanner", error));
      };
    }
  }, [scanning]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file); 
    }


    setImagePreview(URL.createObjectURL(file));
  };

  const handleConfirm = async () => {
    let imageUrl = null;

    if (image) {
      const formData = new FormData();
      formData.append("file", image); 
      formData.append("userId", user.id);
      formData.append("partNumber", partNumber);
      formData.append("originalName", originalName);

      const uploadRes = await uploadProductImage(formData, user.id);
      imageUrl = uploadRes.url; 
    }
    
    const payload = {
      ean13,
      partNumber,
      originalName,
      plantComponent,
      supplier,
      supplierNcage,
      manufacturerNcage,
      manufacturerPartNumber,
      price,
      ship_id: shipId,
      user_id: user.id,
      leadTime,
      description,
      warehouse,
      location,
      stock,
      image: imageUrl,
    };
  
    await submitProduct(payload);
  };

  useEffect(() => {
      setMounted(true);
    }, []);
      
   if (!mounted || !i18n.isInitialized) return null;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[22px] font-semibold">{t("insert_spare")}</h2>
        <button className="text-white text-xl cursor-pointer" onClick={onClose}>
          <svg width="24px" height="24px" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col">
          <label className="text-[#789FD6] text-sm mb-2">{t("product_image")}</label>
          <div
            onClick={() => document.getElementById('fileInput').click()}
            className="w-30 h-30 bg-[#ffffff10] rounded-md flex items-center justify-center cursor-pointer hover:bg-[#ffffff20] transition"
          >
            {imagePreview ? (
              <Image src={imagePreview} alt="Preview" width={200} height={200} className="object-cover rounded-md" />
            ) : (
              <svg fill="#789FD6" height="30" width="30" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M149.1 64.8L138.7 96 64 96C28.7 96 0 124.7 0 160L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-256c0-35.3-28.7-64-64-64l-74.7 0L362.9 64.8C356.4 45.2 338.1 32 317.4 32L194.6 32c-20.7 0-39 13.2-45.5 32.8zM256 192a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"/></svg>
            )}
          </div>
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>


        <div className="flex flex-col">
          <label className="text-[#789FD6] text-sm mb-2">{t("starting_quality")}</label>
          <input
            type="text"
            value={stock}
            placeholder="Scrivi qui..."
            onChange={(e) => setStock(e.target.value)}
            className="w-full px-4 py-2 bg-[#ffffff10] text-white focus:outline-none rounded-md"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col">
          <label className="text-[#789FD6] text-sm mb-2">Part Number</label>
          <input
            type="text"
            value={partNumber}
            placeholder="Scrivi qui..."
            onChange={(e) => setPartNumber(e.target.value)}
            className="px-4 py-2 bg-[#ffffff10] text-white focus:outline-none rounded-md"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-[#789FD6] text-sm mb-2">EAN13</label>
          <input
            type="text"
            value={ean13}
            onChange={(e) => setEan13(e.target.value)}
            placeholder="Scrivi qui..."
            className="w-full px-4 py-2 bg-[#ffffff10] text-white focus:outline-none rounded-md"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col">
          <label className="text-[#789FD6] text-sm mb-2">{t("original_name")}</label>
          <input
            type="text"
            value={originalName}
            placeholder="Scrivi qui..."
            onChange={(e) => setOriginalName(e.target.value)}
            className="px-4 py-2 bg-[#ffffff10] text-white focus:outline-none rounded-md"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-[#789FD6] text-sm mb-2">{t("system")}/{t("component")}</label>
          <div
            onClick={() => setFacilitiesOpen(true)}
            className="w-full px-4 py-2 bg-[#ffffff10] text-white focus:outline-none rounded-md flex cursor-pointer"
          >
            {t("select")} <span style={{marginLeft:'auto'}}>
              <svg fill="white" width="18px" height="18px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col">
          <label className="text-[#789FD6] text-sm mb-2">{t("supplier")}</label>
          <input
            type="text"
            value={supplier}
            placeholder="Scrivi qui..."
            onChange={(e) => setSupplier(e.target.value)}
            className="px-4 py-2 bg-[#ffffff10] text-white focus:outline-none rounded-md"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-[#789FD6] text-sm mb-2">NCAGE {t("supplier")}</label>
          <input
            type="text"
            value={supplierNcage}
            placeholder="Scrivi qui..."
            onChange={(e) => setSupplierNcage(e.target.value)}
            className="w-full px-4 py-2 bg-[#ffffff10] text-white focus:outline-none rounded-md"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col">
          <label className="text-[#789FD6] text-sm mb-2">NCAGE {t("supplier")}</label>
          <input
            type="text"
            value={manufacturerNcage}
            placeholder="Scrivi qui..."
            onChange={(e) => setManufacturerNcage(e.target.value)}
            className="px-4 py-2 bg-[#ffffff10] text-white focus:outline-none rounded-md"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-[#789FD6] text-sm mb-2">Part Number {t("costructor")}</label>
          <input
            type="text"
            value={manufacturerPartNumber}
            placeholder="Scrivi qui..."
            onChange={(e) => setManufacturerPartNumber(e.target.value)}
            className="w-full px-4 py-2 bg-[#ffffff10] text-white focus:outline-none rounded-md"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col">
          <label className="text-[#789FD6] text-sm mb-2">{t("price")}</label>
          <input
            type="text"
            value={price}
            placeholder="Scrivi qui..."
            onChange={(e) => setPrice(e.target.value)}
            className="px-4 py-2 bg-[#ffffff10] text-white focus:outline-none rounded-md"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-[#789FD6] text-sm mb-2">Lead Time</label>
          <input
            type="text"
            value={leadTime}
            placeholder="Scrivi qui..."
            onChange={(e) => setLeadTime(e.target.value)}
            className="w-full px-4 py-2 bg-[#ffffff10] text-white focus:outline-none rounded-md"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-4">
        <div className="flex flex-col">
          <label className="text-[#789FD6] text-sm mb-2">{t("description")}</label>
          <textarea
            value={description}
            placeholder="Scrivi qui..."
            onChange={(e) => setDescription(e.target.value)}
            className="px-4 py-2 bg-[#ffffff10] text-white focus:outline-none rounded-md"
          />
        </div>
      </div>

      <div className="mt-8 mb-8 px-4 py-4 rounded-lg flex items-center justify-between bg-[#e2d52d] gap-4 cursor-pointer" onClick={() => setScanning(true)}>
        <div className="flex items-center gap-2">
          <svg fill="#022a52" width="18px" height="18px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path d="M32 32C14.3 32 0 46.3 0 64v96c0 17.7 14.3 32 32 32s32-14.3 32-32V96h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H32zm32 320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7 14.3 32 32 32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H64v-64zm288-320c-17.7 0-32 14.3-32 32s14.3 32 32 32h64v64c0 17.7 14.3 32 32 32s32-14.3 32-32V64c0-17.7-14.3-32-32-32h-96zM448 352c0-17.7-14.3-32-32-32s-32 14.3-32 32v64h-64c-17.7 0-32 14.3-32 32s14.3 32 32 32h96c17.7 0 32-14.3 32-32v-96z"/>
          </svg>
          <h2 className="text-[#022a52] font-semibold">{t("scan_new_location")}</h2>
        </div>
      </div>

      {scanning && <div id="reader" className="w-full flex justify-center mt-4" />}

      <div className="grid grid-cols-3 gap-4 items-center">
        <div>
          <label className="text-[14px] text-[#789fd6] block mb-2">{t("warehouse")}</label>
          <input
            value={warehouse}
            onChange={(e) => setWarehouse(e.target.value)}
            className="bg-transparent border border-gray-400 rounded px-3 py-2 w-full"
          />
        </div>
        <div>
          <label className="text-[14px] text-[#789fd6] block mb-2">{t("new_location")}</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="bg-transparent border border-gray-400 rounded px-3 py-2 w-full text-white placeholder-gray-300"
          />
        </div>
        <div>
          <label className="text-[14px] text-[#789fd6] block mb-2">Stock</label>
          <input
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="bg-transparent border border-gray-400 rounded px-3 py-2 w-full text-center"
          />
        </div>
      </div>

      <button
        className="w-full bg-[#789fd6] p-3 text-white font-semibold mt-6 cursor-pointer rounded-md"
        onClick={handleConfirm}
      >
        {t("confirm")}
      </button>

    <FacilitiesModal isOpen={facilitiesOpen} onClose2={() => setFacilitiesOpen(false)} />
      
    </div>
  );
}

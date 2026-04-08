"use client";

import { useState } from "react";
import { addSpareToMaintenanceList } from "@/api/spare";
import { useTranslation } from "@/app/i18n";

export default function SpareModal({ onClose, maintenanceListId }) {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [partNumber, setPartNumber] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { t, i18n } = useTranslation("maintenance");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const spareData = {
        brand,
        model,
        part_number: partNumber,
        description,
        maintenanceList_id: maintenanceListId,
        };
        
    const result = await addSpareToMaintenanceList(maintenanceListId, spareData, imageFile);

    if (result) {
      alert(t("spare_added"));
      onClose();
    } else {
      alert(t("spare_not_added"));
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#000000ab] bg-opacity-50 z-2">
      <form
        onSubmit={handleSubmit}
        className="bg-[#022a52] sm:w-[70%] w-full p-5 rounded-md shadow-lg text-white"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[26px] font-semibold">{t("add_spare")}</h2>
          <button type="button" className="text-white text-xl cursor-pointer" onClick={onClose}>
            <svg
              width="24px"
              height="24px"
              fill="white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
            >
              <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
            </svg>
          </button>
        </div>

        <div>
          <div
            className={`bg-[#ffffff10] ${imagePreview ? "" : "p-8"} w-[fit-content] rounded-md mb-4 cursor-pointer`}
            onClick={() => document.getElementById("imageInput").click()}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Image Preview"
                className="w-[100px] h-[100px] object-cover rounded-md"
              />
            ) : (
              <svg
                fill="white"
                width="30px"
                height="30px"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M149.1 64.8L138.7 96 64 96C28.7 96 0 124.7 0 160L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-256c0-35.3-28.7-64-64-64l-74.7 0L362.9 64.8C356.4 45.2 338.1 32 317.4 32L194.6 32c-20.7 0-39 13.2-45.5 32.8zM256 192a96 96 0 1 1 0 192 96 96 0 1 1 0-192z" />
              </svg>
            )}
            <input
              type="file"
              accept="image/*"
              id="imageInput"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </div>

        <div className="block sm:grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-[#789FD6] text-sm">{t("brand")}</label>
            <input
              type="text"
              placeholder={t("write_here")}
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full px-4 py-2 bg-[#ffffff10] text-white focus:outline-none mt-2"
              required
            />
          </div>
          <div>
            <label className="text-[#789FD6] text-sm">{t("model")}</label>
            <input
              type="text"
              placeholder={t("write_here")}
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-4 py-2 bg-[#ffffff10] text-white focus:outline-none mt-2"
            />
          </div>
        </div>

        <div className="block sm:grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-[#789FD6] text-sm">Part Number</label>
            <input
              type="text"
              placeholder={t("write_here")}
              value={partNumber}
              onChange={(e) => setPartNumber(e.target.value)}
              className="w-full px-4 py-2 bg-[#ffffff10] text-white focus:outline-none mt-2"
              required
            />
          </div>

          <div>
            <label className="text-[#789FD6] text-sm">{t("description")}</label>
            <input
              type="text"
              placeholder={t("write_here")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 bg-[#ffffff10] text-white focus:outline-none mt-2"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#789fd6] px-3 py-4 rounded-md mt-4 text-white font-semibold cursor-pointer"
        >
          {t("save")}
        </button>
      </form>
    </div>
  );
}

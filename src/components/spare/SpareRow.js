"use client";

import { useState, useEffect, useRef } from "react";
import NotesModal from "./NotesModal";
import { useRouter } from "next/navigation";
import ElementIcon from "@/components/ElementIcon";
import Image from "next/image";
import { addProduct } from "@/api/cart";
import { useUser } from "@/context/UserContext";
import CartAdded from "@/components/spare/element/CartAdded";
import { getQuantitySum } from "@/utils/getQuantitySum";
import { useTranslation } from "@/app/i18n";

const SpareRow = ({ data }) => {
  const [cartAdded, setCartAdded] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const router = useRouter();
  const { user } = useUser();
  const { t, i18n } = useTranslation("maintenance");

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

  if (!i18n?.isInitialized) return null;

  const handleRowClick = () => {
    if (data?.ID) {
      router.push(`/dashboard/spare/${data.ID}`);
    }
  };

  const handleAddToCart = async () => {
    if (!data?.ID || !user?.id) return;

    try {
      await addProduct(data.ID, user.id, "1", "in_attesa");
      setCartAdded(true);
    } catch (error) {
      console.error("Errore nell'aggiungere il prodotto al carrello:", error);
    }
  };

  return (
    <div>
      {/* Desktop view */}
      <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] items-center border-b border-[#001c38] bg-[#022a52] cursor-pointer">
        {/* Part Name & ESWBS */}
        <div
          onClick={handleRowClick}
          className="border border-[#001c38] p-3 flex flex-col justify-center min-h-[60px]"
          style={{ height: "-webkit-fill-available" }}
        >
          <p className="text-white text-[18px] font-semibold truncate">
            {data?.Part_name
              ? data.Part_name.length > 30
                ? data.Part_name.slice(0, 28) + "..."
                : data.Part_name
              : "N/A"}
          </p>
          <p className="text-white/60 text-[16px] truncate">
            {data?.elementModel?.ESWBS_code && <ElementIcon elementId={data.elementModel.ESWBS_code} />}{" "}
            {data?.elementModel?.ESWBS_code ?? ""} {data?.elementModel?.LCN_name.slice(0, 28) ?? ""}
          </p>
        </div>

        <div
          onClick={handleRowClick}
          className="border border-[#001c38] p-3 text-center text-white justify-center flex flex-col items-center gap-2"
          style={{ height: "-webkit-fill-available" }}
        >
          <p className="text-[18px] text-white">
            {getQuantitySum(data?.installed_quantity ?? [])}
          </p>
        </div>

        {/* Quantity */}
        <div
          onClick={handleRowClick}
          className="border border-[#001c38] p-3 text-center text-white justify-center flex flex-col items-center gap-2"
          style={{ height: "-webkit-fill-available" }}
        >
          <p className="text-[18px] text-white">
            {getQuantitySum(data?.quantity ?? [])}
          </p>
        </div>

        {/* Locations */}
        <div
          className="border border-[#001c38] p-3 cursor-pointer justify-center flex flex-col items-center gap-2"
          style={{ height: "-webkit-fill-available" }}
        >
          {data?.locations?.length > 0 ? (
            data.locations.map((loc, index) => {
              const warehouse = data?.warehouses?.find(
                (w) => w?.id?.toString() === loc?.warehouse?.toString()
              );

              return (
                <div
                  key={index}
                  className="flex items-center justify-center gap-2"
                >
                  {warehouse?.icon_url ? (
                    <>
                      <Image
                        src={warehouse.icon_url}
                        alt="Position Icon"
                        width={20}
                        height={20}
                        className="inline-block opacity-60"
                      />
                      <span className="text-white/80">
                        {warehouse?.name ?? "Unnamed"}
                      </span>
                      <span className="text-white/60 text-[12px]">
                        &nbsp;({loc?.location ?? "N/A"})
                      </span>
                    </>
                  ) : (
                    <div className="text-white/60 text-xs">No Icon</div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-white/60 text-xs">No locations available</div>
          )}
        </div>

        {/* Part Number & NCAGE */}
        <div
          className="border border-[#001c38] p-3 text-center justify-center flex flex-col items-center gap-2"
          style={{ height: "-webkit-fill-available" }}
        >
          {data?.part?.Part_Number ? (
            <p>
              {data.part.Part_Number.length > 15
                ? data.part.Part_Number.slice(0, 15) + "..."
                : data.part.Part_Number}
            </p>
          ) : 
          <p>
              Not available
            </p>
          }
          <p className="text-white/60 text-[16px] text-sm truncate">
            {data?.part?.organizationCompanyNCAGE?.NCAGE_code ?? ""}
          </p>
        </div>

        {/* Cart Button */}
        <div
          className="border border-[#001c38] p-3 flex items-center justify-center gap-4"
          style={{ height: "-webkit-fill-available" }}
        >
          <div onClick={handleAddToCart} className="cursor-pointer">
            <svg
              width="16px"
              height="16px"
              fill="#fff"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 576 512"
            >
              <path d="M0 24C0 10.7 10.7 0 24 0L69.5 0c22 0 41.5 12.8 50.6 32l411 0c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3l-288.5 0 5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5L488 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-288.3 0c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5L24 48C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Mobile view */}
      <div className="flex sm:hidden flex-col px-4 mb-4 rounded-md bg-[#022a52] cursor-pointer">
        <div
          onClick={handleRowClick}
          className="pl-3 pt-3 flex flex-col justify-center"
        >
          <p className="text-white text-[18px] font-semibold truncate">
            {data?.Part_name ?? "N/A"}
          </p>

          {data?.eswbs && (
            <p className="text-white/60 text-[16px] truncate">
              <ElementIcon elementId={data?.element_model_id} />{" "}
              {data.eswbs ?? ""} {data?.system_description ?? ""}
            </p>
          )}
        </div>

        <div className="flex items-center mt-3">
          {/* Quantity */}
          <div
            onClick={handleRowClick}
            className="px-3 text-center text-white flex flex-col items-center gap-2"
          >
            <p className="text-[18px]">{getQuantitySum(data?.quantity ?? [])}</p>
          </div>

          <div className="text-[#ffffff60] px-2">|</div>

          {/* Locations */}
          <div className="px-3 flex items-center gap-2 flex-wrap max-w-[120px]">
            {data?.locations?.length > 0 ? (
              data.locations.map((loc, index) => {
                const warehouse = data?.warehouses?.find(
                  (w) => w?.id?.toString() === loc?.warehouse?.toString()
                );

                return (
                  <div
                    key={index}
                    className="flex items-center justify-center gap-2"
                  >
                    {warehouse?.icon_url ? (
                      <Image
                        src={warehouse.icon_url}
                        alt="Position Icon"
                        width={20}
                        height={20}
                        className="inline-block opacity-60"
                      />
                    ) : (
                      <div className="text-white/60 text-xs">No Icon</div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-white/60 text-xs">No locations</div>
            )}
          </div>

          <div className="text-[#ffffff60] px-2">|</div>

          {/* Serial */}
          <div className="px-3 text-center flex flex-col items-center gap-2 max-w-[80px] truncate">
            <p className="text-white truncate">
              {data?.Serial_number ?? "N/A"}
            </p>
          </div>
        </div>

        {/* Cart Button Mobile */}
        <div
          className="p-3 flex items-center justify-center gap-4 bg-[#ffffff10] rounded-md mt-4 cursor-pointer mb-4"
          onClick={handleAddToCart}
        >
          <svg
            width="24px"
            height="24px"
            fill="#fff"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 576 512"
          >
            <path d="M0 24C0 10.7 10.7 0 24 0L69.5 0c22 0 41.5 12.8 50.6 32l411 0c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3l-288.5 0 5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5L488 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-288.3 0c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5L24 48C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
          </svg>
          {t("add")}
        </div>
      </div>

      {/* Cart Added Popup */}
      {cartAdded && <CartAdded onClose={() => setCartAdded(false)} />}
    </div>
  );
};

export default SpareRow;

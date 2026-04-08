"use client"

import { useState, useEffect } from "react";
import DashboardHeader from "@/components/header/DashboardHeader";
import Breadcrumbs from "@/components/dashboard/Breadcrumbs";
import SpareDetails from "@/components/spare/element/SpareDetails";
import SpareInfo from "@/components/spare/element/SpareInfo";
import CartAdded from "@/components/spare/element/CartAdded";
import { useParams, useRouter } from "next/navigation";
import { fetchSpare } from "@/api/spare";
import { addProduct } from "@/api/cart";
import { useUser } from "@/context/UserContext";
import { useTranslation } from "@/app/i18n";

export default function SparePage({ params }) {
  const [cartAdded, setCartAdded] = useState(false);
  const [data, setData] = useState(false);
  const [loading, setLoading] = useState(true);

  const params2 = useParams();
  const ID = params2.elem;
  const { user } = useUser();

    const loadTasks = async () => {
      try {
        setLoading(true);
        const fetchedSpare = await fetchSpare(ID);
        
        setData(fetchedSpare);
      } catch (err) {
        setError("Errore nel recupero dei task");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      loadTasks();
    }, [ID]);

    const handleAddToCart = async () => {
      if (!data) return;
  
      try {
        const response = await addProduct(data[0].ID, user.id, "1", "in_attesa");
        setCartAdded(true);
      } catch (error) {
        console.error("Errore nell'aggiungere il prodotto al carrello:", error);
      }
    };
    
  const { t, i18n } = useTranslation("maintenance");
  if (!i18n.isInitialized) return null;

  return (
    <div className="flex flex-col bg-[#001c38] text-white p-4">
      <DashboardHeader />

      <div className="flex w-full items-center mt-4">
        <Breadcrumbs />
      </div>

      <div className="flex items-center pt-2 pb-4">
        <div className='flex items-center gap-4'>
          <h2 className="text-2xl font-bold">
            {data && data.length > 0 ? data[0].Part_name : t("name_not_available")}
          </h2>
        </div>

        <div className='ml-auto flex items-center gap-4 mr-4'>
          <button
            type="submit"
            onClick={handleAddToCart}
            className="rounded-md flex items-center bg-[#022a52] hover:bg-blue-500 text-white font-bold p-2 sm:py-1 sm:px-4 transition duration-200 cursor-pointer"
          >
            <svg width="16px" height="16px" fill="#fff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M0 24C0 10.7 10.7 0 24 0L69.5 0c22 0 41.5 12.8 50.6 32l411 0c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3l-288.5 0 5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5L488 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-288.3 0c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5L24 48C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/></svg>
            
            <span className="hidden sm:block">&nbsp;&nbsp; {t("add")}</span>
          </button>
        </div>
        {/*<div className='flex items-center gap-4'>
          <button
            type="submit"
            className="rounded-md flex items-center bg-[#789fd6] hover:bg-blue-500 text-white font-bold py-1 px-4 transition duration-200 cursor-pointer"
          >
            <svg width="16px" height="16px" fill="#fff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"/></svg>
            &nbsp;&nbsp; Push&Buy
          </button>
        </div>*/}
      </div>

      {cartAdded && (
        <CartAdded onClose={() => setCartAdded(false)} />
      )}

        <div className="sm:flex gap-4">
          <div className="w-full sm:w-3/4 space-y-4 bg-[#022a52] p-4 rounded-md sm:mb-0 mb-4">
            <div className="grid grid-cols-1 gap-4 px-2">
              <SpareDetails details={data} />
            </div>
          </div>

          <div className="w-full sm:w-1/4 bg-[#022a52] p-4 rounded-md">
            <SpareInfo details={data} />
          </div>
        </div>

    </div>
  );
}

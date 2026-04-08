import { useState, useEffect } from "react";
import CartRow from "./CartRow";
import { getCart } from "@/api/cart";
import { useUser } from "@/context/UserContext";
import { useTranslation } from "@/app/i18n";

const CartTable = () => {
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { user, selectedShipId: shipId } = useUser();


  const { t, i18n } = useTranslation("cart");
  const [mounted, setMounted] = useState(false);

  const getCartData = async () => {
    try {
      setLoading(true);
      const cartItems = await getCart(shipId, user?.id);

      setCartData(cartItems);
    } catch (err) {
      setError("Errore nel recupero dei task");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProduct = (spareId) => {
    setCartData(prev => prev.filter(item => item.Spare.ID !== spareId));
  };

  useEffect(() => {
    if (user) getCartData();
  }, [shipId, user]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!mounted || !i18n.isInitialized) return null;

  return (
    <div className="w-full mx-auto rounded-lg shadow-md">
      <div className="items-center flex mb-2">
        <h2 className="text-white text-2xl font-semibold flex items-center gap-2 py-2 ">
          {t("cart")}
        </h2>
      </div>

      <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] text-black/70 bg-white rounded-t-lg font-semibold">
        <p className="border border-[#022a52] p-3">{t("name")}</p>
        <p className="border border-[#022a52] p-3 text-center">{t("part_number")}</p>
        <p className="border border-[#022a52] p-3 text-center">{t("supplier")}</p>
        <p className="border border-[#022a52] p-3 text-center flex items-center" style={{justifyContent: "center"}}>
          {t("quantity")}
        </p>
        <p className="border border-[#022a52] p-3 text-center">{t("actions")}</p>
      </div>

      {cartData.map((product) => (
        <CartRow key={product.id} data={product} onRemove={handleRemoveProduct} />
      ))}

    </div>
  );
};

export default CartTable;

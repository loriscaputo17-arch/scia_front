import { useState } from "react";
import { updateProductQuantity } from "@/api/cart";

const QuantityControl = ({ quantity, spare_id }) => {
  const [quantityProduct, setQuantityProduct] = useState(quantity);
  const [loading, setLoading] = useState(false);

  const updateProduct = async (newQuantity) => {
    setLoading(true);
    try {
      await updateProductQuantity(spare_id, newQuantity);
    } catch (error) {
      console.error("Errore nell'aggiornamento della quantità:", error);
    } finally {
      setLoading(false);
    }
  };

  const decreaseQuantity = () => {
    if (quantityProduct > 1) {
      const newQuantity = quantityProduct - 1;
      setQuantityProduct(newQuantity);
      updateProduct(newQuantity);
    }
  };

  const increaseQuantity = () => {
    const newQuantity = quantityProduct + 1;
    setQuantityProduct(newQuantity);
    updateProduct(newQuantity);
  };

  return (
    <div
      className="border border-[#001c38] flex items-center justify-center"
      style={{ height: "-webkit-fill-available" }}
    >
      <button
        onClick={decreaseQuantity}
        disabled={loading}
        className="bg-[#000000] opacity-20 text-white font-bold px-4 py-2"
      >
        -
      </button>

      <div className="px-4 py-2 bg-[#ffffff20] text-white">
        {quantityProduct}
      </div>

      <button
        onClick={increaseQuantity}
        disabled={loading}
        className="bg-[#000000] opacity-20 text-white font-bold px-4 py-2"
      >
        +
      </button>
    </div>
  );
};

export default QuantityControl;

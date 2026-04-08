export function getQuantitySum(quantity) {
  if (!quantity) return 0;

  // se è già un numero
  if (typeof quantity === "number") return quantity;

  // se è un array
  if (Array.isArray(quantity)) {
    return quantity
      .map(q => parseFloat(q))
      .filter(q => !isNaN(q))
      .reduce((acc, q) => acc + q, 0);
  }

  // se è stringa "1,2,3"
  if (typeof quantity === "string") {
    return quantity
      .split(",")
      .map(q => parseFloat(q))
      .filter(q => !isNaN(q))
      .reduce((acc, q) => acc + q, 0);
  }

  return 0;
}
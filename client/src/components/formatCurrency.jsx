// utils/formatCurrency.js
export const formatCurrency = (value) => {
  if (value == null || isNaN(value)) return "Q 0.00";
  return new Intl.NumberFormat("es-GT", {
    style: "currency",
    currency: "GTQ",
  }).format(value);
};
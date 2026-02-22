// Utility functions for bill calculations

export const calculateTotal = (items) => {
  if (!items || items.length === 0) return 0;
  return items.reduce((sum, item) => sum + Number(item.cost), 0);
};

export const calculatePerPerson = (items, numberOfPeople) => {
  const total = calculateTotal(items);
  return numberOfPeople > 0 ? (total / numberOfPeople).toFixed(2) : "0.00";
};

export const getMostExpensiveItem = (items) => {
  if (!items || items.length === 0) return null;
  return items.reduce((max, item) => Number(item.cost) > Number(max.cost) ? item : max);
};
export const formatCurrency = (amount, currencySymbol = "£") => {
  const numAmount = Number(amount);
  const formattedAmount = isNaN(numAmount) ? "0.00" : numAmount.toFixed(2);
  return `${currencySymbol} ${formattedAmount}`;
};

export const formatNumber = (amount) => {
  const numAmount = Number(amount);
  return isNaN(numAmount) ? "0.00" : Number(numAmount).toFixed(2);
};
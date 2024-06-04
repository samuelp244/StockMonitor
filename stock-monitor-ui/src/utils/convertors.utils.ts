export const formatCurrency = (num: number): string => {
  if (Math.abs(num) < 1000) {
    return num.toString(); // No formatting for small numbers
  }

  const abbreviations = ["", "k", "M", "B", "T"];
  const placeholders = 1000,
    decimals = 1;

  let exponent = Math.floor(Math.log(Math.abs(num)) / Math.log(placeholders));
  let significant = (num / Math.pow(placeholders, exponent)).toFixed(decimals);
  let abbreviation = abbreviations[exponent];

  return significant + abbreviation;
};

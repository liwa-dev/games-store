import axios from "axios";

export async function convertCurrency(amount) {
  try {
    const response = await axios.get('https://open.er-api.com/v6/latest/USD');
    const USD_TO_TND_RATE = response.data.rates.TND+0.5;
    return convert(amount, USD_TO_TND_RATE);
  } catch (error) {
    console.error('Failed to fetch exchange rate:', error);
    // Fallback to a default rate if API call fails
    return convert(amount, 3.12);
  }
}

function convert(amount, rate) {
  const amountTND = amount * rate;
  return Math.round(amountTND * 100) / 100;
}
import axios from 'axios';

const baseUrl = 'http://localhost:4466/v1/transaction/quote/'; // URL do proxy no backend

export const fetchStockQuote = async (tradingCode: string): Promise<number> => {
  try {
    const response = await axios.get(`${baseUrl}${tradingCode}`);
    const quote = response.data.chart.result[0].meta.regularMarketPrice;
    return quote;
  } catch (error) {
    console.error('Erro ao buscar cotação:', error);
    throw error;
  }
};
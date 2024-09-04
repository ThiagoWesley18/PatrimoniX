import { PrismaClient} from '@prisma/client';
import { getTransactionByUser, stockQuote } from "../transactions/transactions.service";
import { getAtivo } from '../ativo/ativo.services';

const prisma = new PrismaClient();

export const setQuote = async (tradingCode:string, price:number)=> {
    if (!tradingCode || typeof price !== 'number') {
        throw new Error('Invalid input: tradingCode and price are required.');
    }
    return await prisma.quotes.upsert(
        {
            where: { tradingCode },
            update: { price },
            create: { tradingCode, price },
        });
  
}

export const getQuote = async (tradingCode: string) => {
    return await prisma.quotes.findUnique({ where: { tradingCode } });
}

export const deleteQuote = async (tradingCode: string) => {
    return await prisma.quotes.delete({ where: { tradingCode } });
}

export const updateStockQuotes = async (cpf: string) => {
    
    const transactions = await getTransactionByUser(cpf);
    if (!transactions || transactions.length === 0) {
        console.error('Nenhuma transação encontrada para o CPF:', cpf);
        return;
    }
    for (const transaction of transactions) {
        const ativo = await getAtivo(transaction.tradingCode);
        if (ativo && ativo.tipo === "Outros") continue;

        try {
            const quote = await stockQuote(transaction.tradingCode);
            const price = quote.data.chart.result[0].meta.regularMarketPrice;
            if (price) await setQuote(transaction.tradingCode, price as number);
        } catch (error) {
            console.error('Erro ao buscar cotação:', error);
        }
    }

};
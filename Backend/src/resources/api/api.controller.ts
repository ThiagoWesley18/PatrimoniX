
import { Request, Response} from "express";
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { getTransactionByUser, stockQuote } from "../transactions/transactions.service";
import { getAtivo } from "../ativo/ativo.services";
import { setQuote, getQuote, updateStockQuotes } from "./api.services";



const setStockQuote = async (req: Request, res: Response) => {
    const cpf = req.body.cpf;
    try {
        updateStockQuotes(cpf);
        res.status(StatusCodes.OK).json({ message: "Cotações criadas" });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
};

const setStockQuoteLabel = async (req: Request, res: Response) => {
    const tradingCode = req.params.label;
    try {
        const quote = await stockQuote(tradingCode);
        const price = quote.data.chart.result[0].meta.regularMarketPrice;
        if (price) await setQuote(tradingCode, price as number);
        res.status(StatusCodes.OK).json({ message: "Cotação atualizada com sucesso!" });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
}

const getQuotes = async (req: Request, res: Response) => {
    const cpf  = req.body.cpf;
    const quotes: { [tradingCode: string]: number } = {};
    const transactions = await getTransactionByUser(cpf);
    try {
        if (transactions) {
            for (const transaction of transactions) {
                const ativo = await getAtivo(transaction.tradingCode);
                if (ativo) {
                    if (ativo.tipo === "Outros") continue;
                }
                const quote = await getQuote(transaction.tradingCode);
                if(quote){
                    quotes[transaction.tradingCode] = Number(quote.price);
                }
                
            }
            res.status(StatusCodes.OK).json(quotes);
        }else{
            res.status(StatusCodes.NOT_FOUND).json(ReasonPhrases.NOT_FOUND);
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
}

const getQuoteLabel = async (req: Request, res: Response)  => {
    const tradingCode = req.params.label;
    try{
        const quote = await getQuote(tradingCode);
        if(quote){
            res.status(StatusCodes.OK).json(quote);
        }else{
            res.status(StatusCodes.NOT_FOUND).json(ReasonPhrases.NOT_FOUND);
        }
    }catch(error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
        
    
}
 

export default { setStockQuote, getQuotes, getQuoteLabel, setStockQuoteLabel };
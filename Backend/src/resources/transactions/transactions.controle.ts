import { Request, Response } from "express";
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { CreateTransactionDto, UpdateTransactionDto } from "./transactions.types";
import { getTransactions, createTransaction, updateTransaction, deleteTransaction, getTransaction, jaExiste, stockQuote, getTransactionAtivos } from "./transactions.service";
import { getAtivo } from "../ativo/ativo.services";
import { setQuote, updateStockQuotes } from "../api/api.services";

const index = async (req: Request, res: Response) => {
    try {
        const transactions = await getTransactions();
        res.status(StatusCodes.OK).json(transactions);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
};

const create = async (req: Request, res: Response) => {
    const transactionData = req.body as CreateTransactionDto;
    try {
        const newTransaction = await createTransaction(transactionData);
        const ativo = await getAtivo(newTransaction.tradingCode);
            if (ativo && ativo.tipo !== "Outros"){
                try {
                    const quote = await stockQuote(newTransaction.tradingCode);
                    const price = quote.data.chart.result[0].meta.regularMarketPrice;
                    if (price) await setQuote(newTransaction.tradingCode, price as number);
                } catch (error) {
                    console.error('Erro ao buscar cotação:', error);
                }
            } 
        res.status(StatusCodes.CREATED).json(newTransaction);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
};

const read = async (req: Request, res: Response) => {
    const { id } = req.params;
    
    try {
        const transaction = await getTransaction(id);
        if (!transaction) {
            return res.status(StatusCodes.NOT_FOUND).json(ReasonPhrases.NOT_FOUND);
        }
        return res.json(transaction)
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
};

const update = async (req: Request, res: Response) => {
    const { id } = req.params;
    const transactionData = req.body as UpdateTransactionDto;
    try {
        if (await jaExiste(id)) {
            const updatedTransaction = await updateTransaction(id, transactionData);
            res.status(StatusCodes.OK).json(updatedTransaction);
        }else{
            res.status(StatusCodes.NOT_FOUND).json(ReasonPhrases.NOT_FOUND);
        }
        
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
};

const remove = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        if(await jaExiste(id)){
        const deleteTransactionId = await deleteTransaction(id);
        if (req.session.uid) updateStockQuotes(req.session.uid);
        res.status(StatusCodes.OK).json(deleteTransactionId);
        }else{
            res.status(StatusCodes.NOT_FOUND).json(ReasonPhrases.NOT_FOUND);
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
}

const getStockQuote = async (req: Request, res: Response) => {
    const { tradingCode } = req.params;
    try {
      const response = await stockQuote(tradingCode);
      res.json(response.data);
    } catch (error) {
      console.error('Erro no proxy:', error);
      res.status(500).json({ message: 'Erro ao buscar cotação.' });
    }
}
const transactionAtivo = async (req: Request, res:Response) => {
    const {id} = req.params
    try{
        const tipados = await getTransactionAtivos(id);
        res.status(StatusCodes.OK).json(tipados);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
}

export default { index, create, read, update, remove, getStockQuote, transactionAtivo};

import { PrismaClient, Transaction} from '@prisma/client';
import { CreateTransactionDto, UpdateTransactionDto } from './transactions.types';
import axios from 'axios';

const prisma = new PrismaClient();

export const jaExiste = async (id: string): Promise<boolean> => {
  const transaçao = await prisma.transaction.findUnique({ where: { id } }); 
  if (transaçao){
      return true;
  }
  return false;
 }

export const getTransactions = async (): Promise<Transaction[]> => {
  return await prisma.transaction.findMany();
};

export const createTransaction = async (transaction: CreateTransactionDto): Promise<Transaction> => {
  return await prisma.transaction.create({
      data: transaction ,
  });
};

export const getTransaction = async (id: string): Promise<Transaction | null> => {
  return await prisma.transaction.findUnique({ where: { id } });
};

export const getTransactionByUser = async (userCpf: string): Promise<Transaction[] | null> => {
  return await prisma.transaction.findMany({ where: { userCpf } });
}

export const updateTransaction = async (id: string, transaction: UpdateTransactionDto): Promise<Transaction> => {
  return await prisma.transaction.update({
    where: { id: id },
    data: transaction,
  });
};

export const deleteTransaction = async (id: string): Promise<Transaction> => {
  return await prisma.transaction.delete({
    where: { id: id },
  });
};

export const deleteAllTransactions = async(id:string) =>{
  const user = await prisma.user.findUnique({where: {cpf:id}})
  
  return await prisma.transaction.deleteMany({
    where: {userCpf: user?.cpf}
  })
}

export const stockQuote = async (tradingCode: string) => {
  return await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${tradingCode}.SA`);
}

export const getTransactionAtivos = async (cpf: string) => {
  //return await prisma.ativo.findMany({where: {tipo: tipo}});
  return await prisma.transaction.findMany({
    where: {userCpf: cpf},
    include: {
      Ativo: true
    }
  })
}



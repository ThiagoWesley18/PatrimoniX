import { Transaction } from '@prisma/client';

export type CreateTransactionDto = Pick<Transaction, 'id' | 'tax' | 'executionDate' | 'transactionType' | 'quantity' | 'price' | 'totalValue' | 'userCpf' | 'tradingCode'>;

export type UpdateTransactionDto = Pick<Transaction, 'id' | 'tax' | 'executionDate' | 'transactionType' | 'quantity' | 'price' | 'totalValue' | 'userCpf' | 'tradingCode'>;

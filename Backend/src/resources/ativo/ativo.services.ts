import { PrismaClient, Ativo } from '@prisma/client';
import { CreateAtivoDto } from './ativo.types';
const prisma = new PrismaClient();

export const getAtivos = async () : Promise<Ativo[] | null> => {
    return await prisma.ativo.findMany();
};

export const getAtivo = async (tradingCode : string) : Promise<Ativo | null> => {
    return await prisma.ativo.findUnique({
      where: { tradingCode: tradingCode },
    });
};

export const createAtivo = async (data: CreateAtivoDto) => {
  return await prisma.ativo.create({data})
}

export const getTipoOutro = async (): Promise<Ativo[] | null> => {
  return await prisma.ativo.findMany({where: {tipo: "Outros"}});
}
import { Ativo, PrismaClient, Tipo_Ativo } from '@prisma/client';
import { CreateTipoAtivoDto } from './tipo_ativo.types';

const prisma = new PrismaClient();

export const jaExiste = async (tipo: string): Promise<boolean> => {
  const tipoAtivo = await prisma.tipo_Ativo.findFirst({ where: { tipo: tipo} }); 
  if (tipoAtivo){
      return true;
  }
  return false;
}

export const getTipoAtivos = async () : Promise<Tipo_Ativo[] | null> => {
    return await prisma.tipo_Ativo.findMany();
};

export const createTipoAtivo = async(data: CreateTipoAtivoDto) => {
  return await prisma.tipo_Ativo.create({data});
}

export const getTipoAtivo = async (tipo:string) : Promise<Tipo_Ativo | null> => {
    return await prisma.tipo_Ativo.findFirst({
      where: { tipo:tipo },
    });
};
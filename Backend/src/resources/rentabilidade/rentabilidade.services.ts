import { PrismaClient, Rentabilidade} from '@prisma/client';
import { CreateRentabilidadeDto } from './rentabilidade.types';

const prisma = new PrismaClient();

export const listRentabilidade = async (): Promise<Rentabilidade[]> => {
  return await prisma.rentabilidade.findMany();
};

export const createRentabilidade = async (rentabilidade: CreateRentabilidadeDto): Promise<Rentabilidade> => {
  return await prisma.rentabilidade.create({
      data: rentabilidade,
  });
};

export const getRentabilidadeByUser = async (cpf: string): Promise<Rentabilidade[] | null> => {
  return await prisma.rentabilidade.findMany({ where: { userCpf: cpf}});
};

export const deleteAllRentabilidadeByUser = async(id:string) =>{ 
  const user = await prisma.user.findUnique({where: {cpf:id}})
  return await prisma.rentabilidade.deleteMany({
    where: {userCpf: user?.cpf}
  });
}



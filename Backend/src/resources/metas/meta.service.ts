import { PrismaClient, Meta} from '@prisma/client';

const prisma = new PrismaClient();

export const jaExiste = async (cpf: string, nomeMeta: string): Promise<boolean> => {
    const meta = await prisma.meta.findFirst({ where: { nomeMeta:nomeMeta, userId:cpf } }); 
    if (meta){
        return true;
    }
    return false;
     }

export const createMeta = async (cpf: string, nome: string, valor: number, data: string): Promise<Meta> => {
  return await prisma.meta.create({
      data: {
            userId: cpf,
            nomeMeta: nome,
            meta: valor,
            dataMeta: data,
      },
  });
}

export const getMetas = async (cpf: string): Promise<Meta[] | null> => {
    return await prisma.meta.findMany({ 
      where:{
        User: {
            cpf: cpf
        }
      } 
    });
}

export const getMeta = async (cpf: string, nomeMeta: string): Promise<Meta | null> => {
    return await prisma.meta.findFirst({ where: { nomeMeta: nomeMeta, userId: cpf } });
}
export const updateMeta = async (id:string, valor: number, data: string): Promise<Meta> => {
  return await prisma.meta.update({
    where: {id: id},
    data: { meta: valor, dataMeta: data },
  });
}

export const deleteMeta = async (id:string): Promise<Meta> => {
  return await prisma.meta.delete({
    where: { id: id },
  });
}

import { PrismaClient, RespostaAtivo } from '@prisma/client';
import { UpdateRespostaAtivoDto } from './resposta_ativo.types';

const prisma = new PrismaClient();

export const getRespostasAtivo = async (): Promise<RespostaAtivo[] | null> => {
    const respostas = await prisma.respostaAtivo.findMany();
    return respostas;
};


export const getRespostaAtivoPorCodigo = async (
    ativoCodigo: string,
    perguntaId: number
): Promise<RespostaAtivo | null> => {
    return await prisma.respostaAtivo.findFirst({
        where: { ativoCodigo, perguntaId },
    });
};

export const createRespostaAtivo = async (data: RespostaAtivo) => {
    return await prisma.respostaAtivo.create({ data });
};

export const updateRespostaAtivo = async (
    ativoCodigo: string,
    perguntaId: number,
    data: UpdateRespostaAtivoDto
) => {
    return await prisma.respostaAtivo.upsert({
        where: { ativoCodigo_perguntaId: { ativoCodigo, perguntaId } },
        update: data,
        create: {
            ativoCodigo,
            perguntaId,
            resposta: data.resposta ?? false
        },
    });
};

export const deleteRespostaAtivo = async (ativoCodigo: string, perguntaId: number) => {
    return await prisma.respostaAtivo.deleteMany({
        where: { ativoCodigo, perguntaId },
    });
};
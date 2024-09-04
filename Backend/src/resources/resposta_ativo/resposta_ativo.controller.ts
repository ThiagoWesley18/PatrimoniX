import { PrismaClient } from "@prisma/client";
import { Request, Response } from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { updateRespostaAtivo, deleteRespostaAtivo } from './resposta_ativo.service';
import { UpdateRespostaAtivoDto } from './resposta_ativo.types';

const prisma = new PrismaClient();

const find = async (req: Request, res: Response) => {
    const where = req.query.where ? JSON.parse(req.query.where as string) : {};

    try {
        const respostasAtivo = await prisma.respostaAtivo.findMany({
            where,
        });
        res.status(StatusCodes.OK).json(respostasAtivo);
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Erro ao buscar respostas do ativo" });
    }
};
const create = async (req: Request, res: Response) => {
    const data = req.body;
    try {
        const respostaAtivo = await prisma.respostaAtivo.create({ data });
        res.status(StatusCodes.CREATED).json(respostaAtivo);
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Erro ao criar resposta do ativo" });
    }
};

const update = async (req: Request, res: Response) => {
    const { codigo, perguntaId } = req.params;
    const data = req.body as UpdateRespostaAtivoDto;

    try {
        await updateRespostaAtivo(codigo, Number(perguntaId), data);
        res.status(StatusCodes.OK).json(ReasonPhrases.OK);
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Erro ao atualizar resposta do ativo" });
    }
};

const remove = async (req: Request, res: Response) => {
    const { codigo, perguntaId } = req.params;

    try {
        await deleteRespostaAtivo(codigo, Number(perguntaId));
        res.status(StatusCodes.OK).json(ReasonPhrases.OK);
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Erro ao deletar resposta do ativo" });
    }
};

export default { find, create, update, remove };
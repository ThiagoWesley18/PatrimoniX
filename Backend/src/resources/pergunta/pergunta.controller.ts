import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const index = async (req: Request, res: Response) => {
    try {
        const perguntas = await prisma.pergunta.findMany();
        res.status(StatusCodes.OK).json(perguntas);
    } catch (error) {
        console.error(error);
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "Erro ao buscar perguntas" });
    }
};


const create = async (req: Request, res: Response) => {
    const { criterio, texto } = req.body;
    try {
        const pergunta = await prisma.pergunta.create({
            data: {
                criterio,
                texto,
            },
        });
        res.status(StatusCodes.CREATED).json(pergunta);
    } catch (error) {
        console.error(error);
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "Erro ao criar pergunta" });
    }
};

const update = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { criterio, texto } = req.body;
    try {
        const pergunta = await prisma.pergunta.update({
            where: { id: Number(id) },
            data: {
                criterio,
                texto,
            },
        });
        res.status(StatusCodes.OK).json(pergunta);
    } catch (error) {
        console.error(error);
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "Erro ao atualizar pergunta" });
    }
};

const deletePergunta = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.pergunta.delete({
            where: { id: Number(id) },
        });
        res.status(StatusCodes.OK).json({ message: "Pergunta excluída" });
    } catch (error) {
        console.error(error);
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "Erro ao excluir pergunta" });
    }
};

export default { index, create, update, delete: deletePergunta };
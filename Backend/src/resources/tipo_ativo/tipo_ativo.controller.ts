import { Request, Response } from "express";
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { getTipoAtivos, getTipoAtivo, createTipoAtivo, jaExiste } from "./tipo_ativo.services";
import { CreateTipoAtivoDto } from "./tipo_ativo.types";

const index = async (req: Request, res: Response) => {
    try {
        const tipoAtivos = await getTipoAtivos();
        res.status(StatusCodes.OK).json(tipoAtivos);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
};

const create = async (req: Request, res: Response) => {
    const tipoAtivoData = req.body as CreateTipoAtivoDto;
    const registered = await jaExiste(tipoAtivoData.tipo)

    if(!registered) {
        try {  
            const newTipoAtivo = await createTipoAtivo(tipoAtivoData);
            res.status(StatusCodes.CREATED).json(newTipoAtivo);
        } catch (error) {
            console.error(error);
            res
              .status(StatusCodes.INTERNAL_SERVER_ERROR)
              .json({ message: "Erro ao criar tipo de ativo" });
        }
    } else {
        res.status(StatusCodes.ACCEPTED).json(ReasonPhrases.ACCEPTED);
    }

};

const read = async (req: Request, res: Response) => {
    const { tipo } = req.params;
    try {
        const tipoAtivo = await getTipoAtivo(tipo);
        if (!tipoAtivo) {
            return res.status(StatusCodes.NOT_FOUND).json(ReasonPhrases.NOT_FOUND);
        }
        return res.json(tipoAtivo)
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
};

export default {index, create,read};
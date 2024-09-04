import { Request, Response } from "express";
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { getAtivos, getAtivo, getTipoOutro, createAtivo} from "./ativo.services";
import { createTipoAtivo, jaExiste } from "../tipo_ativo/tipo_ativo.services";
import { CreateAtivoDto } from "./ativo.types";
const index = async (req: Request, res: Response) => {
    try {
        const ativos = await getAtivos();
        res.status(StatusCodes.OK).json(ativos);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
};

const read = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const ativo = await getAtivo(id);
        if (!ativo) {
            return res.status(StatusCodes.NOT_FOUND).json(ReasonPhrases.NOT_FOUND);
        }
        return res.json(ativo)
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
};

const create = async (req: Request, res: Response) => {
    const ativoData = req.body as CreateAtivoDto;
    try {  
        const tipoRegistrado = await jaExiste(ativoData.tipo!);
        if (tipoRegistrado === true){
            await createAtivo(ativoData);
        } else {
            const newTipoAtivo = await createTipoAtivo({tipo: ativoData.tipo!})
            await createAtivo({...ativoData, tipo: newTipoAtivo.tipo});
        }
        res.status(StatusCodes.CREATED).json(ReasonPhrases.CREATED);
        
    } catch (error) {
        console.error(error);
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "Erro ao criar ativo" });
    }
};

const outros = async (req: Request, res:Response) => {
    try{
        const outros = await getTipoOutro();
        res.status(StatusCodes.OK).json(outros);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
}
export default {index, read, create, outros}
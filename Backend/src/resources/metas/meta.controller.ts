import { Request, Response } from "express";
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { metaDTO, deleteMetaDTO } from "./meta.types";
import { jaExiste, createMeta, updateMeta, getMetas, deleteMeta, getMeta } from "./meta.service";

const create = async (req: Request, res: Response) => {
    const { nomeMeta, meta, dataMeta } = req.body as metaDTO;
    try {
        if(!req.session.uid) return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Usuário não autenticado" });
        
        const cpf = req.session.uid;
        if (await jaExiste(cpf, nomeMeta as string)) return res.status(StatusCodes.CONFLICT).json({ message: "Meta já existe" });

        const dados = await createMeta(cpf, nomeMeta, meta, dataMeta );
        return res.status(StatusCodes.CREATED).json(dados);
        
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }
}

const getMetaAll = async (req: Request, res: Response) => {
    try {
        if (!req.session.uid) return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Usuário não autenticado" });
        const cpf = req.session.uid;
        const meta = await getMetas(cpf);
        if (!meta) return res.status(StatusCodes.NOT_FOUND).json({ message: "Metas não encontradas" });
        return res.status(StatusCodes.OK).json(meta);
        
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }
}

const update = async (req: Request, res: Response) => {
    const { nomeMeta, meta, dataMeta } = req.body as metaDTO;
    try {
        if(!req.session.uid) return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Usuário não autenticado" });
        const cpf = req.session.uid;

        const metaAtual = await getMeta(cpf, nomeMeta as string);

        if (!metaAtual) return res.status(StatusCodes.NOT_FOUND).json({ message: "Meta não encontrada" });
        const dados = await updateMeta(metaAtual.id, meta, dataMeta);
        return res.status(StatusCodes.OK).json(dados);
        
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }
}

const deleteMetaByName = async (req: Request, res: Response) => {
    const { nomeMeta } = req.body as deleteMetaDTO;
    try {
        if(!req.session.uid) return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Usuário não autenticado" });
        const cpf = req.session.uid;

        const metaAtual = await getMeta(cpf, nomeMeta as string);

        if (!metaAtual)  return res.status(StatusCodes.NOT_FOUND).json({ message: "Meta não encontrada" });

        const meta = await deleteMeta(metaAtual.id);
        return res.status(StatusCodes.OK).json(meta);
       
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }
}

export default { create, getMetaAll, update, deleteMetaByName };
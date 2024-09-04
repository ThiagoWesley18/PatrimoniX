import { Request, Response } from "express";
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

import { SubmitCreateChange } from "./changelog.types";
import {getChanges, createChange} from "./changelog.services";

const read = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const changes = await getChanges(Number(id));
        if (!changes) {
            return res.status(StatusCodes.NOT_FOUND).json(ReasonPhrases.NOT_FOUND);
        }
        return res.json(changes)
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
};

const create = async (req: Request, res: Response) => {
    const changelogData = req.body as SubmitCreateChange;
    try {
        for (let i = 0; i < changelogData.messages.length; i ++) {
            await createChange(changelogData.messages[i], changelogData.changelogId);
        }
        res.status(StatusCodes.CREATED).json(ReasonPhrases.CREATED);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
};

export default {read, create}
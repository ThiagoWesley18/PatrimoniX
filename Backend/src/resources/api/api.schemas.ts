import Joi from "joi";
import { setQuote } from "./api.services";

export const apiSchema = {
    setQuote: Joi.object({
        cpf: Joi.string().required()
    }),
};
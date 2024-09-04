import Joi from "joi";

export const rentabilidadeSchema = {
  create: Joi.object({
    userCpf: Joi.string().length(11).required(),
    month: Joi.string().required(),
    carteira: Joi.number().required(),
    cdi: Joi.number().required(),
    ibovespa: Joi.number().required(),
  }),
};

export default rentabilidadeSchema;
import Joi from "joi";

export const ReportSchema = {
  create: Joi.object({
    titulo: Joi.string().required(),
    localizacao: Joi.string().optional(),
    conteudo: Joi.string().required(),
    userCpf: Joi.string().required(),
    tipo: Joi.string().required()
  }),
};

export default ReportSchema;

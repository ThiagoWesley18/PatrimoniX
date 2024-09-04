import Joi from "joi";

export const transactionsSchema = {
  create: Joi.object({
    executionDate: Joi.date().required(),
    transactionType: Joi.string().valid('Compra', 'Venda').required(),
    userCpf: Joi.string().required(),
    tradingCode: Joi.string().required(),
    quantity: Joi.number().positive().integer().required(),
    price: Joi.number().positive().precision(2).required(),
    tax:  Joi.number().min(0).precision(2).required(),
    totalValue: Joi.number().positive().precision(2).required()
  }),
  update: Joi.object({
    executionDate: Joi.date().required(),
    transactionType: Joi.string().valid('Compra', 'Venda').required(),
    userCpf: Joi.string().required(),
    tradingCode: Joi.string().required(),
    quantity: Joi.number().positive().integer().required(),
    price: Joi.number().positive().precision(2).required(),
    tax:  Joi.number().min(0).precision(2).required(),
    totalValue: Joi.number().positive().precision(2).required()
  }).min(1)
};

export default transactionsSchema;

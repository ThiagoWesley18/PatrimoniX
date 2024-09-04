import Joi from "joi";

export const userSchema = {
  create: Joi.object({
    cpf: Joi.string().length(11).required(),
    name: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().length(11).required(),
  }),
};

export default userSchema;
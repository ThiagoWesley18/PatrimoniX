import Joi from "joi";

export const metaSchema = {
  setMeta: Joi.object({
    nomeMeta: Joi.string().required(),
    meta: Joi.number().positive().required(),
    dataMeta: Joi.string().required()
  }),
  deleteMeta: Joi.object({
    nomeMeta: Joi.string().required()
  }),
  getMeta: Joi.object({
    nomeMeta: Joi.string().required()
  })
};
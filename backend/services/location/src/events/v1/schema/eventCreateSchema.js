import Joi from "joi";

const eventCreateSchema = Joi.object({
  title: Joi.string().max(100).required(),
  description: Joi.string().optional(),
  date: Joi.date().required(),
  location: Joi.string().optional(),
  category: Joi.string().optional(),
});

export { eventCreateSchema };

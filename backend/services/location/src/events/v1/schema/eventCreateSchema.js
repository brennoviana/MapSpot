import Joi from "joi";

const eventCreateSchema = Joi.object({
  title: Joi.string().max(100).required(),
  description: Joi.string().optional(),
  date: Joi.date().required(),
  location: Joi.string().max(100).required(),
  category: Joi.string().max(50).required(),
});

export { eventCreateSchema };

import Joi from "joi";

const eventUpdateSchema = Joi.object({
  title: Joi.string().max(100).optional(),
  description: Joi.string().optional(),
  date: Joi.date().optional(),
  location: Joi.string().optional(),
  category: Joi.string().optional(),
});

export { eventUpdateSchema };

import Joi from "joi";

const eventUpdateSchema = Joi.object({
  title: Joi.string().max(100).optional(),
  description: Joi.string().max(200).optional(),
  date: Joi.date().optional(),
  location: Joi.string().max(400).optional(),
  category: Joi.string().max(50).optional(),
});

export { eventUpdateSchema };

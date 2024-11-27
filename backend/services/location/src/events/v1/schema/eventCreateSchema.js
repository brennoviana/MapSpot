import Joi from "joi";

const eventCreateSchema = Joi.object({
  name: Joi.string().max(100).required(),
  description: Joi.string().optional(),
  date: Joi.date().required(),
  location: Joi.string().optional(),
  ticketsAvailable: Joi.number().min(0).optional(),
  ticketPrice: Joi.number().min(0).optional(),
  organizer: Joi.string().optional(),
});

export { eventCreateSchema };

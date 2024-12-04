import Joi from "joi";

const eventUpdateSchema = Joi.object({
  title: Joi.string().max(100).optional(),
  description: Joi.string().optional(),
  date: Joi.date().optional(),
  location: Joi.string().optional(),
  ticketsAvailable: Joi.number().min(0).optional(),
  ticketPrice: Joi.number().min(0).optional(),
  organizer: Joi.string().optional(),
});

export { eventUpdateSchema };

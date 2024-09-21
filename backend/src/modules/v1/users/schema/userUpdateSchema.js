import Joi from "joi";

const userUpdateSchema = Joi.object({
  name: Joi.string().max(100).optional(),
  cpf: Joi.string().length(11).pattern(/^\d+$/).optional(),
  address: Joi.string().max(255).optional(),
  number: Joi.string().max(10).optional(),
  city: Joi.string().max(100).optional(),
  state: Joi.string().length(2).optional(),
  zipCode: Joi.string().length(8).pattern(/^\d+$/).optional(),
});

export { userUpdateSchema };

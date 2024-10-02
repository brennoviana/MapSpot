import Joi from "joi";

const userCreateSchema = Joi.object({
  email: Joi.string().max(100).required(),
  cpf: Joi.string().required(),
  zipCode: Joi.string().required(),
  username: Joi.string().max(100).required(),
  password: Joi.string().min(8).max(100).required(),
});

export { userCreateSchema };

import Joi from "joi";

const userUpdateSchema = Joi.object({
    email: Joi.string().max(100).optional(),
    username: Joi.string().max(100).optional(),
    cpf: Joi.string().optional(),
    password: Joi.string().min(8).max(100).optional(),
});

export { userUpdateSchema };

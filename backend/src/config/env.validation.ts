import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(4000),
  MONGO_URI: Joi.string().required(),
  FRONTEND_URL: Joi.string().default('http://localhost:4200'),
});

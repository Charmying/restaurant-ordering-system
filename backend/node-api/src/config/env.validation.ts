import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(4000),
  MONGO_URI: Joi.string().required(),
  FRONTEND_URL: Joi.string().default('http://localhost:4200'),
  JWT_ACCESS_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_ACCESS_EXPIRES_IN: Joi.string().default('24h'),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('30d'),
  SUPERADMIN_USERNAME: Joi.string().default('Charmy'),
  SUPERADMIN_PASSWORD: Joi.string().default('Charmying'),
  RESET_SUPERADMIN: Joi.boolean().default(false),
});

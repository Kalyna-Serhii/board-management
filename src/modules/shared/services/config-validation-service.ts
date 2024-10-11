import { Injectable } from '@nestjs/common'
import Joi from 'joi'

@Injectable()
export class ConfigValidationService {
  static createSchema(): Joi.ObjectSchema {
    return Joi.object({
      PORT: Joi.number().default(4000),
      API_URL: Joi.string().uri().default('http://localhost:4000'),

      MONGODB_URI: Joi.string().uri().required(),

      JWT_ACCESS_SECRET: Joi.string().required(),
      JWT_REFRESH_SECRET: Joi.string().required(),

      ENV_MODE: Joi.string()
        .valid('development', 'production')
        .default('development'),
    })
  }
}

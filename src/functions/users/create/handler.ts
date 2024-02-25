import { FromSchema } from 'json-schema-to-ts';
import { middyfy } from '../../../lib/middleware/middy/middify';
import { ResponseModel } from '../../../lib/middleware/middy/ResponseModel';
import { STATUS_CODE } from '../../../lib/http/statusCode';
import { RegistrationService } from 'src/lib/services/useCases/registrationService';

export const eventSchema = {
  type: 'object',
  properties: {
    pathParameters: {},
    body: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        age: {
          type: 'number',
        },
        email: {
          type: 'string',
        },
        password: {
          type: 'string',
        },
        passwordConfirmation: {
          type: 'string',
        },
      },
      required: ['name', 'age', 'email', 'password', 'passwordConfirmation'],
    },
  },
  required: ['body'],
} as const;

// request: eventSchema.property で型付けされている。
async function main(
  request: FromSchema<typeof eventSchema>,
): Promise<ResponseModel> {
  const registrationService = new RegistrationService();
  await registrationService.execute({
    name: request.body.name,
    age: request.body.age,
    email: request.body.email,
    password: request.body.password,
    passwordConfirmation: request.body.passwordConfirmation,
  });

  return {
    statusCode: STATUS_CODE.OK,
    body: {},
  };
}

// これがexportされるhandler
export const handler = middyfy({ eventSchema: eventSchema, handler: main });

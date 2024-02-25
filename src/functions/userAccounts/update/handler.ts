import { FromSchema } from 'json-schema-to-ts';
import { middyfy } from '../../../lib/middleware/middy/middify';
import { ResponseModel } from '../../../lib/middleware/middy/ResponseModel';
import { STATUS_CODE } from '../../../lib/http/statusCode';
import { UpdateUserAccountService } from '../../../lib/services/useCases/updateUserAccountService';

export const eventSchema = {
  type: 'object',
  properties: {
    pathParameters: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
        },
      },
      required: ['userId'],
    },
    body: {
      type: 'object',
      properties: {
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
      required: ['email', 'password', 'passwordConfirmation'],
    },
  },
  required: ['pathParameters', 'body'],
} as const;

// request: eventSchema.property で型付けされている。
async function main(
  request: FromSchema<typeof eventSchema>,
): Promise<ResponseModel> {
  const updateUserAccountService = new UpdateUserAccountService();
  const userAccount = await updateUserAccountService.execute({
    userAccountId: request.pathParameters.userId,
    email: request.body.email,
    password: request.body.password,
    passwordConfirmation: request.body.passwordConfirmation,
  });

  return {
    statusCode: STATUS_CODE.OK,
    body: {
      data: userAccount,
    },
  };
}

// これがexportされるhandler
export const handler = middyfy({ eventSchema: eventSchema, handler: main });

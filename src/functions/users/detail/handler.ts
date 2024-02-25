import { FromSchema } from 'json-schema-to-ts';
import { middyfy } from '../../../lib/middleware/middy/middify';
import { ResponseModel } from '../../../lib/middleware/middy/ResponseModel';
import { STATUS_CODE } from '../../../lib/http/statusCode';
import { UserService } from '../../../lib/services/userService';
import { NotFoundException } from '../../../lib/exceptions/NotFoundException';

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
  },
  required: ['pathParameters'],
} as const;

// request: eventSchema.property で型付けされている。
async function main(
  request: FromSchema<typeof eventSchema>,
): Promise<ResponseModel> {
  const userService = new UserService();

  // 自前で実装したい人はgetAsyncを直接使えば良い
  const user = await userService.findBy({ id: request.pathParameters.userId });

  if (user === undefined) {
    throw new NotFoundException(
      `Couldn't find User with ${request.pathParameters.userId}`,
    );
  }

  return {
    statusCode: STATUS_CODE.OK,
    body: {
      data: user,
    },
  };
}

// これがexportされるhandler
export const handler = middyfy({ eventSchema: eventSchema, handler: main });

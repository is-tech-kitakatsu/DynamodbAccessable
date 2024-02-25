import { FromSchema } from 'json-schema-to-ts';
import { middyfy } from '../../../lib/middleware/middy/middify';
import { ResponseModel } from '../../../lib/middleware/middy/ResponseModel';
import { STATUS_CODE } from '../../../lib/http/statusCode';
import { UserService } from '../../../lib/services/userService';
import { UnprocessableEntityException } from '../../../lib/exceptions/UnprocessableEntityException';
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
    body: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        age: {
          type: 'number',
        },
        status: {
          type: 'string',
        },
      },
      required: ['status'],
    },
  },
  required: ['pathParameters', 'body'],
} as const;

// request: eventSchema.property で型付けされている。
async function main(
  request: FromSchema<typeof eventSchema>,
): Promise<ResponseModel> {
  const userService = new UserService();
  const user = await userService.findBy({ id: request.pathParameters.userId });

  if (user === undefined) {
    throw new NotFoundException(
      `Couldn't find User with ${request.pathParameters.userId}`,
    );
  }

  user.assignAttribute({
    name: request.body.name,
    age: request.body.age,
    status: request.body.status,
  });

  const res = await userService.update(user);

  if (res.entity.hasError()) {
    throw new UnprocessableEntityException(undefined, user.errors);
  }

  return {
    statusCode: STATUS_CODE.OK,
    body: {
      data: res.entity,
    },
  };
}

// これがexportされるhandler
export const handler = middyfy({ eventSchema: eventSchema, handler: main });

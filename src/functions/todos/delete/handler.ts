import { FromSchema } from 'json-schema-to-ts';
import { middyfy } from '../../../lib/middleware/middy/middify';
import { ResponseModel } from '../../../lib/middleware/middy/ResponseModel';
import { STATUS_CODE } from '../../../lib/http/statusCode';
import { TodoService } from '../../../lib/services/todoService';
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
        createdAt: {
          type: 'number',
        },
      },
      required: ['userId', 'createdAt'],
    },
  },
  required: ['pathParameters'],
} as const;

// request: eventSchema.property で型付けされている。
async function main(
  request: FromSchema<typeof eventSchema>,
): Promise<ResponseModel> {
  const todoService = new TodoService();

  const todo = await todoService.findBy({ 
    userId: request.pathParameters.userId,
    createdAt: request.pathParameters.createdAt,
  });

  if (todo === undefined) {
    throw new NotFoundException(
      `Couldn't find Todo with ${request.pathParameters.createdAt}`,
    );
  }

  await todoService.delete(todo);

  return {
    statusCode: STATUS_CODE.NO_CONTENT,
    body: {
      data: undefined,
    },
  };
}

// これがexportされるhandler
export const handler = middyfy({ eventSchema: eventSchema, handler: main });

import { FromSchema } from 'json-schema-to-ts';
import { middyfy } from '../../../lib/middleware/middy/middify';
import { ResponseModel } from '../../../lib/middleware/middy/ResponseModel';
import { STATUS_CODE } from '../../../lib/http/statusCode';
import { TodoService } from '../../../lib/services/todoService';
import { UnprocessableEntityException } from '../../../lib/exceptions/UnprocessableEntityException';
import { DateTime } from 'luxon';
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
    body: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
        },
        describe: {
          type: 'string',
        },
        status: {
          enum: ['incomplete', 'done'],
        },
        doneAt: {
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

  todo.assignAttribute({
    title: request.body.title,
    describe: request.body.describe,
    status: request.body.status,
    doneAt: request.body.doneAt
      ? DateTime.fromISO(request.body.doneAt).toMillis()
      : undefined,
  });

  const res = await todoService.update(todo);

  if (res.response === undefined) {
    throw new UnprocessableEntityException(undefined, todo.errors);
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

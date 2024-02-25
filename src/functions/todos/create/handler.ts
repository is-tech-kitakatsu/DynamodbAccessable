import { FromSchema } from 'json-schema-to-ts';
import { middyfy } from '../../../lib/middleware/middy/middify';
import { ResponseModel } from '../../../lib/middleware/middy/ResponseModel';
import { STATUS_CODE } from '../../../lib/http/statusCode';
import { TodoService } from '../../../lib/services/todoService';
import { Todo } from '../../../lib/entities/todo';
import { UnprocessableEntityException } from '../../../lib/exceptions/UnprocessableEntityException';

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
        title: {
          type: 'string',
        },
        describe: {
          type: 'string',
        },
        status: {
          type: 'string',
          enum: ['incomplete', 'done'],
        },
      },
      required: ['status'],
    },
  },
  required: ['body', 'pathParameters'],
} as const;

// request: eventSchema.property で型付けされている。
async function main(
  request: FromSchema<typeof eventSchema>,
): Promise<ResponseModel> {
  // idに当たる引数をundefinedにするのはちょっと気持ち悪いけど、idは第一引数にいて欲しいので我慢する
  const todo = new Todo(
    undefined,
    request.pathParameters.userId,
    request.body.status,
    request.body.title,
    request.body.describe,
    undefined,
  );
  const todoService = new TodoService();
  const res = await todoService.create(todo);

  if (!res) {
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

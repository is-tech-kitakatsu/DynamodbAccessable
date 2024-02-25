jest.mock('src/lib/middleware/middy/middify.ts', () => ({
  middyfy: jest.fn((handler) => handler),
}));
import { handler } from 'src/functions/todos/update/handler';
import * as TodoRepositoryModule from 'src/lib/repositories/todoRepository';
import { STATUS_CODE } from 'src/lib/http/statusCode';
import { Todo } from 'src/lib/entities/todo';
import { DateTime } from 'luxon';
import { dynamodbClient } from 'src/lib/dynamodb/clients/dynamodb';
import { UnprocessableEntityException } from 'src/lib/exceptions/UnprocessableEntityException';

jest.mock("src/lib/repositories/todoRepository.ts")

describe('handler', () => {
  const now = DateTime.now()
  const spyNow = jest.spyOn(DateTime, 'now').mockImplementation(() => now);

  const todo = new Todo(
    '1',
    'userId',
    'done',
    'title',
    'describe',
    now.toMillis(),
    now.minus({ days: 2 }).toMillis(),
    now.minus({ days: 1 }).toMillis(),
  )
  const mockedDateTime = jest.mocked(DateTime)
  mockedDateTime.now.mockReturnValue(now)
  const todoRepository = new TodoRepositoryModule.TodoRepository(dynamodbClient)
  const spyOnTodoRepository = jest.spyOn(TodoRepositoryModule, 'TodoRepository').mockImplementation(() => todoRepository)
  const mockedTodoRepository = jest.mocked(todoRepository)
  mockedTodoRepository.getAsync.mockResolvedValue(todo)
  mockedTodoRepository.updateAsync.mockResolvedValue({})

  afterEach(() => {
    spyNow.mockClear()
    spyOnTodoRepository.mockClear()
  })

  test('正常系', async () => {
    const event: any = { // eslint-disable-line @typescript-eslint/no-explicit-any
      pathParameters: {
        userId: 'userId',
        createdAt: now.minus({ days: 2 }).toMillis(),
      },
      body: {
        status: 'incomplete',
        title: 'updated title',
        describe: 'updated describe',
        doneAt: undefined,
      }
    }
    const actual = await handler.handler(event)

    expect(actual).toEqual({
      statusCode: STATUS_CODE.OK,
      body: {
        data:
          new Todo(
            '1',
            'userId',
            'incomplete',
            'updated title',
            'updated describe',
            undefined,
            now.minus({ days: 2 }).toMillis(),
            now.toMillis(),
          )
      }
    })
  })

  test('バリデーションエラー', async () => {
    const event: any = { // eslint-disable-line @typescript-eslint/no-explicit-any
      pathParameters: {
        id: '1'
      },
      body: {
        status: 'incomplete',
        title: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        describe: 'updated describe',
        doneAt: undefined,
      }
    }
    await expect(handler.handler(event)).rejects.toThrow(UnprocessableEntityException);
  })
})
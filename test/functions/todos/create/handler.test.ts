jest.mock('src/lib/middleware/middy/middify.ts', () => ({
  middyfy: jest.fn((handler) => handler),
}));
import { handler } from 'src/functions/todos/create/handler';
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

  const mockedDateTime = jest.mocked(DateTime)
  mockedDateTime.now.mockReturnValue(now)
  const todoRepository = new TodoRepositoryModule.TodoRepository(dynamodbClient)
  const spyTodoRepository = jest.spyOn(TodoRepositoryModule, 'TodoRepository').mockImplementation(() => todoRepository)
  const mockedTodoRepository = jest.mocked(todoRepository)
  mockedTodoRepository.putAsync.mockResolvedValue({
    Attributes: {
      id: '1',
      createdAt: now.toMillis(),
      updatedAt: now.toMillis(),
    }
  })

  afterEach(() => {
    spyNow.mockReset();
    spyTodoRepository.mockReset();
  });

  test('正常系', async () => {
    const event: any = { // eslint-disable-line @typescript-eslint/no-explicit-any
      pathParameters: {
        userId: "id"
      },
      body: {
        status: 'incomplete',
        title: 'title',
        describe: 'describe',
      }
    }
    const actual = await handler.handler(event)

    expect(actual).toEqual({
      statusCode: STATUS_CODE.OK,
      body: {
        data:
          new Todo(
            '1',
            'id',
            'incomplete',
            'title',
            'describe',
            undefined,
            now.toMillis(),
            now.toMillis(),
          )
      }
    })
  })

  test('バリデーションエラー', async () => {
    const event: any = { // eslint-disable-line @typescript-eslint/no-explicit-any
      pathParameters: {
        userId: "id"
      },
      body: {
        status: 'incomplete',
        title: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        describe: 'describe',
        doneAt: now.toMillis(),
      }
    }
    await expect(handler.handler(event)).rejects.toThrow(UnprocessableEntityException);
  })
})
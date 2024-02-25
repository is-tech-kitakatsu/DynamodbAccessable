jest.mock('src/lib/middleware/middy/middify.ts', () => ({
  middyfy: jest.fn((handler) => handler),
}));
import { handler } from 'src/functions/todos/delete/handler';
import * as TodoRepositoryModule from 'src/lib/repositories/todoRepository';
import { STATUS_CODE } from 'src/lib/http/statusCode';
import { Todo } from 'src/lib/entities/todo';
import { DateTime } from 'luxon';
import { dynamodbClient } from 'src/lib/dynamodb/clients/dynamodb';

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
  const spyTodoRepository = jest.spyOn(TodoRepositoryModule, 'TodoRepository').mockImplementation(() => todoRepository)
  const mockedTodoRepository = jest.mocked(todoRepository)
  mockedTodoRepository.getAsync.mockResolvedValue(todo)
  mockedTodoRepository.deleteAsync.mockResolvedValue({})

  afterEach(() => {
    spyNow.mockReset();
    spyTodoRepository.mockReset();
  });

  const event: any = { // eslint-disable-line @typescript-eslint/no-explicit-any
    pathParameters: {
      createdAt: now.minus({ days: 2 }).toMillis(),
      userId: 'userId'
    },
  }

  test('正常系', async () => {
    const actual = await handler.handler(event)

    expect(actual).toEqual({
      statusCode: STATUS_CODE.NO_CONTENT,
      body: {
        data: undefined
      }
    })
  })
})
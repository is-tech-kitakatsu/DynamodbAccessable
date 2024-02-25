jest.mock('src/lib/middleware/middy/middify.ts', () => ({
  middyfy: jest.fn((handler) => handler),
}));
import { handler } from 'src/functions/todos/detail/handler';
import * as TodoRepositoryModule from 'src/lib/repositories/todoRepository';
import { STATUS_CODE } from 'src/lib/http/statusCode';
import { Todo } from 'src/lib/entities/todo';
import { DateTime } from 'luxon';
import { dynamodbClient } from 'src/lib/dynamodb/clients/dynamodb';

jest.mock("src/lib/repositories/todoRepository.ts")

describe('handler', () => {
  const todo = new Todo(
    '1',
    'userId',
    'done',
    'title',
    'describe',
    DateTime.now().toMillis(),
    DateTime.now().toMillis(),
    DateTime.now().toMillis(),
  )
  const todoRepository = new TodoRepositoryModule.TodoRepository(dynamodbClient)
  const spyTodoRepository = jest.spyOn(TodoRepositoryModule, 'TodoRepository').mockImplementation(() => todoRepository)
  const mockedTodoRepository = jest.mocked(todoRepository)
  mockedTodoRepository.getAsync.mockResolvedValue(todo)

  afterEach(() => {
    spyTodoRepository.mockReset();
  });

  const event: any = { // eslint-disable-line @typescript-eslint/no-explicit-any
    pathParameters: {
      userId: 'userId',
      createdAt: DateTime.now().toMillis(),
    }
  }

  test('正常系', async () => {
    const actual = await handler.handler(event)

    expect(actual).toEqual({
      statusCode: STATUS_CODE.OK,
      body: {
        data: todo,
      }
    })
  })
})
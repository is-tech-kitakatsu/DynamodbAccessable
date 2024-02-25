jest.mock('src/lib/middleware/middy/middify.ts', () => ({
  middyfy: jest.fn((handler) => handler),
}));
import { handler } from 'src/functions/todos/index/handler';
import * as TodoRepositoryModule from 'src/lib/repositories/todoRepository';
import { STATUS_CODE } from 'src/lib/http/statusCode';
import { TodoCollection } from 'src/lib/collections/todoCollection';
import { dynamodbClient } from 'src/lib/dynamodb/clients/dynamodb';
import { Todo } from 'src/lib/entities/todo';
import { DateTime } from 'luxon';

jest.mock("src/lib/repositories/todoRepository.ts")

describe('handler', () => {
  const now = DateTime.now()
  const todoCollection = new TodoCollection()
  todoCollection.add(
    new Todo(
      '1',
      'userId',
      'done',
      'title',
      'describe',
      now.toMillis(),
      now.minus({ days: 2 }).toMillis(),
      now.minus({ days: 1 }).toMillis(),
    )
  )
  const todoRepository = new TodoRepositoryModule.TodoRepository(dynamodbClient)
  const spyTodoRepository = jest.spyOn(TodoRepositoryModule, 'TodoRepository').mockImplementation(() => todoRepository)
  const mockedTodoRepository = jest.mocked(todoRepository)
  mockedTodoRepository.queryAsync.mockResolvedValue(todoCollection)

  afterEach(() => {
    spyTodoRepository.mockReset();
  });

  const event: any = { // eslint-disable-line @typescript-eslint/no-explicit-any
    pathParameters: {
      userId: 'userId'
    }
  }

  test('正常系', async () => {
    const actual = await handler.handler(event)

    expect(actual).toEqual({
      statusCode: STATUS_CODE.OK,
      body: {
        data: {
          todos: [...todoCollection],
        }
      }
    })
  })
})
jest.mock('src/lib/middleware/middy/middify.ts', () => ({
  middyfy: jest.fn((handler) => handler),
}));
import { handler } from 'src/functions/users/detail/handler';
import * as UserRepositoryModule from 'src/lib/repositories/userRepository';
import { STATUS_CODE } from 'src/lib/http/statusCode';
import { User, UserStatus } from 'src/lib/entities/user';
import { DateTime } from 'luxon';
import { dynamodbClient } from 'src/lib/dynamodb/clients/dynamodb';

jest.mock("src/lib/repositories/userRepository.ts")

describe('handler', () => {
  const user = new User(
    '1',
    'name',
    20,
    UserStatus.ACTIVE,
    DateTime.now().toMillis(),
    DateTime.now().toMillis(),
  )
  const userRepository = new UserRepositoryModule.UserRepository(dynamodbClient)
  const spyUserRepository = jest.spyOn(UserRepositoryModule, 'UserRepository').mockImplementation(() => userRepository)
  const mockedUserRepository = jest.mocked(userRepository)
  mockedUserRepository.getAsync.mockResolvedValue(user)

  afterEach(() => {
    spyUserRepository.mockReset();
  });

  const event: any = { // eslint-disable-line @typescript-eslint/no-explicit-any
    "pathParameters": '1'
  }

  test('正常系', async () => {
    const actual = await handler.handler(event)

    expect(actual).toEqual({
      statusCode: STATUS_CODE.OK,
      body: {
        data: user,
      }
    })
  })
})
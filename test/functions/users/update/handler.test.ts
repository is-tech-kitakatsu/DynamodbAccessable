jest.mock('src/lib/middleware/middy/middify.ts', () => ({
  middyfy: jest.fn((handler) => handler),
}));
import { handler } from 'src/functions/users/update/handler';
import { STATUS_CODE } from 'src/lib/http/statusCode';
import { User } from 'src/lib/entities/user';
import { UserStatus } from 'src/lib/entities/user';
import * as UserRepositoryModule from 'src/lib/repositories/userRepository'
import { DateTime } from 'luxon';
import { dynamodbClient } from 'src/lib/dynamodb/clients/dynamodb';
import { UnprocessableEntityException } from 'src/lib/exceptions/UnprocessableEntityException';
import { NotFoundException } from '../../../../src/lib/exceptions/NotFoundException';

describe('handler', () => {
  const now = DateTime.now()
  const spyNow = jest.spyOn(DateTime, 'now').mockImplementation(() => now);

  const user = new User(
    'id',
    'name',
    19,
    UserStatus.INACTIVE,
    now.minus({ days: 2 }).toMillis(),
    now.minus({ days: 1 }).toMillis(),
  )
  
  const mockedDateTime = jest.mocked(DateTime)
  mockedDateTime.now.mockReturnValue(now)
  const userRepository = new UserRepositoryModule.UserRepository(dynamodbClient)
  const spyOnUserRepository = jest.spyOn(UserRepositoryModule, 'UserRepository').mockImplementation(() => userRepository)

  afterEach(() => {
    spyNow.mockClear();
    spyOnUserRepository.mockClear();
  });

  describe('正常系', () => {
    const spyOnFindBy = jest.spyOn(userRepository, 'getAsync').mockResolvedValueOnce(user)
    const spyOnUpdateAsync = jest.spyOn(userRepository, 'updateAsync').mockResolvedValueOnce({})
    
    afterEach(() => {
      spyOnFindBy.mockClear();
      spyOnUpdateAsync.mockClear();
    })

    it('更新に成功すること', async () => {
      const event: any = { // eslint-disable-line @typescript-eslint/no-explicit-any
        pathParameters: {
          id: 'id',
        },
        body: {
          name: 'updated name',
          age: 20,
          status: UserStatus.ACTIVE
        }
      }
      const actual = await handler.handler(event)
      expect(actual).toEqual({
        statusCode: STATUS_CODE.OK,
        body: {
          data: new User(
            'id',
            'updated name',
            20,
            UserStatus.ACTIVE,
            now.minus({ days: 2 }).toMillis(),
            now.toMillis(),
          )
        }
      })
    })
  })

  describe('idに一致するレコードがない場合', () => {
    const spyOnFindBy = jest.spyOn(userRepository, 'getAsync').mockResolvedValueOnce(undefined)
    const spyOnUpdateAsync = jest.spyOn(userRepository, 'updateAsync').mockResolvedValueOnce({})
    
    afterEach(() => {
      spyOnFindBy.mockClear();
      spyOnUpdateAsync.mockClear();
    })

    it('例外を投げること', async () => {
      const event: any = { // eslint-disable-line @typescript-eslint/no-explicit-any
        pathParameters: {
          id: 'id'
        },
        body: {
          name: 'updated name',
          age: 20,
          status: UserStatus.ACTIVE
        }
      }
      await expect(handler.handler(event)).rejects.toThrow(NotFoundException);
    })
  })

  describe('バリデーションエラーの場合', () => {
    const spyOnFindBy = jest.spyOn(userRepository, 'getAsync').mockResolvedValueOnce(user)
    const spyOnUpdateAsync = jest.spyOn(userRepository, 'updateAsync').mockResolvedValueOnce({})
    
    afterEach(() => {
      spyOnFindBy.mockClear();
      spyOnUpdateAsync.mockClear();
    })

    it('更新に失敗すること', async () => {
      const event: any = { // eslint-disable-line @typescript-eslint/no-explicit-any
        pathParameters: {
          id: 'id'
        },
        body: {
          name: 'updated name',
          age: -1,
          status: UserStatus.ACTIVE
        }
      }
      await expect(handler.handler(event)).rejects.toThrow(UnprocessableEntityException);
    })
  })
})
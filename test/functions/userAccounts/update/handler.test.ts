jest.mock('src/lib/middleware/middy/middify.ts', () => ({
  middyfy: jest.fn((handler) => handler),
}));
import { handler } from 'src/functions/userAccounts/update/handler';
import * as UpdateUserAccountServiceModule from 'src/lib/services/useCases/updateUserAccountService';
import { STATUS_CODE } from 'src/lib/http/statusCode';
import { UpdateUserAccountService } from 'src/lib/services/useCases/updateUserAccountService';
import { UserAccount } from 'src/lib/entities/userAccount';
import bcrypt from 'bcryptjs';

describe('handler', () => {
  const userAccount = new UserAccount(
    'id',
    'test@example.com',
    'password',
    'userId',
  )
  const updateUserAccountService = new UpdateUserAccountService()
  const spyOnUpdateUserAccountService = jest.spyOn(UpdateUserAccountServiceModule, 'UpdateUserAccountService').mockImplementation(() => updateUserAccountService)
  const spyOnExecute = jest.spyOn(updateUserAccountService, 'execute').mockResolvedValue(userAccount)

  const spyOnHash = jest.spyOn(bcrypt, "hash").mockImplementation(() => "hashed password")

  afterEach(() => {
    spyOnUpdateUserAccountService.mockReset();
    spyOnHash.mockReset();
    spyOnExecute.mockReset();
  });

  it('正常系', async () => {
    const event: any = { // eslint-disable-line @typescript-eslint/no-explicit-any
      pathParameters: {
        userId: 'id',
      },
      body: {
        email: 'test@example.com',
        password: 'password',
        passwordConfirmation: 'password',
      }
    }
    const actual = await handler.handler(event)

    expect(spyOnExecute).toHaveBeenCalledWith({
      userAccountId: 'id',
      email: 'test@example.com',
      password: 'password',
      passwordConfirmation: 'password',
    })
    expect(actual).toEqual({
      statusCode: STATUS_CODE.OK,
      body: {
        data: userAccount
      }
    })
  })
})
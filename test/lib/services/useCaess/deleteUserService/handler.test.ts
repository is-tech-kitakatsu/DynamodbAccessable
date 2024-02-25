import { DeleteUserService } from "src/lib/services/useCases/deleteUserService";
import { UserAccountService } from "src/lib/services/userAccountService";
import { UserService } from "src/lib/services/userService";
import * as UserAccountServiceModule from "src/lib/services/userAccountService"
import * as UserServiceModule from "src/lib/services/userService"
import { DateTime } from "luxon";
import { User, UserStatus } from "src/lib/entities/user";
import { UserAccount } from "src/lib/entities/userAccount";

jest.mock('src/lib/middleware/middy/middify.ts', () => ({
  middyfy: jest.fn((handler) => handler),
}));

describe('handler', () => {
  const deleteUserService = new DeleteUserService()
  const userAccountService = new UserAccountService();
  const userService = new UserService();
  const user = new User(
    '1',
    'name',
    20,
    UserStatus.ACTIVE,
    DateTime.now().toMillis(),
    DateTime.now().toMillis(),
  )

  const userAccount = new UserAccount(
    'id',
    'test@example.com',
    'password',
    '1',
  )
  const spyOnUserAccountService = jest.spyOn(UserAccountServiceModule, 'UserAccountService').mockImplementation(() => userAccountService)
  const spyOnUserService = jest.spyOn(UserServiceModule, 'UserService').mockImplementation(() => userService)
  const spyOnUserAccountFindBy = jest.spyOn(userAccountService, 'findBy').mockResolvedValue(userAccount)
  const spyOnUserFindBy = jest.spyOn(userService, 'findBy').mockResolvedValue(user)
  const spyOnTransactWrite = jest.spyOn(userAccountService, 'transactWrite').mockResolvedValueOnce({})

  afterEach(() => {
    spyOnUserAccountService.mockReset();
    spyOnUserService.mockReset();
    spyOnUserAccountFindBy.mockReset();
    spyOnUserFindBy.mockReset();
    spyOnTransactWrite.mockReset();
  });

  it('正常系', async () => {
    await deleteUserService.execute({
      userId: userAccount.id as string
    })

    expect(spyOnTransactWrite).toHaveBeenCalledWith({
      TransactItems: [
        {
          Delete: {
            Key: {
              id: "id",
            },
            TableName: "userAccounts",
          },
        },
        {
          Delete: {
            Key: {
              id: "1",
            },
            TableName: "users",
          },
        },
      ],
    })
  })
})
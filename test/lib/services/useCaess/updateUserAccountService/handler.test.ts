import { UserAccountService } from "src/lib/services/userAccountService";
import * as UserAccountServiceModule from "src/lib/services/userAccountService"
import { dynamodbClient } from "src/lib/dynamodb/clients/dynamodb";
import { UserAccountRepository } from "src/lib/repositories/userAccountRepository";
import { DateTime } from "luxon";
import { UserAccount } from "src/lib/entities/userAccount";
import { UpdateUserAccountService } from "src/lib/services/useCases/updateUserAccountService";
import { UnprocessableEntityException } from "src/lib/exceptions/UnprocessableEntityException";
import bcrypt from 'bcryptjs';

jest.mock('src/lib/middleware/middy/middify.ts', () => ({
  middyfy: jest.fn((handler) => handler),
}));
const now = DateTime.now()
const spyNow = jest.spyOn(DateTime, 'now').mockImplementation(() => now);

describe('handler', () => {
  const userAccount = new UserAccount(
    'id',
    'test@example.com',
    'password',
    'userId',
    DateTime.local(2024, 1, 30).toMillis(),
    DateTime.local(2024, 1, 30).toMillis(),
  )

  const userAccountRepository = new UserAccountRepository(dynamodbClient)
  const userAccountService = new UserAccountService(userAccountRepository);
  const updateUserAccountService = new UpdateUserAccountService()

  const spyOnUserAccountService = jest.spyOn(UserAccountServiceModule, 'UserAccountService').mockImplementation(() => userAccountService)
  const spyOnUpdateAsync = jest.spyOn(userAccountRepository, "updateAsync").mockResolvedValue({})

  const spyOnHash = jest.spyOn(bcrypt, "hash").mockImplementation(() => "hashed password")

  afterEach(() => {
    spyOnUserAccountService.mockReset();
    spyOnUpdateAsync.mockReset();
    spyOnHash.mockReset();
    spyNow.mockReset();
  });

  describe('正常系', () => {
    const spyOnUserFindBy = jest.spyOn(userAccountService, 'findBy').mockResolvedValueOnce(userAccount)

    afterEach(() => {
      spyOnUserFindBy.mockReset();
    })

    it('アカウント情報が更新されること', async () => {
      const res = await updateUserAccountService.execute({
        userAccountId: "userAccountId",
        email: "updated@example.com",
        password: "updated password",
        passwordConfirmation: "updated password",
      })
  
      expect(res).toEqual(new UserAccount(
        "id",
        "updated@example.com",
        "hashed password",
        "userId",
        DateTime.local(2024, 1, 30).toMillis(),
        now.toMillis(),
      ))
    })
  })

  describe('パスワードが確認用と一致しない場合', () => {
    const spyOnUserFindBy = jest.spyOn(userAccountService, 'findBy').mockResolvedValueOnce(userAccount)

    afterEach(() => {
      spyOnUserFindBy.mockReset();
    })

    it('例外を投げること', async () => {
      await expect(updateUserAccountService.execute({
        userAccountId: "userAccountId",
        email: "updated@example.com",
        password: "updated password",
        passwordConfirmation: "invalid password",
      })).rejects.toThrow(UnprocessableEntityException)
    })
  })
})
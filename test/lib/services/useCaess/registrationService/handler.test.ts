import { RegistrationService } from "src/lib/services/useCases/registrationService";
import { UserAccountService } from "src/lib/services/userAccountService";
import { UserService } from "src/lib/services/userService";
import * as UserAccountServiceModule from "src/lib/services/userAccountService"
import * as UserServiceModule from "src/lib/services/userService"
import { UserRepository } from '../../../../../src/lib/repositories/userRepository';
import { dynamodbClient } from "src/lib/dynamodb/clients/dynamodb";
import { UserAccountRepository } from "src/lib/repositories/userAccountRepository";
import bcrypt from 'bcryptjs';
import { DateTime } from "luxon";

jest.mock('src/lib/middleware/middy/middify.ts', () => ({
  middyfy: jest.fn((handler) => handler),
}));
const now = DateTime.now()
const spyNow = jest.spyOn(DateTime, 'now').mockImplementation(() => now);

describe('handler', () => {
  const userRepository = new UserRepository(dynamodbClient)
  const userAccountRepository = new UserAccountRepository(dynamodbClient)
  const userService = new UserService(userRepository);
  const userAccountService = new UserAccountService(userAccountRepository);
  const registrationService = new RegistrationService()

  const spyOnUserService = jest.spyOn(UserServiceModule, 'UserService').mockImplementation(() => userService)
  const spyOnUserAccountService = jest.spyOn(UserAccountServiceModule, 'UserAccountService').mockImplementation(() => userAccountService)
  const spyOnUserGetSequence = jest.spyOn(userRepository, 'getSequence').mockResolvedValue("newUserId")
  const spyOnUserAccountGetSequence = jest.spyOn(userAccountRepository, 'getSequence').mockResolvedValue("newUesrAccountId")
  
  const spyOnTransactWrite = jest.spyOn(userService, 'transactWrite').mockResolvedValueOnce({})

  const spyOnHash = jest.spyOn(bcrypt, "hash").mockImplementation(() => "hashed password")

  afterEach(() => {
    spyOnUserService.mockReset();
    spyOnUserAccountService.mockReset();
    spyOnUserGetSequence.mockReset();
    spyOnUserAccountGetSequence.mockReset();
    spyOnTransactWrite.mockReset();
    spyOnHash.mockReset();
    spyNow.mockReset();
  });

  it('正常系', async () => {
    await registrationService.execute({
      name: "name",
      age: 10,
      email: "test@example.com",
      password: "password",
      passwordConfirmation: "password",
    })

    expect(spyOnTransactWrite).toHaveBeenCalledWith({
      TransactItems: [
        {
          Put: {
            Item: {
              createdAt: now.toMillis(),
              email: "test@example.com",
              id: "newUesrAccountId",
              password: "hashed password",
              updatedAt: now.toMillis(),
              userId: "newUserId",
            },
            TableName: "userAccounts",
          },
        },
        {
          Put: {
            Item: {
              age: 10,
              createdAt: now.toMillis(),
              id: "newUserId",
              name: "name",
              status: "active",
              updatedAt: now.toMillis(),
            },
            TableName: "users",
          },
        },
      ],
    })
  })
})
import { UserAccountService } from '../userAccountService';
import { UserService } from '../userService';
import { NotFoundException } from 'src/lib/exceptions/NotFoundException';

interface IDeleteUserAccountParams {
  userId: string;
}

// 確認用メールの送信なども含めそうなのでServiceクラスとして実装する
export class DeleteUserService {
  public async execute(params: IDeleteUserAccountParams): Promise<void> {
    const userAccountService = new UserAccountService();
    const userService = new UserService();
    const user = await userService.findBy({ id: params.userId });

    const userAccount = await userAccountService.findBy({
      userId: user?.id,
    });

    if (user === undefined || userAccount === undefined) {
      throw new NotFoundException(`Couldn't find User with ${params.userId}`);
    }

    const userAccountDeleteQuery = userAccountService.buildDeleteQuery(userAccount);
    const userDeleteQuery = userService.buildDeleteQuery(user);

    await userAccountService.transactWrite(
      {
        TransactItems: [
          {
            Delete: userAccountDeleteQuery,
          },
          {
            Delete: userDeleteQuery,
          },
        ],
      }
    )
  }
}

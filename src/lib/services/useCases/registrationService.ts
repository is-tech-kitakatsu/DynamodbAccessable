import { UserAccount } from 'src/lib/entities/userAccount';
import { UserAccountService } from '../userAccountService';
import { UnprocessableEntityException } from 'src/lib/exceptions/UnprocessableEntityException';
import { UserService } from '../userService';
import { User } from 'src/lib/entities/user';
import { UserStatus } from '../../entities/user';
import bcrypt from 'bcryptjs';

interface IRegistrationParams {
  name: string;
  age: number;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export class RegistrationService {
  public errors: Record<string, string>[]

  constructor() {
    this.errors = []
  }

  public async execute(params: IRegistrationParams): Promise<void> {
    if (params.password !== params.passwordConfirmation) {
      throw new UnprocessableEntityException('確認用のパスワードが違います');
    }

    const hashedPassword = await bcrypt.hash(params.password, User.saltRound)

    const user = new User(
      undefined,
      params.name,
      params.age,
      UserStatus.ACTIVE,
    );
    this.validate(user);
    const userService = new UserService();
    const userPutQuery = await userService.buildPutQuery(user);

    const userAccount = new UserAccount(
      undefined,
      params.email,
      hashedPassword,
      userPutQuery.Item.id as string,
    );
    this.validate(userAccount);

    if (this.errors.length > 0) {
      throw new UnprocessableEntityException('入力値が不正です', this.errors);
    }

    const userAccountService = new UserAccountService();
    const userAccountPutQuery =
      await userAccountService.buildPutQuery(userAccount);

    // transactionに関してはsdkをラップせず使って良さそう
    // 代わりに各Queryの生成だけは自前の実装で簡素化してあげる
    await userService
      .transactWrite({
        TransactItems: [
          {
            Put: userAccountPutQuery,
          },
          {
            Put: userPutQuery,
          },
        ],
      });
  }

  private validate(object: User | UserAccount): void {
    object.validate();
    this.errors.push(...object.errors);
  }
}

import { EntityBase } from '../dynamodb/entities/entityBase';

// このディレクトリにはdynamo依存しないクラスも存在させることを許す
// dynamo依存させるときはEntityBaseを継承すれば良い
export class UserAccount extends EntityBase {
  constructor(
    public id: string | undefined,
    public email: string,
    public password: string,
    public userId: string,
    public createdAt?: number | undefined,
    public updatedAt?: number | undefined,
  ) {
    super(id, createdAt, updatedAt);
    this.email = email;
    this.password = password;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // eslint-disable-line @typescript-eslint/no-explicit-any
  getKey(): Record<
    string,
    any // eslint-disable-line @typescript-eslint/no-explicit-any
  > {
    return {
      userId: this.userId,
    }
  }

  validate() {
    // check presence
    const requiredAttrs: (keyof UserAccount)[] = [
      'email',
      'password',
      'userId',
    ];
    requiredAttrs.forEach((attr) => {
      if (!this[attr]) {
        this.errors.push({ [attr]: '入力してください' });
      }
    });

    return !this.hasError();
  }
}

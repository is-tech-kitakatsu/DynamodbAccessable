import { EntityBase } from '../dynamodb/entities/entityBase';

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

// このディレクトリにはdynamo依存しないクラスも存在させることを許す
// dynamo依存させるときはEntityBaseを継承すれば良い
export class User extends EntityBase {
  constructor(
    public id: string | undefined,
    public name: string,
    public age: number,
    public status: UserStatus,
    public createdAt?: number | undefined,
    public updatedAt?: number | undefined,
  ) {
    super(id, createdAt, updatedAt);
    this.name = name;
    this.status = status;
    this.age = age;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static saltRound: number = 10;

  // eslint-disable-line @typescript-eslint/no-explicit-any
  getKey(): Record<
    string,
    any // eslint-disable-line @typescript-eslint/no-explicit-any
  > {
    return {
      id: this.id,
    }
  }

  validate() {
    // check presence
    const requiredAttrs: (keyof User)[] = ['name', 'status', 'age'];
    requiredAttrs.forEach((attr) => {
      if (!this[attr]) {
        this.errors.push({ [attr]: '入力してください' });
      }
    });

    if (this.age < 1) {
      this.errors.push({ age: '年齢は0より大きい値で入力してください' });
    }

    return this.errors.length === 0;
  }
}

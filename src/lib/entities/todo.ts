import { EntityBase } from '../dynamodb/entities/entityBase';

export type Status = 'incomplete' | 'done';

// このディレクトリにはdynamo依存しないクラスも存在させることを許す
// dynamo依存させるときはEntityBaseを継承すれば良い
export class Todo extends EntityBase {
  constructor(
    public id: string | undefined,
    public userId: string,
    public status: Status,
    public title?: string,
    public describe?: string,
    public doneAt?: number,
    public createdAt?: number | undefined,
    public updatedAt?: number | undefined,
  ) {
    super(id, createdAt, updatedAt);
    this.userId = userId;
    this.status = status;
    this.title = title;
    this.describe = describe;
    this.doneAt = doneAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  getKey(): Record<
    string, 
    any // eslint-disable-line @typescript-eslint/no-explicit-any
  > {
    return {
      userId: this.userId,
      createdAt: this.createdAt
    }
  }

  validate() {
    if (this.title && this.title.length > 100) {
      this.errors.push({ title: '100文字以上は入力できません' });
    }

    // check presence
    const requiredAttrs: (keyof Todo)[] = ['status', 'userId'];
    requiredAttrs.forEach((attr) => {
      if (!this[attr]) {
        this.errors.push({ [attr]: '入力してください' });
      }
    });

    return !this.hasError();
  }
}

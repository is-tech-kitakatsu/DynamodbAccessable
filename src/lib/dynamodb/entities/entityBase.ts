import { InvalidAttributeException } from '../exceptions/InvalidAttributeException';
import { getClassProperties } from '../utility/getClassProperties';
// https://blog.serverworks.co.jp/dynamodb-cheatsheet
export interface IEntityBase {
  readonly id: string | undefined;
  readonly createdAt?: number;
  readonly updatedAt?: number;
}

// 本当はIEntityBaseから引いてきたかったが一旦これで
// これらは自動生成する値の前提なので実装のロジックによって変わらないようにすること
const UNMUTABLE_ATTRS = ['id', 'createdAt', 'updatedAt'];

// keyはジェネリクスのkeyに依存させたかった
type Error = Record<string, string>;

export abstract class EntityBase implements IEntityBase {
  public errors: Error[];

  constructor(
    public id: string | undefined,
    public createdAt?: number | undefined,
    public updatedAt?: number | undefined,
  ) {
    this.errors = [];
  }

  abstract validate(): boolean;
  abstract getKey(): Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any

  idPersisted(): boolean {
    return !!this.id;
  }

  hasError(): boolean {
    return this.errors.length > 0;
  }

  assignAttribute(attr: object): void {
    const targetProperties = getClassProperties(this);
    const attrKeys = Object.keys(attr);

    // 更新内容のプロパティが更新対象のオブジェクトのプロパティの一覧に含まれているかチェック
    // 16行目からasを利用するのでここでチェックをいれる
    attrKeys.forEach((key) => {
      if (!targetProperties.includes(key)) {
        throw new InvalidAttributeException(`attr: ${key}`);
      }
    });

    // オブジェクトの値更新
    attrKeys.forEach((key) => {
      if (!UNMUTABLE_ATTRS.includes(key)) {
        this[key as keyof typeof this] = attr[key as keyof typeof attr];
      }
    });
  }
}

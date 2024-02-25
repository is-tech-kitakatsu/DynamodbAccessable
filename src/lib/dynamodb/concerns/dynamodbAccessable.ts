import { EntityBase } from '../entities/entityBase';
import {
  GetItemInputBase,
  DeleteItemInputBase,
  UpdateItemInputBase,
  PutItemInputBase,
  QueryInputBase,
} from '../conditions';
import { CollectionBase } from '../collections/collectionBase';
import { RepositoryBase } from '../repositories/repositoryBase';
import { KeyNullException } from '../exceptions/keyNullException';
import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { getAttributes } from '../utility/getAttributes';
import { ServiceBase } from '../services/serviceBase';
import { DateTime } from 'luxon';
import { Constructor } from './Constructor';
import { PutItemInput, DeleteItemInput, TransactWriteItemsInput, TransactWriteItemsOutput } from 'aws-sdk/clients/dynamodb';

type Item = {
  [key: string]: AttributeValue;
};

// テーブルと対になるクラスオブジェクトからDynamoDBの操作インターフェースを提供するモジュール
// Serviceクラスにmixinして使う
// ジェネリクスの依存関係の都合でService層での実装になり、constructorがrepositoryとentityの2つ引数を取るが
// entityのプロパティをそのままDBに反映させる使いやすさを目指したのでこれで割り切ることにする
export function DynamodbAccessable<
  TEntity extends EntityBase,
  TCollection extends CollectionBase<TEntity>,
  TRepository extends RepositoryBase<TEntity, TCollection>,
>(Base: Constructor<ServiceBase<TEntity, TCollection, TRepository>>) {
  return class extends Base {
    async findBy(
      key: AWS.DynamoDB.DocumentClient.Key,
    ): Promise<TEntity | undefined> {
      const condition = {
        Key: key,
      } as GetItemInputBase;

      return await this.repository.getAsync(condition);
    }

    async findAllBy(
      params: Record<string, AWS.DynamoDB.DocumentClient.AttributeValue>,
      opt?: Omit<QueryInputBase, 'KeyConditionExpression' | 'ExpressionAttributeValues' | 'ExpressionAttributeNames'>
    ) {
      let keyConditionExpression = ''
      const expressionAttributeValues: [string, AttributeValue][] = []
      Object.entries(params).forEach(([key, value]) => {
        keyConditionExpression = keyConditionExpression + `${key} = :${key}, `
        expressionAttributeValues.push([`:${key}`, value])
      })

      const condition = {
        KeyConditionExpression: keyConditionExpression.slice(0, -2),
        ExpressionAttributeValues: Object.fromEntries(expressionAttributeValues)
        , ...opt}
      return await this.repository.queryAsync(condition);
    }

    async create(
      entity: TEntity,
    ): Promise<
      | { response: AWS.DynamoDB.DocumentClient.PutItemOutput; entity: TEntity }
      | undefined
    > {
      if (!entity.validate()) {
        return undefined; // ここでthis.errorsにはエラーが入る想定なので呼び出し側で条件分なりでハンドルする
      }

      const attr = getAttributes(entity);
      delete attr.id;
      delete attr.errors;

      const condition = {
        Item: attr,
      } as PutItemInputBase;

      const response = await this.repository.putAsync(condition);

      entity.id = response.Attributes?.id;
      entity.createdAt = response.Attributes?.createdAt;
      entity.updatedAt = response.Attributes?.updatedAt;

      return { response, entity };
    }

    async update(
      entity: TEntity,
      customCondition?: UpdateItemInputBase,
    ): Promise<{
      response: AWS.DynamoDB.DocumentClient.UpdateItemOutput | undefined;
      entity: TEntity;
    }> {
      if (entity.id === undefined) {
        throw new KeyNullException('idがセットされていません。');
      }

      if (!entity.validate()) {
        return {
          response: undefined,
          entity: entity,
        }; // ここでthis.errorsにはエラーが入る想定なので呼び出し側で条件分なりでハンドルする
      }

      entity.updatedAt = DateTime.now().toMillis();
      // オブジェクトの現在のプロパティ値をそのまま全部使ってクエリを生成する
      // DBと同じ値だったとしても影響はないはず
      // 変更部分だけのクエリを用途ごとに実装しなくても良くなるはずなのでこれで良く、デフォルトが嫌なら自前でクエリを生成すれば良い。
      const buildDefaultUpdateQuery = (
        entity: TEntity,
      ): {
        UpdateExpression: string;
        ExpressionAttributeNames: AWS.DynamoDB.DocumentClient.ExpressionAttributeNameMap;
        ExpressionAttributeValues: AWS.DynamoDB.DocumentClient.ExpressionAttributeValueMap;
      } => {
        const attrs = getAttributes(entity);

        // id,createdAt,updatedAtはライブラリ側で制御するので実装による変更は認めない
        delete attrs.id;
        delete attrs.createdAt;
        delete attrs.errors;
        // シンプルもしくは複合キーに設定した属性値は更新不可なので弾く
        Object.keys(entity.getKey()).forEach((key) => {
          delete attrs[key]
        })

        let updateExpressionForSet = 'SET ';
        let updateExpressionForRemove = 'REMOVE ';
        const expressionAttributeNames: [string, string][] = [];
        const expressionAttributeValues: [string, string][] = [];

        Object.entries(attrs).forEach(([key, value]) => {
          expressionAttributeNames.push([`#${key}`, key])
          
          if (value !== undefined) {
            updateExpressionForSet += `#${key} = :${key}, `
            expressionAttributeValues.push([`:${key}`, attrs[key]])
          } else {
            updateExpressionForRemove += `#${key}, `
          }
        })

        // 最後のカンマとスペースを削除
        let updateExpression = '';
        if (updateExpressionForSet !== 'SET ') {
          updateExpressionForSet = updateExpressionForSet.slice(0, -2);
          updateExpression = updateExpression + updateExpressionForSet
        }
        
        if (updateExpressionForRemove !== 'REMOVE ') {
          updateExpressionForRemove = updateExpressionForRemove.slice(0, -2);
          updateExpression = updateExpression + ' ' + updateExpressionForRemove
        }

        return {
          UpdateExpression: updateExpression,
          ExpressionAttributeNames: Object.fromEntries(expressionAttributeNames),
          ExpressionAttributeValues: Object.fromEntries(expressionAttributeValues),
        };
      };

      const condition = {
        ...{
          Key: {
            ...entity.getKey()
          },
          ...buildDefaultUpdateQuery(entity),
        },
      } as UpdateItemInputBase;

      // 自前のConditionがあれば優先
      const response = await this.repository.updateAsync(
        customCondition || condition,
      );

      return {
        response,
        entity,
      };
    }

    async delete(
      entity: TEntity,
    ): Promise<AWS.DynamoDB.DocumentClient.DeleteItemOutput> {
      // バリデーションは基本いらないはず

      if (entity.id === undefined) {
        throw new KeyNullException('idがセットされていません。');
      }

      const condition = {
        Key: {
          ...entity.getKey()
        },
      } as DeleteItemInputBase;

      return await this.repository.deleteAsync(condition);
    }

    async transactWrite(
      params: TransactWriteItemsInput,
      ): Promise<TransactWriteItemsOutput> {
        return await this.repository.transactWriteAsync(params);
      }

    buildQueryInput(attributes: object): {
      ExpressionAttributeValues: Item;
      KeyConditionExpression: string;
    } {
      const exAttributes: Item = {};
      let KeyConditionExpression: string = '';

      for (const [key, value] of Object.entries(attributes)) {
        exAttributes[':' + key] = value;
        KeyConditionExpression = KeyConditionExpression.concat(
          `${key} = :${key}, `,
        );
      }

      // 最後のカンマを消す
      KeyConditionExpression = KeyConditionExpression.replace(/, $/, '');

      const ExpressionAttributeValues: Item = exAttributes;

      return { ExpressionAttributeValues, KeyConditionExpression };
    }

    async buildPutQuery(entity: TEntity): Promise<PutItemInput> {
      const attr = getAttributes(entity);
      delete attr.id;
      delete attr.errors;

      const condition = {
        Item: attr,
      } as PutItemInputBase;

      const PutItemInput = await this.repository.buildPutQuery(condition);
      return PutItemInput;
    }

    buildDeleteQuery(entity: TEntity): DeleteItemInput {
      const condition: DeleteItemInputBase = {
        Key: {
          ...entity.getKey()
        },
      };

      const deleteItemInput = this.repository.buildDeleteQuery(condition);

      return deleteItemInput;
    }

    validate(entity: TEntity): boolean {
      return entity.validate();
    }
  };
}

import * as AWS from 'aws-sdk';
import { EntityBase } from '../entities/entityBase';
import { CollectionBase } from '../collections/collectionBase';
import {
  DeleteItemInputBase,
  GetItemInputBase,
  PutItemInputBase,
  QueryInputBase,
  ScanInputBase,
  UpdateItemInputBase,
} from '../conditions';
import { DateTime } from 'luxon';
import { SEQUENCE_TABLE_NAME } from '../../../../lib/dynamoDB/sequenceTable';
import { PutItemInput, DeleteItemInput, TransactWriteItemsInput, TransactWriteItemsOutput } from 'aws-sdk/clients/dynamodb';

export interface IRepositoryBase<
  TEntity extends EntityBase,
  TCollection extends CollectionBase<TEntity>,
> {
  getAsync(condition: GetItemInputBase): Promise<TEntity | undefined>;
  queryAsync(condition: QueryInputBase): Promise<TCollection>;
  scanAllAsync(condition: ScanInputBase): Promise<TCollection>;
  putAsync(
    condition: PutItemInputBase,
  ): Promise<AWS.DynamoDB.DocumentClient.PutItemOutput>;
  updateAsync(
    condition: UpdateItemInputBase,
  ): Promise<AWS.DynamoDB.DocumentClient.UpdateItemOutput>;
  deleteAsync(
    condition: DeleteItemInputBase,
  ): Promise<AWS.DynamoDB.DocumentClient.DeleteItemOutput>;
  transactWriteAsync(
    condition: TransactWriteItemsInput,
  ): Promise<TransactWriteItemsOutput>;
  getSequence(): Promise<string>;
}

export abstract class RepositoryBase<
  TEntity extends EntityBase,
  TCollection extends CollectionBase<TEntity>,
> implements IRepositoryBase<TEntity, TCollection>
{
  /**
   * テーブル名
   */
  protected abstract tableName: string;

  /**
   * DBコンテキスト
   */
  protected dbContext: AWS.DynamoDB.DocumentClient;

  /**
   * コンストラクタ
   * @param dbContext DBコンテキスト
   */
  constructor(dbContext: AWS.DynamoDB.DocumentClient) {
    this.dbContext = dbContext;
  }

  /**
   * 選択 get
   * @param condition パラメータ
   * @returns TEntity もしくは undefined
   */
  public async getAsync(
    condition: GetItemInputBase,
  ): Promise<TEntity | undefined> {
    // パラメータ設定
    const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
      TableName: this.tableName,
      Key: condition.Key,
    };

    // コピー
    Object.assign(params, condition);

    // 発行するクエリをログに出す
    console.log("getAsync", params);

    // データ取得
    const output = await this.dbContext.get(params).promise();

    // エンティティ取得
    return this.getEntity(output.Item);
  }

  /**
   * query
   * @param condition パラメータ
   * @returns コレクション
   */
  public async queryAsync(condition: QueryInputBase): Promise<TCollection> {
    // DynamoDB queryパラメータ設定
    const params: AWS.DynamoDB.DocumentClient.QueryInput =
      this.createQueryParameters(condition);

    // 発行するクエリをログに出す
    console.log("queryAsync", params);

    // コレクション
    const collection = this.createCollection();

    const doQuery = async (
      parameters: AWS.DynamoDB.DocumentClient.QueryInput,
    ) => {
      // データ取得
      const output: AWS.DynamoDB.DocumentClient.QueryOutput =
        await this.dbContext.query(parameters).promise();

      // 結果がある場合、コレクションに詰める
      if (output.Items !== undefined) {
        for (const item of output.Items) {
          // エンティティ取得
          const entity = this.getEntity(item);

          if (entity !== undefined) {
            // コレクション追加
            collection.add(entity);
          }
        }
      }

      if (output.LastEvaluatedKey) {
        parameters.ExclusiveStartKey = output.LastEvaluatedKey;

        // 再帰的呼出
        await doQuery(parameters);
      }
    };

    // 実行
    await doQuery(params);

    collection.Count = collection.size;

    return collection;
  }

  /**
   * 選択 queryAll
   * @param parameter パラメータ
   * @returns コレクション
   */
  public async scanAllAsync(condition: ScanInputBase): Promise<TCollection> {
    // DynamoDB getItemパラメータ設定
    const params: AWS.DynamoDB.DocumentClient.QueryInput =
      this.createScanParameters(condition);

    // 発行するクエリをログに出す
    console.log("scanAllAsync", params);

    // コレクション
    const collection = this.createCollection();

    // query
    const doQuery = async (
      parameters: AWS.DynamoDB.DocumentClient.ScanInput,
    ) => {
      // データ取得
      const output: AWS.DynamoDB.DocumentClient.ScanOutput =
        await this.dbContext.scan(parameters).promise();

      // 結果がある場合、コレクションに詰める
      if (output.Items !== undefined) {
        for (const item of output.Items) {
          // エンティティ取得
          const entity = this.getEntity(item);

          if (entity !== undefined) {
            // コレクション追加
            collection.add(entity);
          }
        }
      }

      if (output.LastEvaluatedKey) {
        parameters.ExclusiveStartKey = output.LastEvaluatedKey;

        // 再帰的呼出
        await doQuery(parameters);
      }
    };

    // 実行
    await doQuery(params);

    collection.Count = collection.size;

    return collection;
  }

  /**
   * 登録
   * @param condition パラメータ
   * @returns 実行結果
   */
  public async putAsync(
    condition: PutItemInputBase,
  ): Promise<AWS.DynamoDB.DocumentClient.PutItemOutput> {
    // DynamoDB putItemパラメータ設定
    const params = await this.buildPutQuery(condition);

    // 発行するクエリをログに出す
    console.log("putAsync", params);
    // データ追加
    return this.dbContext.put(params).promise();
  }

  /**
   * 更新
   * @param condition パラメータ
   * @returns 実行結果
   */
  public async updateAsync(
    condition: UpdateItemInputBase,
  ): Promise<AWS.DynamoDB.DocumentClient.UpdateItemOutput> {
    // DynamoDB putItemパラメータ設定
    const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
      TableName: this.tableName,
      Key: condition.Key,
    };

    // パラメータコピー
    Object.assign(params, condition);

    // 発行するクエリをログに出す
    console.log("updateAsync", params);

    // 更新
    return this.dbContext.update(params).promise();
  }

  /**
   * 削除
   * @param condition パラメータ
   * @returns 実行結果
   */
  public async deleteAsync(
    condition: DeleteItemInputBase,
  ): Promise<AWS.DynamoDB.DocumentClient.DeleteItemOutput> {
    // DynamoDB deleteItemパラメータ設定
    const params: AWS.DynamoDB.DocumentClient.DeleteItemInput = {
      TableName: this.tableName,
      Key: condition.Key,
    };

    // パラメータコピー
    Object.assign(params, condition);

    // 発行するクエリをログに出す
    console.log("deleteAsync", params);

    // 削除
    return this.dbContext.delete(params).promise();
  }
  
  public async transactWriteAsync(
    params: TransactWriteItemsInput,
    ): Promise<TransactWriteItemsOutput> {
      
    // 発行するクエリをログに出す
    console.log("transactWriteAsync", params);
    
    return this.dbContext.transactWrite(params).promise();
  }

  public async buildPutQuery(
    condition: PutItemInputBase,
  ): Promise<PutItemInput> {
    const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
      TableName: this.tableName,
      Item: condition.Item,
    };

    const newId = await this.getSequence();

    params.Item = {
      ...params.Item,
      id: newId,
      createdAt: DateTime.now().toMillis(),
      updatedAt: DateTime.now().toMillis(),
    };

    return params;
  }

  public buildDeleteQuery(condition: DeleteItemInputBase): DeleteItemInput {
    const params: AWS.DynamoDB.DocumentClient.DeleteItemInput = {
      TableName: this.tableName,
      Key: condition.Key,
    };

    return params;
  }

  // 最新のシークエンス値を取得
  // 各テーブルの最新のid値を採番する
  // 若干雑な実装な気がするが一旦これで
  public async getSequence(): Promise<string> {
    const params = {
      TableName: SEQUENCE_TABLE_NAME,
      Key: { tableName: this.tableName },
      UpdateExpression: `ADD #currentNumber :val`,
      ExpressionAttributeNames: {
        '#currentNumber': 'currentNumber',
      },
      ExpressionAttributeValues: {
        ':val': 1,
      },
      ReturnValues: 'UPDATED_NEW',
    };

    console.log('getSequence', params);

    const updateItemOutput = await this.dbContext.update(params).promise();
    // if (updateItemOutput.Attributes?.currentNumber === undefined) {
    //   throw '最新のid取得に失敗しました。';
    // }

    return String(updateItemOutput?.Attributes?.currentNumber || 0);
    // return String(updateItemOutput.Attributes.currentNumber);
  }

  /**
   * エンティティ取得
   * @param item エンティティ
   * @returns エンティティ | undefined
   */
  protected abstract getEntity(
    item?: AWS.DynamoDB.DocumentClient.AttributeMap,
  ): TEntity | undefined;

  /**
   * コレクション作成（インスタンス生成のみ）
   */
  protected abstract createCollection(): TCollection;

  /**
   * queryパラメータ作成
   * @param condition 条件
   * @returns queryパラメータ
   */
  private createScanParameters(
    condition: ScanInputBase,
  ): AWS.DynamoDB.DocumentClient.ScanInput {
    // DynamoDB queryパラメータ設定
    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
      TableName: this.tableName,
    };

    // パラメータコピー
    Object.assign(params, condition);

    return params;
  }

  private createQueryParameters(
    condition: QueryInputBase,
  ): AWS.DynamoDB.DocumentClient.QueryInput {
    // DynamoDB queryパラメータ設定
    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
      TableName: this.tableName,
    };

    // パラメータコピー
    Object.assign(params, condition);

    return params;
  }
}

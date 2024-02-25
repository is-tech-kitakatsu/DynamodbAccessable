import * as AWS from 'aws-sdk';
import { EntityBase } from '../entities/entityBase';

export abstract class CollectionBase<
  TEntity extends EntityBase,
> extends Set<TEntity> {
  Count?: AWS.DynamoDB.Integer;
  ScannedCount?: AWS.DynamoDB.Integer;
  LastEvaluatedKey?: AWS.DynamoDB.DocumentClient.Key;
  ConsumedCapacity?: AWS.DynamoDB.DocumentClient.ConsumedCapacity;
}

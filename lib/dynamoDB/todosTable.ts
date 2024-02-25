import { defaultOptions } from "./shared/defaultOptions";
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

// テーブル名の定義
export const TODOS_TABLE_NAME = 'todos'

export const buildTodosTable = (scope: Construct) => {
  new dynamodb.Table(scope, 'todos-table', {
    ...defaultOptions,
    tableName: TODOS_TABLE_NAME,
    partitionKey: { //パーティションキーの定義
      name: 'userId',
      type: dynamodb.AttributeType.STRING,
    },
    sortKey: {
      name: 'createdAt',
      type: dynamodb.AttributeType.NUMBER,
    }
  });
} 
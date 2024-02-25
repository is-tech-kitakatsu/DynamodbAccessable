import { defaultOptions } from "./shared/defaultOptions";
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

// テーブル名の定義
export const USERS_TABLE_NAME = 'users'

export const buildUsersTable = (scope: Construct) => {
  new dynamodb.Table(scope, 'users-table', {
    ...defaultOptions,
    tableName: USERS_TABLE_NAME,
    partitionKey: { //パーティションキーの定義
      name: 'id',
      type: dynamodb.AttributeType.STRING,
    },
  });
} 
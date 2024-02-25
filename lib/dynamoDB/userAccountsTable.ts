import { defaultOptions } from "./shared/defaultOptions";
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

// テーブル名の定義
export const USER_ACCOUNTS_TABLE_NAME = 'userAccounts'

export const buildUserAccountsTable = (scope: Construct) => {
  const table = new dynamodb.Table(scope, 'user-accounts-table', {
    ...defaultOptions,
    tableName: USER_ACCOUNTS_TABLE_NAME,
    partitionKey: { //パーティションキーの定義
      name: 'userId',
      type: dynamodb.AttributeType.STRING,
    },
  });

  table.addGlobalSecondaryIndex(
    {
      indexName: 'email-password-index',
      partitionKey: { name: 'email', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'password', type: dynamodb.AttributeType.STRING },
    }
  )
  return table
} 
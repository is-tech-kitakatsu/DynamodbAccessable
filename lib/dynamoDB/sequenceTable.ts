import { defaultOptions } from "./shared/defaultOptions";
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

// テーブル名の定義
export const SEQUENCE_TABLE_NAME = 'sequences'

export const buildSequenceTable = (scope: Construct) => {
  // 第２引数はStack内で一意
  new dynamodb.Table(scope, 'sequence-table', {
    ...defaultOptions,
    tableName: SEQUENCE_TABLE_NAME,
    partitionKey: { //パーティションキーの定義
      name: 'tableName',
      type: dynamodb.AttributeType.STRING,
    },
  });
} 
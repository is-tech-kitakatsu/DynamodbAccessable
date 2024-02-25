import {
  ScanInput,
  QueryInput,
  UpdateItemInput,
  DeleteItemInput,
  PutItemInput,
  GetItemInput,
} from '@aws-sdk/client-dynamodb';

export type GetItemInputBase = Omit<GetItemInput, 'TableName' | 'Key'> & {
  Key: AWS.DynamoDB.DocumentClient.Key;
};
export type PutItemInputBase = Omit<PutItemInput, 'TableName'> & {
  Item: AWS.DynamoDB.DocumentClient.Key;
};
export type ScanInputBase = Omit<ScanInput, 'TableName'>;
export type QueryInputBase = Omit<QueryInput, 'TableName'>;
export type UpdateItemInputBase = Omit<UpdateItemInput, 'TableName'> & {
  Key: AWS.DynamoDB.DocumentClient.Key;
};
export type DeleteItemInputBase = Omit<DeleteItemInput, 'TableName'> & {
  Key: AWS.DynamoDB.DocumentClient.Key;
};

// aws-sdkから提供されたtypeの型を修正してより制約を課した状態で利用する

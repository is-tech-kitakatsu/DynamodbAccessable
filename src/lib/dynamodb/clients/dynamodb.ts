import * as AWS from 'aws-sdk';

export const dynamodbClient = new AWS.DynamoDB.DocumentClient({
  apiVersion: '2012-08-10',
  region: 'ap-northeast-1',
});

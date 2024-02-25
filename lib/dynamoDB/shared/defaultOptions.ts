import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as cdk from 'aws-cdk-lib';

// https://qiita.com/yamato1491038/items/f388afa3aa4f701321f5
export const defaultOptions: Partial<dynamodb.TableProps> = {
  billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,  // オンデマンド請求
  pointInTimeRecovery: true, // PITRを有効化
  timeToLiveAttribute: 'expired', // TTLの設定
  removalPolicy: cdk.RemovalPolicy.DESTROY, // cdk destroyでDB削除可
}
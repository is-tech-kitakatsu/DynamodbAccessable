import { Construct } from "constructs";
import { resourceNameUserAccount } from '../../apiGateway/userAccounts';
import { defaultOptions } from '../shared/defaultOptions';
import * as cdk from 'aws-cdk-lib';
import path from "path";
export const functionUserAccountUpdate = (scope: Construct, iamRole: cdk.aws_iam.Role) => {
  const functionNameUserAccountUpdate = `${resourceNameUserAccount}Update`

  return new cdk.aws_lambda_nodejs.NodejsFunction(scope, functionNameUserAccountUpdate, {
    ...defaultOptions,
    functionName: functionNameUserAccountUpdate,
    role: iamRole,
    entry: path.join(__dirname, '../../../src/functions/userAccounts/update/handler.ts')
  });
}

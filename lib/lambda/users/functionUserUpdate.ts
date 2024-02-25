import { Construct } from "constructs";
import { resourceNameUser } from '../../apiGateway/users';
import { defaultOptions } from '../shared/defaultOptions';
import * as cdk from 'aws-cdk-lib';
import path from "path";
export const functionUserUpdate = (scope: Construct, iamRole: cdk.aws_iam.Role) => {
  const functionNameUserUpdate = `${resourceNameUser}Update`

  return new cdk.aws_lambda_nodejs.NodejsFunction(scope, functionNameUserUpdate, {
    ...defaultOptions,
    functionName: functionNameUserUpdate,
    role: iamRole,
    entry: path.join(__dirname, '../../../src/functions/users/update/handler.ts')
  });
}

import { Construct } from "constructs";
import { resourceNameUser } from '../../apiGateway/users';
import { defaultOptions } from '../shared/defaultOptions';
import path from "path";
import * as cdk from 'aws-cdk-lib';

export const functionUserDelete = (scope: Construct, iamRole: cdk.aws_iam.Role) => {
  const functionNameUserDelete = `${resourceNameUser}Delete`

  return new cdk.aws_lambda_nodejs.NodejsFunction(scope, functionNameUserDelete, {
    ...defaultOptions,
    functionName: functionNameUserDelete,
    role: iamRole,
    entry: path.join(__dirname, '../../../src/functions/users/delete/handler.ts')
  });
}

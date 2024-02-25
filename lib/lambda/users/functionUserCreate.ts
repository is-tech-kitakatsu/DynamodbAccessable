import { Construct } from "constructs";
import { resourceNameUser } from '../../apiGateway/users';
import { defaultOptions } from '../shared/defaultOptions';
import * as cdk from 'aws-cdk-lib';
import path from "path";
export const functionUserCreate = (scope: Construct, iamRole: cdk.aws_iam.Role) => {
  const functionNameUserCreate = `${resourceNameUser}Create`

  return new cdk.aws_lambda_nodejs.NodejsFunction(scope, functionNameUserCreate, {
    ...defaultOptions,
    functionName: functionNameUserCreate,
    role: iamRole,
    entry: path.join(__dirname, '../../../src/functions/users/create/handler.ts')
  });
}

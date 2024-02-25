import { Construct } from "constructs";
import { resourceNameUser } from '../../apiGateway/users';
import { defaultOptions } from '../shared/defaultOptions';
import path from "path";
import * as cdk from 'aws-cdk-lib';

export const functionUserDetail = (scope: Construct, iamRole: cdk.aws_iam.Role) => {
  const functionNameUserDetail = `${resourceNameUser}Detail`

  return new cdk.aws_lambda_nodejs.NodejsFunction(scope, functionNameUserDetail, {
    ...defaultOptions,
    functionName: functionNameUserDetail,
    role: iamRole,
    entry: path.join(__dirname, '../../../src/functions/users/detail/handler.ts')
  });
}

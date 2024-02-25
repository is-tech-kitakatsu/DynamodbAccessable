import { Construct } from "constructs";
import { resourceNameTodo } from '../../apiGateway/todos';
import { defaultOptions } from '../shared/defaultOptions';
import path from "path";
import * as cdk from 'aws-cdk-lib';

export const functionTodoDetail = (scope: Construct, iamRole: cdk.aws_iam.Role) => {
  const functionNameTodoDetail = `${resourceNameTodo}Detail`

  return new cdk.aws_lambda_nodejs.NodejsFunction(scope, functionNameTodoDetail, {
    ...defaultOptions,
    functionName: functionNameTodoDetail,
    role: iamRole,
    entry: path.join(__dirname, '../../../src/functions/todos/detail/handler.ts')
  });
}

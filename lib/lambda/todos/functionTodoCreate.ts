import { Construct } from "constructs";
import { resourceNameTodo } from '../../apiGateway/todos';
import { defaultOptions } from '../shared/defaultOptions';
import * as cdk from 'aws-cdk-lib';
import path from "path";
export const functionTodoCreate = (scope: Construct, iamRole: cdk.aws_iam.Role) => {
  const functionNameTodoCreate = `${resourceNameTodo}Create`

  return new cdk.aws_lambda_nodejs.NodejsFunction(scope, functionNameTodoCreate, {
    ...defaultOptions,
    functionName: functionNameTodoCreate,
    role: iamRole,
    entry: path.join(__dirname, '../../../src/functions/todos/create/handler.ts')
  });
}

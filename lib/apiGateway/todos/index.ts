import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { functionTodoCreate, functionTodoDelete, functionTodoDetail, functionTodoIndex, functionTodoUpdate } from '../../lambda/todos';
import { RouteMapping } from '../routes';
import { IamRoles } from '../../iamRole';

export const resourceNameTodo = 'todos'

export const defineApiGatewayTodo = (scope: Construct, route: RouteMapping, iamRoles: IamRoles): void => {
  //リソースにGETメソッド、Lambda統合プロキシを指定
  route.apiTodos.addMethod(
    'GET',
    new LambdaIntegration(functionTodoIndex(scope, iamRoles.lambdaBasicRole)),
    {
      requestParameters: {
        'method.request.path.userId': true, // https://www.codewithyou.com/blog/validating-request-parameters-and-body-in-amazon-api-gateway-with-aws-cdk
      },
      requestValidatorOptions: {
        validateRequestParameters: true,
      },
    }
  );

  route.apiTodo.addMethod(
    'GET',
    new LambdaIntegration(functionTodoDetail(scope, iamRoles.lambdaBasicRole)),
    {
      requestParameters: {
        'method.request.path.userId': true, // https://www.codewithyou.com/blog/validating-request-parameters-and-body-in-amazon-api-gateway-with-aws-cdk
        'method.request.path.todoId': true,
      },
      requestValidatorOptions: {
        validateRequestParameters: true,
      },
    }
  );

  route.apiTodo.addMethod(
    'POST',
    new LambdaIntegration(functionTodoCreate(scope, iamRoles.lambdaBasicRole)),
    {
      requestParameters: {
        'method.request.path.userId': true, // https://www.codewithyou.com/blog/validating-request-parameters-and-body-in-amazon-api-gateway-with-aws-cdk
      },
      requestValidatorOptions: {
        validateRequestParameters: true,
      },
    }
  );

  route.apiTodo.addMethod(
    'PATCH',
    new LambdaIntegration(functionTodoUpdate(scope, iamRoles.lambdaBasicRole)),
    {
      requestParameters: {
        'method.request.path.userId': true, // https://www.codewithyou.com/blog/validating-request-parameters-and-body-in-amazon-api-gateway-with-aws-cdk
        'method.request.path.todoId': true,
      },
      requestValidatorOptions: {
        validateRequestParameters: true,
      },
    }
  );

  route.apiTodo.addMethod(
    'DELETE',
    new LambdaIntegration(functionTodoDelete(scope, iamRoles.lambdaBasicRole)),
    {
      requestParameters: {
        'method.request.path.userId': true, // https://www.codewithyou.com/blog/validating-request-parameters-and-body-in-amazon-api-gateway-with-aws-cdk
        'method.request.path.todoId': true,
      },
      requestValidatorOptions: {
        validateRequestParameters: true,
      },
    }
  );
}

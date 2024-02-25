import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { functionUserCreate, functionUserDetail, functionUserUpdate } from '../../lambda/users';
import { RouteMapping } from '../routes';
import { IamRoles } from '../../iamRole';
import { functionUserDelete } from '../../lambda/users/functionUserDelete';

export const resourceNameUser = 'users'

export const defineApiGatewayUser = (scope: Construct, route: RouteMapping, iamRoles: IamRoles): void => {
  route.apiUsers.addMethod(
    'POST',
    new LambdaIntegration(functionUserCreate(scope, iamRoles.lambdaBasicRole)),
    {
      requestValidatorOptions: {
        validateRequestParameters: true,
      },
    }
  );

  route.apiUser.addMethod(
    'GET',
    new LambdaIntegration(functionUserDetail(scope, iamRoles.lambdaBasicRole)),
    {
      requestParameters: {
        'method.request.path.userId': true,
      },
      requestValidatorOptions: {
        validateRequestParameters: true,
      },
    }
  );

  route.apiUser.addMethod(
    'PATCH',
    new LambdaIntegration(functionUserUpdate(scope, iamRoles.lambdaBasicRole)),
    {
      requestParameters: {
        'method.request.path.userId': true,
      },
      requestValidatorOptions: {
        validateRequestParameters: true,
      },
    }
  );

  route.apiUser.addMethod(
    'DELETE',
    new LambdaIntegration(functionUserDelete(scope, iamRoles.lambdaBasicRole)),
    {
      requestParameters: {
        'method.request.path.userId': true,
      },
      requestValidatorOptions: {
        validateRequestParameters: true,
      },
    }
  );
}

import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { RouteMapping } from '../routes';
import { IamRoles } from '../../iamRole';
import { functionUserAccountUpdate } from '../../lambda/userAccounts';

export const resourceNameUserAccount = 'userAccount'

export const defineApiGatewayUserAccount = (scope: Construct, route: RouteMapping, iamRoles: IamRoles): void => {
  route.apiUserAccount.addMethod(
    'PATCH',
    new LambdaIntegration(functionUserAccountUpdate(scope, iamRoles.lambdaBasicRole)),
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

import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import { restApi } from './apiGateway/restApi';
import { buildRoutes } from './apiGateway/routes';
import { dynamoTables } from './dynamoDB';
import { buildIamRoles } from './iamRole';
import { defineApiGateway } from './apiGateway';

export class GatewaySampleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const restApiObj = restApi(this)
    const router = buildRoutes(restApiObj)
    const iamRoles = buildIamRoles(this)

    defineApiGateway(this, router, iamRoles)
    dynamoTables(this)
  }
}

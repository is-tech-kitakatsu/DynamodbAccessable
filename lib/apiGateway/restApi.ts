import { RestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";

// API Gateway RestAPIの作成
export const restApi = (scope: Construct) => {
  return new RestApi(scope, "api", {
    restApiName: `SampleGateway`,
    deployOptions: {
      stageName: 'v1',
    },
  });
}

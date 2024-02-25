import { Runtime } from "aws-cdk-lib/aws-lambda"
import * as cdk from 'aws-cdk-lib';
import path from "path";
import { NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";

export const defaultOptions: Partial<NodejsFunctionProps> = {
  handler: "index.handler",
  runtime: Runtime.NODEJS_20_X,
  memorySize: 512,
  timeout: cdk.Duration.seconds(10),
//https://qiita.com/takmot/items/0fa7f589d318b8e5ea16
  bundling: {
    minify: true,
    sourceMap: true,
    externalModules: ["@aws-sdk/*"],
    tsconfig: path.join(__dirname, "../../tsconfig.json"),
    format: cdk.aws_lambda_nodejs.OutputFormat.ESM,
    banner: "import { createRequire } from 'module';const require = createRequire(import.meta.url);",
  }
}
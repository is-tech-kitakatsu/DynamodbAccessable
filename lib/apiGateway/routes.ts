import { RestApi } from "aws-cdk-lib/aws-apigateway";
import { resourceNameTodo } from "./todos";
import { Resource } from "aws-cdk-lib/aws-apigateway/lib";
import { resourceNameUserAccount } from "./userAccounts";
import { resourceNameUser } from "./users";

export type RouteMapping = Record<string, Resource>

export const buildRoutes = (restApi: RestApi): RouteMapping => {
  const apiUsers = restApi.root.addResource(resourceNameUser);
  const apiUser = apiUsers.addResource('{userId}');
  const apiUserAccount = apiUser.addResource(resourceNameUserAccount);
  const apiTodos = apiUser.addResource(resourceNameTodo);
  const apiTodo = apiTodos.addResource('{todoId}')

  return {
    apiUserAccount,
    apiUsers,
    apiUser,
    apiTodos,
    apiTodo
  }
}
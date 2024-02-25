import { Construct } from "constructs"
import { RouteMapping } from "./routes"
import { IamRoles } from "lib/iamRole"
import { defineApiGatewayTodo } from "./todos"
import { defineApiGatewayUser } from "./users"
import { defineApiGatewayUserAccount } from "./userAccounts"

export const defineApiGateway = (scope: Construct, router: RouteMapping, iamRoles: IamRoles): void => {
  defineApiGatewayTodo(scope, router, iamRoles)
  defineApiGatewayUser(scope, router, iamRoles)
  defineApiGatewayUserAccount(scope, router, iamRoles)
}
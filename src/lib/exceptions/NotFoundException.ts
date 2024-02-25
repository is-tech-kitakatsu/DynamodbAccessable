import { HttpBaseException } from "./HttpBaseException";

export class NotFoundException extends HttpBaseException {
  statusCode() { return 404 }
}
